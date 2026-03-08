import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { review } from "./review.schema";
import { wishlist } from "./wishlist.schema";
import { cartItem } from "./cart.schema";
import { orderItem } from "./order.schema";
import { waitlist } from "./waitlist.schema";

export const genderEnum = pgEnum("gender", ["men", "women", "unisex"]);
export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]);

// ─────────────────────────────────────────────────────────────────────────────
// Category  (adjacency-list tree)
//
// Self-referencing FK: if drizzle-kit complains about the circular reference,
// remove .references() and add it manually in the migration SQL:
//   ALTER TABLE category ADD CONSTRAINT category_parent_fk
//   FOREIGN KEY (parent_category_id) REFERENCES category(id) ON DELETE SET NULL;
//
// `sortOrder` (not `order`) — avoids collision with the SQL reserved word ORDER.
// ─────────────────────────────────────────────────────────────────────────────

export const category = pgTable("category", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	parentCategoryId: text("parent_category_id").references(
		(): any => category.id,
		{ onDelete: "set null" },
	),
	sortOrder: integer("sort_order").notNull().default(0),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

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
// averageRating and reviewCount are CACHED AGGREGATES, not live computed values.
// They must be updated in the same transaction as every review insert/update/delete.
// Letting them drift silently is a data integrity bug — treat updates as mandatory.
//
// totalStock is a cached aggregate of SUM(productVariant.stock).
// Recompute it on every variant stock mutation.
//
// soldCount is incremented on order confirmation, not on cart add.
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
		totalStock: integer("total_stock").notNull().default(0), // cached aggregate
		isActive: boolean("is_active").notNull().default(true),
		isFeatured: boolean("is_featured").notNull().default(false),
		averageRating: numeric("average_rating", { precision: 3, scale: 2 })
			.notNull()
			.default("0"), // cached aggregate
		reviewCount: integer("review_count").notNull().default(0), // cached aggregate
		soldCount: integer("sold_count").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
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

export const productImage = pgTable(
	"product_image",
	{
		id: text("id").primaryKey(),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		fileId: text("file_id").notNull(), // ImageKit file ID — needed for delete
		filePath: text("file_path").notNull(), // ImageKit path — used for URL construction
		altText: text("alt_text"), // SEO / accessibility
		position: integer("position").notNull().default(0),
	},
	(t) => [index("product_image_product_idx").on(t.productId)],
);

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

export const categoryRelations = relations(category, ({ one, many }) => ({
	parent: one(category, {
		fields: [category.parentCategoryId],
		references: [category.id],
		relationName: "subcategories",
	}),
	subcategories: many(category, { relationName: "subcategories" }),
	products: many(product),
}));

export const collectionRelations = relations(collection, ({ many }) => ({
	products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id],
	}),
	collection: one(collection, {
		fields: [product.collectionId],
		references: [collection.id],
	}),
	images: many(productImage),
	variants: many(productVariant),
	reviews: many(review),
	wishlistEntries: many(wishlist),
	cartItems: many(cartItem),
	orderItems: many(orderItem),
	waitlistEntries: many(waitlist),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
	product: one(product, {
		fields: [productImage.productId],
		references: [product.id],
	}),
}));

export const productVariantRelations = relations(productVariant, ({ one }) => ({
	product: one(product, {
		fields: [productVariant.productId],
		references: [product.id],
	}),
}));
