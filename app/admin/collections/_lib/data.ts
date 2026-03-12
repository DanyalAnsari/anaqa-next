import "server-only";

import { db } from "@/database";
import { collection, product } from "@/database/schemas";
import { eq, desc, count } from "drizzle-orm";

export interface CollectionItem {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	imageFilePath: string;
	isActive: boolean;
	isFeatured: boolean;
	productCount: number;
	createdAt: Date;
}

export async function getCollections(): Promise<CollectionItem[]> {
	const collections = await db
		.select()
		.from(collection)
		.orderBy(desc(collection.createdAt));

	return Promise.all(
		collections.map(async (c) => {
			const [{ productCount }] = await db
				.select({ productCount: count() })
				.from(product)
				.where(eq(product.collectionId, c.id));

			return {
				id: c.id,
				name: c.name,
				slug: c.slug,
				description: c.description,
				imageFilePath: c.imageFilePath,
				isActive: c.isActive,
				isFeatured: c.isFeatured,
				productCount,
				createdAt: c.createdAt,
			};
		}),
	);
}

export async function getCollectionById(id: string) {
	const [c] = await db
		.select()
		.from(collection)
		.where(eq(collection.id, id))
		.limit(1);
	return c ?? null;
}
