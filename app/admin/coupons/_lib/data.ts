import "server-only";

import { db } from "@/database";
import { coupon, couponUsage, user } from "@/database/schemas";
import { eq, desc, count, ilike, and, gte, lte, sql } from "drizzle-orm";

export interface CouponItem {
	id: string;
	code: string;
	description: string | null;
	discountType: "percentage" | "fixed";
	discountValue: number;
	minimumPurchase: number | null;
	maximumDiscount: number | null;
	usageLimit: number;
	usedCount: number;
	perUserLimit: number;
	validFrom: Date;
	validUntil: Date;
	isActive: boolean;
	createdAt: Date;
}

export interface CouponUsageItem {
	id: string;
	userName: string;
	userEmail: string;
	usedAt: Date;
}

export interface CouponsFilters {
	search?: string;
	status?: "all" | "active" | "inactive" | "expired";
	page?: number;
	pageSize?: number;
}

export async function getCoupons(filters: CouponsFilters = {}) {
	const { search = "", status = "all", page = 1, pageSize = 10 } = filters;

	const conditions = [];
	if (search) conditions.push(ilike(coupon.code, `%${search}%`));
	if (status === "active") conditions.push(eq(coupon.isActive, true), gte(coupon.validUntil, new Date()));
	if (status === "inactive") conditions.push(eq(coupon.isActive, false));
	if (status === "expired") conditions.push(lte(coupon.validUntil, new Date()));

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db.select({ total: count() }).from(coupon).where(whereClause);

	const coupons = await db
		.select()
		.from(coupon)
		.where(whereClause)
		.orderBy(desc(coupon.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	return {
		coupons: coupons.map((c) => ({
			id: c.id,
			code: c.code,
			description: c.description,
			discountType: c.discountType,
			discountValue: Number(c.discountValue),
			minimumPurchase: c.minimumPurchase ? Number(c.minimumPurchase) : null,
			maximumDiscount: c.maximumDiscount ? Number(c.maximumDiscount) : null,
			usageLimit: c.usageLimit,
			usedCount: c.usedCount,
			perUserLimit: c.perUserLimit,
			validFrom: c.validFrom,
			validUntil: c.validUntil,
			isActive: c.isActive,
			createdAt: c.createdAt,
		})),
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getCouponById(id: string) {
	const [c] = await db.select().from(coupon).where(eq(coupon.id, id)).limit(1);
	return c ?? null;
}

export async function getCouponUsage(couponId: string): Promise<CouponUsageItem[]> {
	const usages = await db
		.select({ id: couponUsage.id, userId: couponUsage.userId, usedAt: couponUsage.usedAt })
		.from(couponUsage)
		.where(eq(couponUsage.couponId, couponId))
		.orderBy(desc(couponUsage.usedAt));

	return Promise.all(
		usages.map(async (u) => {
			const [userData] = await db.select({ name: user.name, email: user.email }).from(user).where(eq(user.id, u.userId)).limit(1);
			return { id: u.id, userName: userData?.name ?? "Unknown", userEmail: userData?.email ?? "", usedAt: u.usedAt };
		})
	);
}