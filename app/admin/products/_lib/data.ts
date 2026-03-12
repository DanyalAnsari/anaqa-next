import "server-only";

import { db } from "@/database";
import {
	product,
	productImage,
	productVariant,
	category,
} from "@/database/schemas";
import { eq, desc, ilike, and, count } from "drizzle-orm";

export interface ProductListItem {
	id: string;
	name: string;
	slug: string;
	price: number;
	comparePrice: number | null;
	categoryName: string;
	totalStock: number;
	isActive: boolean;
	isFeatured: boolean;
	soldCount: number;
	primaryImage: string | null;
	createdAt: Date;
}

export interface ProductDetail {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	shortDescription: string | null;
	price: number;
	comparePrice: number | null;
	categoryId: string;
	collectionId: string | null;
	tags: string[];
	gender: string;
	isActive: boolean;
	isFeatured: boolean;
	images: {
		id: string;
		fileId: string;
		filePath: string;
		altText: string | null;
		position: number;
	}[];
	variants: { id: string; size: string; stock: number; sku: string }[];
}

export interface ProductsFilters {
	search?: string;
	status?: "all" | "active" | "inactive";
	page?: number;
	pageSize?: number;
}

export async function getProducts(filters: ProductsFilters = {}) {
	const { search = "", status = "all", page = 1, pageSize = 10 } = filters;

	const conditions = [];
	if (search) conditions.push(ilike(product.name, `%${search}%`));
	if (status === "active") conditions.push(eq(product.isActive, true));
	if (status === "inactive") conditions.push(eq(product.isActive, false));

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: count() })
		.from(product)
		.where(whereClause);

	const products = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			comparePrice: product.comparePrice,
			totalStock: product.totalStock,
			isActive: product.isActive,
			isFeatured: product.isFeatured,
			soldCount: product.soldCount,
			categoryId: product.categoryId,
			createdAt: product.createdAt,
		})
		.from(product)
		.where(whereClause)
		.orderBy(desc(product.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const enriched: ProductListItem[] = await Promise.all(
		products.map(async (p) => {
			const [catResult, imgResult] = await Promise.all([
				db
					.select({ name: category.name })
					.from(category)
					.where(eq(category.id, p.categoryId))
					.limit(1),
				db
					.select({ filePath: productImage.filePath })
					.from(productImage)
					.where(eq(productImage.productId, p.id))
					.orderBy(productImage.position)
					.limit(1),
			]);
			return {
				id: p.id,
				name: p.name,
				slug: p.slug,
				price: Number(p.price),
				comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
				categoryName: catResult[0]?.name ?? "Uncategorized",
				totalStock: p.totalStock,
				isActive: p.isActive,
				isFeatured: p.isFeatured,
				soldCount: p.soldCount,
				primaryImage: imgResult[0]?.filePath ?? null,
				createdAt: p.createdAt,
			};
		}),
	);

	return {
		products: enriched,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getProductById(
	id: string,
): Promise<ProductDetail | null> {
	const [p] = await db
		.select()
		.from(product)
		.where(eq(product.id, id))
		.limit(1);
	if (!p) return null;

	const [images, variants] = await Promise.all([
		db
			.select()
			.from(productImage)
			.where(eq(productImage.productId, id))
			.orderBy(productImage.position),
		db.select().from(productVariant).where(eq(productVariant.productId, id)),
	]);

	return {
		id: p.id,
		name: p.name,
		slug: p.slug,
		description: p.description,
		shortDescription: p.shortDescription,
		price: Number(p.price),
		comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
		categoryId: p.categoryId,
		collectionId: p.collectionId,
		tags: p.tags,
		gender: p.gender,
		isActive: p.isActive,
		isFeatured: p.isFeatured,
		images: images.map((i) => ({
			id: i.id,
			fileId: i.fileId,
			filePath: i.filePath,
			altText: i.altText,
			position: i.position,
		})),
		variants: variants.map((v) => ({
			id: v.id,
			size: v.size,
			stock: v.stock,
			sku: v.sku,
		})),
	};
}

export async function getCategories() {
	return db
		.select({ id: category.id, name: category.name, slug: category.slug })
		.from(category)
		.where(eq(category.isActive, true))
		.orderBy(category.name);
}
