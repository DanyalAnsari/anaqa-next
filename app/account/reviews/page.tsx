// app/account/reviews/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database";
import { review, product, productImage } from "@/database/schemas";
import { eq, desc } from "drizzle-orm";
import { ReviewsClient } from "./_components/reviews-client";

export default async function ReviewsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) return null;

	const reviews = await db
		.select({
			id: review.id,
			productId: review.productId,
			orderId: review.orderId,
			rating: review.rating,
			title: review.title,
			comment: review.comment,
			isVerifiedPurchase: review.isVerifiedPurchase,
			isApproved: review.isApproved,
			createdAt: review.createdAt,
			updatedAt: review.updatedAt,
			productName: product.name,
			productSlug: product.slug,
			productPrice: product.price,
			productIsActive: product.isActive,
		})
		.from(review)
		.innerJoin(product, eq(review.productId, product.id))
		.where(eq(review.userId, session.user.id))
		.orderBy(desc(review.createdAt));

	// Fetch primary images for reviewed products
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

	const serializedReviews = reviews.map((r) => {
		const image = imageMap.get(r.productId);
		const imageUrl =
			image?.filePath ?
				image.filePath.startsWith("http") ?
					image.filePath
				:	`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${image.filePath}`
			:	null;

		return {
			id: r.id,
			productId: r.productId,
			orderId: r.orderId,
			rating: r.rating,
			title: r.title,
			comment: r.comment,
			isVerifiedPurchase: r.isVerifiedPurchase,
			isApproved: r.isApproved,
			createdAt: r.createdAt,
			updatedAt: r.updatedAt,
			productName: r.productName,
			productSlug: r.productSlug,
			productPrice: Number(r.productPrice),
			productIsActive: r.productIsActive,
			imageUrl,
			imageAlt: image?.altText ?? r.productName,
		};
	});

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
				<p className="text-muted-foreground mt-1">
					View and manage your product reviews and ratings.
				</p>
			</div>

			<ReviewsClient reviews={serializedReviews} />
		</div>
	);
}
