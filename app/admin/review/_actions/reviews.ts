"use server";

import { db } from "@/database";
import { review, product } from "@/database/schemas";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Result = { success: true } | { success: false; error: string };

async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user || session.user.role !== "admin")
		throw new Error("Unauthorized");
}

async function recalculateProductRating(productId: string) {
	const [stats] = await db
		.select({
			avg: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
			count: sql<number>`COUNT(*)`,
		})
		.from(review)
		.where(eq(review.productId, productId));

	await db
		.update(product)
		.set({
			averageRating: Math.round(Number(stats.avg) * 100) / 100 + "",
			reviewCount: Number(stats.count),
		})
		.where(eq(product.id, productId));
}

export async function approveReview(id: string): Promise<Result> {
	try {
		await requireAdmin();
		const [r] = await db
			.select({ productId: review.productId })
			.from(review)
			.where(eq(review.id, id))
			.limit(1);
		if (!r) return { success: false, error: "Review not found" };

		await db
			.update(review)
			.set({ isApproved: true, updatedAt: new Date() })
			.where(eq(review.id, id));
		await recalculateProductRating(r.productId);

		revalidatePath("/admin/reviews");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to approve review" };
	}
}

export async function rejectReview(id: string): Promise<Result> {
	try {
		await requireAdmin();
		const [r] = await db
			.select({ productId: review.productId })
			.from(review)
			.where(eq(review.id, id))
			.limit(1);
		if (!r) return { success: false, error: "Review not found" };

		await db
			.update(review)
			.set({ isApproved: false, updatedAt: new Date() })
			.where(eq(review.id, id));
		await recalculateProductRating(r.productId);

		revalidatePath("/admin/reviews");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to reject review" };
	}
}

export async function deleteReview(id: string): Promise<Result> {
	try {
		await requireAdmin();
		const [r] = await db
			.select({ productId: review.productId })
			.from(review)
			.where(eq(review.id, id))
			.limit(1);
		if (!r) return { success: false, error: "Review not found" };

		await db.delete(review).where(eq(review.id, id));
		await recalculateProductRating(r.productId);

		revalidatePath("/admin/reviews");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to delete review" };
	}
}
