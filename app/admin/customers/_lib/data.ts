import "server-only";

import { auth } from "@/lib/auth";
import { db } from "@/database";
import { user, shopOrder, address, review, wishlist, orderItem } from "@/database/schemas";
import { eq, sql, count, desc } from "drizzle-orm";
import { headers } from "next/headers";

export interface Customer {
	id: string;
	name: string;
	email: string;
	image: string | null;
	phone: string | null;
	role: string;
	banned: boolean;
	banReason: string | null;
	banExpires: Date | null;
	emailVerified: boolean;
	createdAt: Date;
	ordersCount: number;
	totalSpent: number;
}

export interface CustomersFilters {
	search?: string;
	status?: "all" | "active" | "banned";
	role?: "all" | "customer" | "admin";
	page?: number;
	pageSize?: number;
	sortBy?: "createdAt" | "name" | "email";
	sortDirection?: "asc" | "desc";
}

export interface CustomerDetail {
	id: string;
	name: string;
	email: string;
	image: string | null;
	phone: string | null;
	role: string;
	banned: boolean;
	banReason: string | null;
	banExpires: Date | null;
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	ordersCount: number;
	totalSpent: number;
	addresses: {
		id: string;
		label: string;
		fullName: string;
		phone: string;
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
		isDefault: boolean;
	}[];
	recentOrders: {
		id: string;
		orderNumber: string;
		status: string;
		paymentStatus: string;
		total: number;
		itemsCount: number;
		createdAt: Date;
	}[];
	reviewsCount: number;
	wishlistCount: number;
}

export async function getCustomers(filters: CustomersFilters = {}) {
	const {
		search = "",
		status = "all",
		role = "all",
		page = 1,
		pageSize = 10,
		sortBy = "createdAt",
		sortDirection = "desc",
	} = filters;

	// Use better-auth listUsers API
	const response = await auth.api.listUsers({
		headers: await headers(),
		query: {
			limit: pageSize,
			offset: (page - 1) * pageSize,
			sortBy,
			sortDirection,
			...(search && {
				searchValue: search,
				searchField: "email",
				searchOperator: "contains",
			}),
			...(status === "banned" && {
				filterField: "banned",
				filterValue: true,
				filterOperator: "eq",
			}),
			...(status === "active" && {
				filterField: "banned",
				filterValue: false,
				filterOperator: "eq",
			}),
			...(role !== "all" && {
				filterField: "role",
				filterValue: role,
				filterOperator: "eq",
			}),
		},
	});

	// Get order stats for each user
	const userIds = response.users.map((u) => u.id);

	const orderStats =
		userIds.length > 0 ?
			await db
				.select({
					userId: shopOrder.userId,
					ordersCount: count().as("ordersCount"),
					totalSpent:
						sql<number>`COALESCE(SUM(CASE WHEN ${shopOrder.paymentStatus} = 'paid' THEN ${shopOrder.total} ELSE 0 END), 0)`.as(
							"totalSpent",
						),
				})
				.from(shopOrder)
				.where(sql`${shopOrder.userId} IN ${userIds}`)
				.groupBy(shopOrder.userId)
		:	[];

	const statsMap = new Map(orderStats.map((s) => [s.userId, s]));

	const customers: Customer[] = response.users.map((u) => {
		const stats = statsMap.get(u.id);
		return {
			id: u.id,
			name: u.name,
			email: u.email,
			image: u.image ?? null,
			phone: (u as any).phone ?? null,
			role: u.role ?? "customer",
			banned: u.banned ?? false,
			banReason: u.banReason ?? null,
			banExpires: u.banExpires ? new Date(u.banExpires) : null,
			emailVerified: u.emailVerified ?? false,
			createdAt: new Date(u.createdAt),
			ordersCount: Number(stats?.ordersCount ?? 0),
			totalSpent: Number(stats?.totalSpent ?? 0),
		};
	});

	return {
		customers,
		total: response.total,
		page,
		pageSize,
		totalPages: Math.ceil(response.total / pageSize),
	};
}

