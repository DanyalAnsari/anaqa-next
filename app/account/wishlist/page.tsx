import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import { WishlistClient } from "./_components/wishlist-client";
import { db } from "@/database";
import { product, productImage, wishlist } from "@/database/schemas";

export default async function WishlistPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) return null;

	const items = await db
		.select({
			productId: wishlist.productId,
			createdAt: wishlist.createdAt,
			product: {
				id: product.id,
				name: product.name,
				slug: product.slug,
				price: product.price,
				comparePrice: product.comparePrice,
				isActive: product.isActive,
				totalStock: product.totalStock,
				averageRating: product.averageRating,
				reviewCount: product.reviewCount,
			},
		})
		.from(wishlist)
		.innerJoin(product, eq(wishlist.productId, product.id))
		.where(eq(wishlist.userId, session.user.id))
		.orderBy(asc(wishlist.createdAt));

	// Fetch first image for each product
	const productIds = items.map((i) => i.productId);

	const images =
		productIds.length > 0 ?
			await db
				.select({
					productId: productImage.productId,
					filePath: productImage.filePath,
					altText: productImage.altText,
				})
				.from(productImage)
				.where(
					and(
						eq(productImage.position, 0),
						// drizzle inArray
						...[productIds.length > 0 ? undefined : undefined],
					),
				)
		:	[];

	// Simpler approach — fetch images for all products at position 0
	const productPrimaryImages = await db
		.select({
			productId: productImage.productId,
			filePath: productImage.filePath,
			altText: productImage.altText,
		})
		.from(productImage)
		.where(eq(productImage.position, 0));

	const imageMap = new Map(
		productPrimaryImages.map((img) => [img.productId, img]),
	);

	const wishlistItems = items.map((item) => ({
		productId: item.productId,
		createdAt: item.createdAt,
		product: {
			...item.product,
			price: Number(item.product.price),
			comparePrice:
				item.product.comparePrice ? Number(item.product.comparePrice) : null,
			averageRating: Number(item.product.averageRating),
			image: imageMap.get(item.productId) ?? null,
		},
	}));

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
				<p className="text-muted-foreground mt-1">
					Items you&apos;ve saved for later.
				</p>
			</div>

			<WishlistClient items={wishlistItems} />
		</div>
	);
}
