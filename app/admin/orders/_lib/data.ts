import "server-only";

import { db } from "@/database";
import {
	shopOrder,
	orderItem,
	orderStatusHistory,
	user,
} from "@/database/schemas";
import { eq, sql, desc, asc, count, ilike, and } from "drizzle-orm";

export type OrderStatus =
	| "pending"
	| "confirmed"
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderListItem {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	paymentMethod: string;
	total: number;
	itemsCount: number;
	createdAt: Date;
}

export interface OrderDetail {
	id: string;
	orderNumber: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	paymentMethod: string;
	subtotal: number;
	shipping: number;
	discount: number;
	tax: number;
	total: number;
	shippingFullName: string;
	shippingPhone: string;
	shippingStreet: string;
	shippingCity: string;
	shippingState: string;
	shippingPostalCode: string;
	shippingCountry: string;
	shippingMethod: string;
	customerNote: string | null;
	adminNote: string | null;
	couponCode: string | null;
	createdAt: Date;
	customer: {
		id: string;
		name: string;
		email: string;
		phone: string | null;
	} | null;
	items: {
		id: string;
		title: string;
		sizeLabel: string;
		imageUrl: string | null;
		quantity: number;
		unitPrice: number;
		totalPrice: number;
	}[];
	statusHistory: {
		id: string;
		status: OrderStatus;
		note: string | null;
		occurredAt: Date;
	}[];
}

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
	pending: ["confirmed", "cancelled"],
	confirmed: ["processing", "cancelled"],
	processing: ["shipped"],
	shipped: ["delivered"],
	delivered: [],
	cancelled: [],
};

export interface OrdersFilters {
	search?: string;
	status?: string;
	paymentStatus?: string;
	page?: number;
	pageSize?: number;
}

export async function getOrders(filters: OrdersFilters = {}) {
	const {
		search = "",
		status = "all",
		paymentStatus = "all",
		page = 1,
		pageSize = 10,
	} = filters;

	const conditions = [];

	if (search) {
		conditions.push(ilike(shopOrder.orderNumber, `%${search}%`));
	}
	if (status !== "all") {
		conditions.push(eq(shopOrder.status, status as OrderStatus));
	}
	if (paymentStatus !== "all") {
		conditions.push(
			eq(shopOrder.paymentStatus, paymentStatus as PaymentStatus),
		);
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [{ total }] = await db
		.select({ total: count() })
		.from(shopOrder)
		.where(whereClause);

	const orders = await db
		.select({
			id: shopOrder.id,
			orderNumber: shopOrder.orderNumber,
			customerName: shopOrder.shippingFullName,
			status: shopOrder.status,
			paymentStatus: shopOrder.paymentStatus,
			paymentMethod: shopOrder.paymentMethod,
			total: shopOrder.total,
			createdAt: shopOrder.createdAt,
			userId: shopOrder.userId,
		})
		.from(shopOrder)
		.where(whereClause)
		.orderBy(desc(shopOrder.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const enriched: OrderListItem[] = await Promise.all(
		orders.map(async (o) => {
			const [itemCount, customerResult] = await Promise.all([
				db
					.select({ count: count() })
					.from(orderItem)
					.where(eq(orderItem.orderId, o.id)),
				db
					.select({ email: user.email })
					.from(user)
					.where(eq(user.id, o.userId))
					.limit(1),
			]);
			return {
				id: o.id,
				orderNumber: o.orderNumber,
				customerName: o.customerName,
				customerEmail: customerResult[0]?.email ?? "",
				status: o.status,
				paymentStatus: o.paymentStatus,
				paymentMethod: o.paymentMethod,
				total: Number(o.total),
				itemsCount: itemCount[0]?.count ?? 0,
				createdAt: o.createdAt,
			};
		}),
	);

	return {
		orders: enriched,
		total,
		page,
		pageSize,
		totalPages: Math.ceil(total / pageSize),
	};
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
	const [order] = await db
		.select()
		.from(shopOrder)
		.where(eq(shopOrder.id, id))
		.limit(1);
	if (!order) return null;

	const [items, history, customerResult] = await Promise.all([
		db.select().from(orderItem).where(eq(orderItem.orderId, id)),
		db
			.select()
			.from(orderStatusHistory)
			.where(eq(orderStatusHistory.orderId, id))
			.orderBy(asc(orderStatusHistory.occurredAt)),
		db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				phone: user.phone,
			})
			.from(user)
			.where(eq(user.id, order.userId))
			.limit(1),
	]);

	return {
		id: order.id,
		orderNumber: order.orderNumber,
		status: order.status,
		paymentStatus: order.paymentStatus,
		paymentMethod: order.paymentMethod,
		subtotal: Number(order.subtotal),
		shipping: Number(order.shipping),
		discount: Number(order.discount),
		tax: Number(order.tax),
		total: Number(order.total),
		shippingFullName: order.shippingFullName,
		shippingPhone: order.shippingPhone,
		shippingStreet: order.shippingStreet,
		shippingCity: order.shippingCity,
		shippingState: order.shippingState,
		shippingPostalCode: order.shippingPostalCode,
		shippingCountry: order.shippingCountry,
		shippingMethod: order.shippingMethod,
		customerNote: order.customerNote,
		adminNote: order.adminNote,
		couponCode: order.couponCode,
		createdAt: order.createdAt,
		customer: customerResult[0] ?? null,
		items: items.map((i) => ({
			id: i.id,
			title: i.title,
			sizeLabel: i.sizeLabel,
			imageUrl: i.imageUrl,
			quantity: i.quantity,
			unitPrice: Number(i.unitPrice),
			totalPrice: Number(i.totalPrice),
		})),
		statusHistory: history.map((h) => ({
			id: h.id,
			status: h.status,
			note: h.note,
			occurredAt: h.occurredAt,
		})),
	};
}

export async function getOrderStats() {
	const [stats] = await db
		.select({
			total: count(),
			pending: sql<number>`COUNT(CASE WHEN ${shopOrder.status} = 'pending' THEN 1 END)`,
			processing: sql<number>`COUNT(CASE WHEN ${shopOrder.status} IN ('confirmed', 'processing') THEN 1 END)`,
			shipped: sql<number>`COUNT(CASE WHEN ${shopOrder.status} = 'shipped' THEN 1 END)`,
			delivered: sql<number>`COUNT(CASE WHEN ${shopOrder.status} = 'delivered' THEN 1 END)`,
		})
		.from(shopOrder);

	return {
		total: stats.total,
		pending: Number(stats.pending),
		processing: Number(stats.processing),
		shipped: Number(stats.shipped),
		delivered: Number(stats.delivered),
	};
}