export async function getCustomerStats() {
	const [stats] = await db
		.select({
			total: count(),
			active: sql<number>`COUNT(CASE WHEN ${user.banned} = false OR ${user.banned} IS NULL THEN 1 END)`,
			banned: sql<number>`COUNT(CASE WHEN ${user.banned} = true THEN 1 END)`,
			verified: sql<number>`COUNT(CASE WHEN ${user.emailVerified} = true THEN 1 END)`,
			admins: sql<number>`COUNT(CASE WHEN ${user.role} = 'admin' THEN 1 END)`,
		})
		.from(user);

	return {
		total: stats.total,
		active: Number(stats.active),
		banned: Number(stats.banned),
		verified: Number(stats.verified),
		admins: Number(stats.admins),
	};
}

export async function getCustomerById(id: string) {
	const response = await auth.api.getUser({
		headers: await headers(),
		query: { id },
	});

	if (!response) return null;

	// Get order stats
	const [orderStats] = await db
		.select({
			ordersCount: count().as("ordersCount"),
			totalSpent:
				sql<number>`COALESCE(SUM(CASE WHEN ${shopOrder.paymentStatus} = 'paid' THEN ${shopOrder.total} ELSE 0 END), 0)`.as(
					"totalSpent",
				),
		})
		.from(shopOrder)
		.where(eq(shopOrder.userId, id));

	return {
		...response,
		phone: (response as any).phone ?? null,
		ordersCount: Number(orderStats?.ordersCount ?? 0),
		totalSpent: Number(orderStats?.totalSpent ?? 0),
	};
}

export async function getCustomerDetail(
	id: string,
): Promise<CustomerDetail | null> {
	const [userData] = await db
		.select()
		.from(user)
		.where(eq(user.id, id))
		.limit(1);

	if (!userData) return null;

	const [orderStats, addresses, recentOrders, reviewsResult, wishlistResult] =
		await Promise.all([
			db
				.select({
					ordersCount: count(),
					totalSpent: sql<number>`COALESCE(SUM(CASE WHEN ${shopOrder.paymentStatus} = 'paid' THEN ${shopOrder.total} ELSE 0 END), 0)`,
				})
				.from(shopOrder)
				.where(eq(shopOrder.userId, id)),

			db
				.select()
				.from(address)
				.where(eq(address.userId, id))
				.orderBy(desc(address.isDefault), desc(address.createdAt)),

			db
				.select({
					id: shopOrder.id,
					orderNumber: shopOrder.orderNumber,
					status: shopOrder.status,
					paymentStatus: shopOrder.paymentStatus,
					total: shopOrder.total,
					createdAt: shopOrder.createdAt,
				})
				.from(shopOrder)
				.where(eq(shopOrder.userId, id))
				.orderBy(desc(shopOrder.createdAt))
				.limit(10),

			db.select({ count: count() }).from(review).where(eq(review.userId, id)),

			db
				.select({ count: count() })
				.from(wishlist)
				.where(eq(wishlist.userId, id)),
		]);

	// Get item counts for recent orders
	const ordersWithItems = await Promise.all(
		recentOrders.map(async (o) => {
			const [{ itemsCount }] = await db
				.select({ itemsCount: count() })
				.from(orderItem)
				.where(eq(orderItem.orderId, o.id));
			return {
				...o,
				total: Number(o.total),
				itemsCount,
			};
		}),
	);

	return {
		id: userData.id,
		name: userData.name,
		email: userData.email,
		image: userData.image,
		phone: userData.phone,
		role: userData.role ?? "customer",
		banned: userData.banned ?? false,
		banReason: userData.banReason,
		banExpires: userData.banExpires,
		emailVerified: userData.emailVerified,
		createdAt: userData.createdAt,
		updatedAt: userData.updatedAt,
		ordersCount: orderStats[0]?.ordersCount ?? 0,
		totalSpent: Number(orderStats[0]?.totalSpent ?? 0),
		addresses: addresses.map((a) => ({
			id: a.id,
			label: a.label,
			fullName: a.fullName,
			phone: a.phone,
			street: a.street,
			city: a.city,
			state: a.state,
			postalCode: a.postalCode,
			country: a.country,
			isDefault: a.isDefault,
		})),
		recentOrders: ordersWithItems,
		reviewsCount: reviewsResult[0]?.count ?? 0,
		wishlistCount: wishlistResult[0]?.count ?? 0,
	};
}
