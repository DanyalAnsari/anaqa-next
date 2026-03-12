"use server";

import { db } from "@/database";
import { coupon } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const couponSchema = z.object({
	code: z.string().min(3).toUpperCase(),
	description: z.string().optional(),
	discountType: z.enum(["percentage", "fixed"]),
	discountValue: z.coerce.number().min(0),
	minimumPurchase: z.coerce.number().optional(),
	maximumDiscount: z.coerce.number().optional(),
	usageLimit: z.coerce.number().int().min(1),
	perUserLimit: z.coerce.number().int().min(1).default(1),
	validFrom: z.string(),
	validUntil: z.string(),
	isActive: z.boolean().default(true),
});

type Result<T = void> =
	| { success: true; data?: T }
	| { success: false; error: string };

async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user || session.user.role !== "admin")
		throw new Error("Unauthorized");
}

export async function createCoupon(
	input: z.infer<typeof couponSchema>,
): Promise<Result<{ id: string }>> {
	try {
		await requireAdmin();
		const data = couponSchema.parse(input);
		const id = nanoid();

		await db.insert(coupon).values({
			id,
			code: data.code,
			description: data.description || null,
			discountType: data.discountType,
			discountValue: data.discountValue.toString(),
			minimumPurchase: data.minimumPurchase?.toString() || null,
			maximumDiscount: data.maximumDiscount?.toString() || null,
			usageLimit: data.usageLimit,
			perUserLimit: data.perUserLimit,
			validFrom: new Date(data.validFrom),
			validUntil: new Date(data.validUntil),
			isActive: data.isActive,
		});

		revalidatePath("/admin/coupons");
		return { success: true, data: { id } };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to create coupon",
		};
	}
}

export async function updateCoupon(
	id: string,
	input: z.infer<typeof couponSchema>,
): Promise<Result> {
	try {
		await requireAdmin();
		const data = couponSchema.parse(input);

		await db
			.update(coupon)
			.set({
				code: data.code,
				description: data.description || null,
				discountType: data.discountType,
				discountValue: data.discountValue.toString(),
				minimumPurchase: data.minimumPurchase?.toString() || null,
				maximumDiscount: data.maximumDiscount?.toString() || null,
				usageLimit: data.usageLimit,
				perUserLimit: data.perUserLimit,
				validFrom: new Date(data.validFrom),
				validUntil: new Date(data.validUntil),
				isActive: data.isActive,
				updatedAt: new Date(),
			})
			.where(eq(coupon.id, id));

		revalidatePath("/admin/coupons");
		return { success: true };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to update coupon",
		};
	}
}

export async function toggleCouponActive(
	id: string,
	isActive: boolean,
): Promise<Result> {
	try {
		await requireAdmin();
		await db
			.update(coupon)
			.set({ isActive, updatedAt: new Date() })
			.where(eq(coupon.id, id));
		revalidatePath("/admin/coupons");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to update coupon" };
	}
}

export async function deleteCoupon(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db.delete(coupon).where(eq(coupon.id, id));
		revalidatePath("/admin/coupons");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to delete coupon" };
	}
}
