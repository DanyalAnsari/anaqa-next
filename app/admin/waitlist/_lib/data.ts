import "server-only";

import { db } from "@/database";
import { waitlist, product, user } from "@/database/schemas";
import { eq, desc, count, and } from "drizzle-orm";

export interface WaitlistItem {
	id: string;
	email: string;
	userName: string | null;
	productName: string;
	productId: string;
	variantSize: string;
	notified: boolean;
	notifiedAt: Date | null;
	createdAt: Date;
}

export interface WaitlistFilters {
	status?: "all" | "pending" | "notified";
	page?: number;
	pageSize?: number;
}

export async function getWaitlist(filters: WaitlistFilters = {}) {
	const { status = "all", page = 1, pageSize = 20 } = filters;

	const conditions = [];
	if (status === "pending") conditions.push(eq(waitlist.notified, false));
	if (status === "notified") conditions.push(eq(waitlist.notified, true));
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: count() })
		.from(waitlist)
		.where(whereClause);

	const items = await db
		.select()
		.from(waitlist)
		.where(whereClause)
		.orderBy(desc(waitlist.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const enriched: WaitlistItem[] = await Promise.all(
		items.map(async (w) => {
			const [productData, userData] = await Promise.all([
				db
					.select({ name: product.name })
					.from(product)
					.where(eq(product.id, w.productId))
					.limit(1),
				w.userId ?
					db
						.select({ name: user.name })
						.from(user)
						.where(eq(user.id, w.userId))
						.limit(1)
				:	Promise.resolve([]),
			]);
			return {
				id: w.id,
				email: w.email,
				userName: userData[0]?.name ?? null,
				productName: productData[0]?.name ?? "Unknown",
				productId: w.productId,
				variantSize: w.variantSize,
				notified: w.notified,
				notifiedAt: w.notifiedAt,
				createdAt: w.createdAt,
			};
		}),
	);

	return {
		items: enriched,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getWaitlistStats() {
	const [stats] = await db
		.select({
			total: count(),
			pending: db.$count(waitlist, eq(waitlist.notified, false)),
			notified: db.$count(waitlist, eq(waitlist.notified, true)),
		})
		.from(waitlist);

	return {
		total: stats.total,
		pending: Number(stats.pending),
		notified: Number(stats.notified),
	};
}
