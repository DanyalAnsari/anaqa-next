// app/account/orders/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { OrdersClient } from "./_components/orders-client";
import { db } from "@/database";
import { orderItem, shopOrder } from "@/database/schemas";

export default async function OrdersPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) return null;

	const orders = await db
		.select({
			id: shopOrder.id,
			orderNumber: shopOrder.orderNumber,
			status: shopOrder.status,
			paymentStatus: shopOrder.paymentStatus,
			paymentMethod: shopOrder.paymentMethod,
			subtotal: shopOrder.subtotal,
			shipping: shopOrder.shipping,
			discount: shopOrder.discount,
			tax: shopOrder.tax,
			total: shopOrder.total,
			createdAt: shopOrder.createdAt,
		})
		.from(shopOrder)
		.where(eq(shopOrder.userId, session.user.id))
		.orderBy(desc(shopOrder.createdAt));

	// Fetch items for all orders
	const orderIds = orders.map((o) => o.id);
	const allItems =
		orderIds.length > 0 ?
			await db
				.select({
					orderId: orderItem.orderId,
					title: orderItem.title,
					sizeLabel: orderItem.sizeLabel,
					imageUrl: orderItem.imageUrl,
					quantity: orderItem.quantity,
					unitPrice: orderItem.unitPrice,
					totalPrice: orderItem.totalPrice,
				})
				.from(orderItem)
		:	[];

	// Group items by order
	const itemsByOrder = new Map<string, typeof allItems>();
	for (const item of allItems) {
		const existing = itemsByOrder.get(item.orderId) ?? [];
		existing.push(item);
		itemsByOrder.set(item.orderId, existing);
	}

	const serializedOrders = orders.map((order) => {
		const items = itemsByOrder.get(order.id) ?? [];
		return {
			...order,
			subtotal: Number(order.subtotal),
			shipping: Number(order.shipping),
			discount: Number(order.discount),
			tax: Number(order.tax),
			total: Number(order.total),
			items: items.map((item) => ({
				...item,
				unitPrice: Number(item.unitPrice),
				totalPrice: Number(item.totalPrice),
			})),
		};
	});

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Order History</h1>
				<p className="text-muted-foreground mt-1">
					View and track all your orders.
				</p>
			</div>

			<OrdersClient orders={serializedOrders} />
		</div>
	);
}
