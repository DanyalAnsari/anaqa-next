import { db } from "@/database";
import { collection } from "../schemas";
import { and, desc, eq } from "drizzle-orm";

export async function getFeaturedCollections(limit = 5) {
	const { id, name, slug, description, imageFilePath } = collection;
	const featuredCollections = await db
		.select({
			id,
			name,
			slug,
			description,
			imageFilePath,
		})
		.from(collection)
		.where(and(eq(collection.isActive, true), eq(collection.isFeatured, true)))
		.orderBy(desc(collection.createdAt))
		.limit(limit);

	return featuredCollections;
}
