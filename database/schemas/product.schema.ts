import {
	boolean,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { genderEnum, sizeEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// Category  (adjacency-list tree)
//
// `level` enforces max depth — validate in app: if parent.level >= MAX, reject.
// `sortOrder` (not `order`) — avoids collision with SQL reserved word.
//
// If drizzle-kit complains about the self-referencing FK, remove .references()
// and add it manually in migration SQL:
//   ALTER TABLE category ADD CONSTRAINT category_parent_fk
//   FOREIGN KEY (parent_category_id) REFERENCES category(id) ON DELETE SET NULL;
// ─────────────────────────────────────────────────────────────────────────────

export const category = pgTable(
	"category",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		description: text("description"),
		parentCategoryId: text("parent_category_id").references(
			(): any => category.id,
			{ onDelete: "set null" },
		),
		level: integer("level").notNull().default(0), // depth in tree — enforce max in app
		sortOrder: integer("sort_order").notNull().default(0),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [index("category_parent_idx").on(t.parentCategoryId)],
);

export const collection = pgTable("collection", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	imageFileId: text("image_file_id").notNull(),
	imageFilePath: text("image_file_path").notNull(),
	isActive: boolean("is_active").notNull().default(true),
	isFeatured: boolean("is_featured").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// Product
//
// averageRating, reviewCount, totalStock are CACHED AGGREGATES.
// Update in the same transaction as the source mutation. Drift = bug.
//
// soldCount is incremented on order confirmation, not on cart add.
//
// CHECK constraints (compare_price, stock, etc.) are in migration SQL.
// ─────────────────────────────────────────────────────────────────────────────

export const product = pgTable(
	"product",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		description: text("description"),
		shortDescription: text("short_description"),
		price: numeric("price", { precision: 12, scale: 2 }).notNull(),
		comparePrice: numeric("compare_price", { precision: 12, scale: 2 }),
		categoryId: text("category_id")
			.notNull()
			.references(() => category.id),
		collectionId: text("collection_id").references(() => collection.id, {
			onDelete: "set null",
		}),
		tags: text("tags").array().notNull().default([]),
		gender: genderEnum("gender").notNull(),
		totalStock: integer("total_stock").notNull().default(0),
		isActive: boolean("is_active").notNull().default(true),
		isFeatured: boolean("is_featured").notNull().default(false),
		averageRating: numeric("average_rating", { precision: 3, scale: 2 })
			.notNull()
			.default("0"),
		reviewCount: integer("review_count").notNull().default(0),
		soldCount: integer("sold_count").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		index("product_category_idx").on(t.categoryId),
		index("product_collection_idx").on(t.collectionId),
		index("product_active_category_price_idx").on(
			t.isActive,
			t.categoryId,
			t.price,
		),
		index("product_active_gender_price_idx").on(t.isActive, t.gender, t.price),
		index("product_active_featured_idx").on(t.isActive, t.isFeatured),
		index("product_active_sold_idx").on(t.isActive, t.soldCount),
		index("product_active_rating_idx").on(t.isActive, t.averageRating),
		index("product_active_created_idx").on(t.isActive, t.createdAt),
		index("product_active_stock_idx").on(t.isActive, t.totalStock),
	],
);

// ─────────────────────────────────────────────────────────────────────────────
// Product Images
//
// Position is unique per product — prevents ambiguous ordering.
// fileId: ImageKit file ID for deletion. filePath: for URL construction.
// ─────────────────────────────────────────────────────────────────────────────

export const productImage = pgTable(
	"product_image",
	{
		id: text("id").primaryKey(),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		fileId: text("file_id").notNull(),
		filePath: text("file_path").notNull(),
		altText: text("alt_text"),
		position: integer("position").notNull().default(0),
	},
	(t) => [
		index("product_image_product_idx").on(t.productId),
		uniqueIndex("product_image_product_position_uq").on(
			t.productId,
			t.position,
		),
	],
);

// ─────────────────────────────────────────────────────────────────────────────
// Product Variants  (one row per size per product)
//
// CHECK constraint on stock >= 0 is in migration SQL.
// ─────────────────────────────────────────────────────────────────────────────

export const productVariant = pgTable(
	"product_variant",
	{
		id: text("id").primaryKey(),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		size: sizeEnum("size").notNull(),
		stock: integer("stock").notNull().default(0),
		sku: text("sku").notNull().unique(),
	},
	(t) => [
		index("product_variant_product_idx").on(t.productId),
		uniqueIndex("product_variant_product_size_uq").on(t.productId, t.size),
	],
);
