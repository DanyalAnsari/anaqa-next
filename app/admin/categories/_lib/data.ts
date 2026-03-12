import "server-only";

import { db } from "@/database";
import { category, product } from "@/database/schemas";
import { eq, asc, count, sql, isNull } from "drizzle-orm";

export interface CategoryItem {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	parentCategoryId: string | null;
	parentName: string | null;
	level: number;
	sortOrder: number;
	isActive: boolean;
	productCount: number;
	createdAt: Date;
}

export interface CategoryOption {
	id: string;
	name: string;
	level: number;
}

export async function getCategories(): Promise<CategoryItem[]> {
	const parentAlias = db
		.select({ id: category.id, name: category.name })
		.from(category)
		.as("parent");

	const categories = await db
		.select({
			id: category.id,
			name: category.name,
			slug: category.slug,
			description: category.description,
			parentCategoryId: category.parentCategoryId,
			level: category.level,
			sortOrder: category.sortOrder,
			isActive: category.isActive,
			createdAt: category.createdAt,
		})
		.from(category)
		.orderBy(asc(category.level), asc(category.sortOrder), asc(category.name));

	const enriched: CategoryItem[] = await Promise.all(
		categories.map(async (cat) => {
			const [productCount, parentResult] = await Promise.all([
				db
					.select({ count: count() })
					.from(product)
					.where(eq(product.categoryId, cat.id)),
				cat.parentCategoryId ?
					db
						.select({ name: category.name })
						.from(category)
						.where(eq(category.id, cat.parentCategoryId))
						.limit(1)
				:	Promise.resolve([]),
			]);

			return {
				...cat,
				parentName: parentResult[0]?.name ?? null,
				productCount: productCount[0]?.count ?? 0,
			};
		}),
	);

	return enriched;
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
	return db
		.select({ id: category.id, name: category.name, level: category.level })
		.from(category)
		.where(eq(category.isActive, true))
		.orderBy(asc(category.level), asc(category.name));
}

export async function getCategoryById(id: string) {
	const [cat] = await db
		.select()
		.from(category)
		.where(eq(category.id, id))
		.limit(1);
	return cat ?? null;
}
