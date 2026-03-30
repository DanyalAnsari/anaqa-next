import { db } from "@/database";
import { product, productImage, category } from "@/database/schemas";
import { eq, and, sql, asc } from "drizzle-orm";
import { SearchClient } from "./_components/search-client";

interface SearchPageProps {
	searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { q } = await searchParams;
	const query = q?.trim() || "";

	// Fetch categories for browse section
	const categories = await db
		.select({ id: category.id, name: category.name, slug: category.slug })
		.from(category)
		.where(and(eq(category.isActive, true), eq(category.level, 0)))
		.orderBy(asc(category.sortOrder))
		.limit(8);

	// Search if query exists
	let results: any[] = [];
	if (query) {
		const searchResults = await db
			.select({
				id: product.id,
				name: product.name,
				slug: product.slug,
				price: product.price,
				comparePrice: product.comparePrice,
				averageRating: product.averageRating,
				reviewCount: product.reviewCount,
				totalStock: product.totalStock,
			})
			.from(product)
			.where(
				and(
					eq(product.isActive, true),
					sql`(
            ${product.name} ILIKE ${"%" + query + "%"} OR
            ${product.description} ILIKE ${"%" + query + "%"} OR
            ${product.shortDescription} ILIKE ${"%" + query + "%"} OR
            EXISTS (
              SELECT 1 FROM unnest(${product.tags}) AS t
              WHERE t ILIKE ${"%" + query + "%"}
            )
          )`,
				),
			)
			.limit(20);

		// Fetch images
		const ids = searchResults.map((p) => p.id);
		const images =
			ids.length > 0 ?
				await db
					.select({
						productId: productImage.productId,
						filePath: productImage.filePath,
						altText: productImage.altText,
					})
					.from(productImage)
					.where(eq(productImage.position, 0))
			:	[];

		const imageMap = new Map(
			images
				.filter((i) => ids.includes(i.productId))
				.map((i) => [i.productId, i]),
		);

		results = searchResults.map((p) => {
			const img = imageMap.get(p.id);
			return {
				id: p.id,
				name: p.name,
				slug: p.slug,
				price: Number(p.price),
				comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
				averageRating: Number(p.averageRating),
				reviewCount: p.reviewCount,
				totalStock: p.totalStock,
				imageFilePath: img?.filePath ?? null,
				imageAlt: img?.altText ?? p.name,
			};
		});
	}

	return (
		<SearchClient
			initialQuery={query}
			initialResults={results}
			categories={categories}
		/>
	);
}
