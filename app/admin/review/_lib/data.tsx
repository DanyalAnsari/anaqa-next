import "server-only";

import { db } from "@/database";
import { review, user, product } from "@/database/schemas";
import { eq, desc, count, and, ilike } from "drizzle-orm";

export interface ReviewItem {
	id: string;
	userName: string;
	userEmail: string;
	productName: string;
	productId: string;
	rating: number;
	title: string;
	comment: string;
	isVerifiedPurchase: boolean;
	isApproved: boolean;
	createdAt: Date;
}

export interface ReviewsFilters {
	status?: "all" | "pending" | "approved";
	page?: number;
	pageSize?: number;
}

export async function getReviews(filters: ReviewsFilters = {}) {
	const { status = "all", page = 1, pageSize = 10 } = filters;

	const conditions = [];
	if (status === "pending") conditions.push(eq(review.isApproved, false));
	if (status === "approved") conditions.push(eq(review.isApproved, true));
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: count() })
		.from(review)
		.where(whereClause);

	const reviews = await db
		.select()
		.from(review)
		.where(whereClause)
		.orderBy(desc(review.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const enriched: ReviewItem[] = await Promise.all(
		reviews.map(async (r) => {
			const [userData, productData] = await Promise.all([
				db
					.select({ name: user.name, email: user.email })
					.from(user)
					.where(eq(user.id, r.userId))
					.limit(1),
				db
					.select({ name: product.name })
					.from(product)
					.where(eq(product.id, r.productId))
					.limit(1),
			]);
			return {
				id: r.id,
				userName: userData[0]?.name ?? "Unknown",
				userEmail: userData[0]?.email ?? "",
				productName: productData[0]?.name ?? "Unknown Product",
				productId: r.productId,
				rating: r.rating,
				title: r.title,
				comment: r.comment,
				isVerifiedPurchase: r.isVerifiedPurchase,
				isApproved: r.isApproved,
				createdAt: r.createdAt,
			};
		}),
	);

	return {
		reviews: enriched,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getReviewStats() {
	const [stats] = await db
		.select({
			total: count(),
			pending: db.$count(review, eq(review.isApproved, false)),
			approved: db.$count(review, eq(review.isApproved, true)),
		})
		.from(review);

	return {
		total: stats.total,
		pending: Number(stats.pending),
		approved: Number(stats.approved),
	};
}
