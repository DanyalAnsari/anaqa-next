import "server-only";

import { db } from "@/database";
import { shopOrder, user, product, orderItem } from "@/database/schemas";
import { eq, sql, desc, and, gte, count } from "drizzle-orm";

export interface DashboardStats {
	totalRevenue: number;
	totalOrders: number;
	totalCustomers: number;
	totalProducts: number;
	revenueChange: number;
	ordersChange: number;
	customersChange: number;
	productsChange: number;
}

export interface RecentOrder {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	status:
		| "pending"
		| "confirmed"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	total: number;
	itemsCount: number;
	createdAt: Date;
}

// Get date 30 days ago for comparison
function getComparisonDate() {
	const date = new Date();
	date.setDate(date.getDate() - 30);
	return date;
}

// Get date 60 days ago for previous period
function getPreviousPeriodDate() {
	const date = new Date();
	date.setDate(date.getDate() - 60);
	return date;
}

export async function getDashboardStats(): Promise<DashboardStats> {
	const now = new Date();
	const thirtyDaysAgo = getComparisonDate();
	const sixtyDaysAgo = getPreviousPeriodDate();

	// Current period stats
	const [revenueResult, ordersResult, customersResult, productsResult] =
		await Promise.all([
			// Total revenue (paid orders)
			db
				.select({ total: sql<number>`COALESCE(SUM(${shopOrder.total}), 0)` })
				.from(shopOrder)
				.where(eq(shopOrder.paymentStatus, "paid")),

			// Total orders
			db.select({ count: count() }).from(shopOrder),

			// Total customers
			db.select({ count: count() }).from(user).where(eq(user.role, "customer")),

			// Active products
			db
				.select({ count: count() })
				.from(product)
				.where(eq(product.isActive, true)),
		]);

	// Previous period stats for comparison
	const [
		prevRevenueResult,
		prevOrdersResult,
		prevCustomersResult,
		prevProductsResult,
	] = await Promise.all([
		// Revenue last 30 days
		db
			.select({ total: sql<number>`COALESCE(SUM(${shopOrder.total}), 0)` })
			.from(shopOrder)
			.where(
				and(
					eq(shopOrder.paymentStatus, "paid"),
					gte(shopOrder.createdAt, thirtyDaysAgo),
				),
			),

		// Orders last 30 days
		db
			.select({ count: count() })
			.from(shopOrder)
			.where(gte(shopOrder.createdAt, thirtyDaysAgo)),

		// Customers last 30 days
		db
			.select({ count: count() })
			.from(user)
			.where(
				and(eq(user.role, "customer"), gte(user.createdAt, thirtyDaysAgo)),
			),

		// Products last 30 days
		db
			.select({ count: count() })
			.from(product)
			.where(
				and(eq(product.isActive, true), gte(product.createdAt, thirtyDaysAgo)),
			),
	]);

	// Previous previous period (30-60 days ago) for calculating change
	const [prevPrevRevenueResult, prevPrevOrdersResult, prevPrevCustomersResult] =
		await Promise.all([
			db
				.select({ total: sql<number>`COALESCE(SUM(${shopOrder.total}), 0)` })
				.from(shopOrder)
				.where(
					and(
						eq(shopOrder.paymentStatus, "paid"),
						gte(shopOrder.createdAt, sixtyDaysAgo),
						sql`${shopOrder.createdAt} < ${thirtyDaysAgo}`,
					),
				),

			db
				.select({ count: count() })
				.from(shopOrder)
				.where(
					and(
						gte(shopOrder.createdAt, sixtyDaysAgo),
						sql`${shopOrder.createdAt} < ${thirtyDaysAgo}`,
					),
				),

			db
				.select({ count: count() })
				.from(user)
				.where(
					and(
						eq(user.role, "customer"),
						gte(user.createdAt, sixtyDaysAgo),
						sql`${user.createdAt} < ${thirtyDaysAgo}`,
					),
				),
		]);

	// Calculate percentage changes
	function calcChange(current: number, previous: number): number {
		if (previous === 0) return current > 0 ? 100 : 0;
		return Math.round(((current - previous) / previous) * 100 * 10) / 10;
	}

	const currentRevenue = Number(prevRevenueResult[0]?.total ?? 0);
	const prevRevenue = Number(prevPrevRevenueResult[0]?.total ?? 0);

	const currentOrders = prevOrdersResult[0]?.count ?? 0;
	const prevOrders = prevPrevOrdersResult[0]?.count ?? 0;

	const currentCustomers = prevCustomersResult[0]?.count ?? 0;
	const prevCustomers = prevPrevCustomersResult[0]?.count ?? 0;

	return {
		totalRevenue: Number(revenueResult[0]?.total ?? 0),
		totalOrders: ordersResult[0]?.count ?? 0,
		totalCustomers: customersResult[0]?.count ?? 0,
		totalProducts: productsResult[0]?.count ?? 0,
		revenueChange: calcChange(currentRevenue, prevRevenue),
		ordersChange: calcChange(currentOrders, prevOrders),
		customersChange: calcChange(currentCustomers, prevCustomers),
		productsChange: 0, // Products don't typically have a "change" metric
	};
}

export async function getRecentOrders(limit = 10): Promise<RecentOrder[]> {
	const orders = await db
		.select({
			id: shopOrder.id,
			orderNumber: shopOrder.orderNumber,
			customerName: shopOrder.shippingFullName,
			status: shopOrder.status,
			paymentStatus: shopOrder.paymentStatus,
			total: shopOrder.total,
			createdAt: shopOrder.createdAt,
			userId: shopOrder.userId,
		})
		.from(shopOrder)
		.orderBy(desc(shopOrder.createdAt))
		.limit(limit);

	// Get item counts and customer emails
	const ordersWithDetails = await Promise.all(
		orders.map(async (order) => {
			const [itemCountResult, customerResult] = await Promise.all([
				db
					.select({ count: count() })
					.from(orderItem)
					.where(eq(orderItem.orderId, order.id)),
				db
					.select({ email: user.email })
					.from(user)
					.where(eq(user.id, order.userId))
					.limit(1),
			]);

			return {
				id: order.id,
				orderNumber: order.orderNumber,
				customerName: order.customerName,
				customerEmail: customerResult[0]?.email ?? "",
				status: order.status,
				paymentStatus: order.paymentStatus,
				total: Number(order.total),
				itemsCount: itemCountResult[0]?.count ?? 0,
				createdAt: order.createdAt,
			};
		}),
	);

	return ordersWithDetails;
}

export async function getLowStockProducts(threshold = 10, limit = 5) {
	const lowStockProducts = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			totalStock: product.totalStock,
		})
		.from(product)
		.where(
			and(
				eq(product.isActive, true),
				sql`${product.totalStock} <= ${threshold}`,
			),
		)
		.orderBy(product.totalStock)
		.limit(limit);

	return lowStockProducts;
}

export async function getTopSellingProducts(limit = 5) {
	const topProducts = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			soldCount: product.soldCount,
			price: product.price,
		})
		.from(product)
		.where(eq(product.isActive, true))
		.orderBy(desc(product.soldCount))
		.limit(limit);

	return topProducts;
}
