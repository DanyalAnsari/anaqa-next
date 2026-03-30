import { and, desc, eq } from "drizzle-orm";
import { db } from "..";
import { product, productImage } from "../schemas";

export async function getTopSellingProducts(limit = 5) {
	const featuredProducts = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			comparePrice: product.comparePrice,
			averageRating: product.averageRating,
			reviewCount: product.reviewCount,
			totalStock: product.totalStock,
			isActive: product.isActive,
		})
		.from(product)
		.where(and(eq(product.isActive, true), eq(product.isFeatured, true)))
		.orderBy(desc(product.soldCount))
		.limit(limit);

	return featuredProducts;
}

export const getProductsPrimaryImages = async () => {
	const primaryImages = await db
		.select({
			productId: productImage.productId,
			filePath: productImage.filePath,
			altText: productImage.altText,
		})
		.from(productImage)
		.where(eq(productImage.position, 0));

	return primaryImages;
};
