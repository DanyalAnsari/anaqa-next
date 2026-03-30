import { and, asc, eq } from "drizzle-orm";
import { db } from "..";
import { category } from "../schemas";

export const getCategories = async (limit: number = 5) => {
	const categories = await db
		.select({
			id: category.id,
			name: category.name,
			slug: category.slug,
		})
		.from(category)
		.where(and(eq(category.isActive, true), eq(category.level, 0)))
		.orderBy(asc(category.sortOrder))
		.limit(limit);

	return categories;
};
