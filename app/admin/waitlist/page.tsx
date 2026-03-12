import "server-only";

import { db } from "@/database";
import { newsletter } from "@/database/schemas";
import { eq, desc, count, ilike, and } from "drizzle-orm";

export interface SubscriberItem {
	id: string;
	email: string;
	isActive: boolean;
	subscribedAt: Date;
	unsubscribedAt: Date | null;
}

export interface SubscribersFilters {
	search?: string;
	status?: "all" | "active" | "unsubscribed";
	page?: number;
	pageSize?: number;
}

export async function getSubscribers(filters: SubscribersFilters = {}) {
	const { search = "", status = "all", page = 1, pageSize = 20 } = filters;

	const conditions = [];
	if (search) conditions.push(ilike(newsletter.email, `%${search}%`));
	if (status === "active") conditions.push(eq(newsletter.isActive, true));
	if (status === "unsubscribed")
		conditions.push(eq(newsletter.isActive, false));
	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: count() })
		.from(newsletter)
		.where(whereClause);

	const subscribers = await db
		.select()
		.from(newsletter)
		.where(whereClause)
		.orderBy(desc(newsletter.subscribedAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	return {
		subscribers: subscribers.map((s) => ({
			id: s.id,
			email: s.email,
			isActive: s.isActive,
			subscribedAt: s.subscribedAt,
			unsubscribedAt: s.unsubscribedAt,
		})),
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getSubscriberStats() {
	const [stats] = await db
		.select({
			total: count(),
			active: db.$count(newsletter, eq(newsletter.isActive, true)),
		})
		.from(newsletter);

	return {
		total: stats.total,
		active: Number(stats.active),
		unsubscribed: stats.total - Number(stats.active),
	};
}
