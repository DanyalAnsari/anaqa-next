// app/account/reviews/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database";
import { review, product } from "@/database/schemas";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult = { success: true } | { success: false; error: string };

const updateReviewSchema = z.object({
	rating: z.number().int().min(1).max(5),
	title: z.string().min(2, "Title must be at least 2 characters").max(100),
	comment: z
		.string()
		.min(10, "Review must be at least 10 characters")
		.max(1000),
});

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export async function updateReview(
	reviewId: string,
	input: UpdateReviewInput,
): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		const parsed = updateReviewSchema.safeParse(input);
		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.errors[0]?.message ?? "Invalid input",
			};
		}

		// Verify ownership
		const [existing] = await db
			.select({ id: review.id, productId: review.productId })
			.from(review)
			.where(and(eq(review.id, reviewId), eq(review.userId, session.user.id)))
			.limit(1);

		if (!existing) {
			return { success: false, error: "Review not found" };
		}

		await db
			.update(review)
			.set({
				rating: parsed.data.rating,
				title: parsed.data.title,
				comment: parsed.data.comment,
				isApproved: false, // Re-submit for moderation after edit
				updatedAt: new Date(),
			})
			.where(eq(review.id, reviewId));

		// Recalculate product average rating
		await recalculateProductRating(existing.productId);

		revalidatePath("/account/reviews");
		revalidatePath(`/products`);

		return { success: true };
	} catch (error) {
		console.error("Update review error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update review",
		};
	}
}

export async function deleteReview(reviewId: string): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		// Verify ownership
		const [existing] = await db
			.select({ id: review.id, productId: review.productId })
			.from(review)
			.where(and(eq(review.id, reviewId), eq(review.userId, session.user.id)))
			.limit(1);

		if (!existing) {
			return { success: false, error: "Review not found" };
		}

		await db
			.delete(review)
			.where(and(eq(review.id, reviewId), eq(review.userId, session.user.id)));

		// Recalculate product average rating
		await recalculateProductRating(existing.productId);

		revalidatePath("/account/reviews");
		revalidatePath(`/products`);

		return { success: true };
	} catch (error) {
		console.error("Delete review error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete review",
		};
	}
}

async function recalculateProductRating(productId: string) {
	const [stats] = await db
		.select({
			avgRating: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
			count: sql<number>`COUNT(*)::int`,
		})
		.from(review)
		.where(and(eq(review.productId, productId), eq(review.isApproved, true)));

	await db
		.update(product)
		.set({
			averageRating: String(Number(stats.avgRating).toFixed(2)),
			reviewCount: stats.count,
			updatedAt: new Date(),
		})
		.where(eq(product.id, productId));
}
