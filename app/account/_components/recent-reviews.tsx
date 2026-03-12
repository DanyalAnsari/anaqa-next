
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { db } from "@/database";
import { orderItem, shopOrder } from "@/database/schemas";

const statusColors: Record<string, string> = {
	pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
	confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
	processing: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
	shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
	delivered: "bg-green-500/10 text-green-600 border-green-500/20",
	cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export async function RecentOrders({ userId }: { userId: string }) {
	const orders = await db
		.select({
			id: shopOrder.id,
			orderNumber: shopOrder.orderNumber,
			status: shopOrder.status,
			total: shopOrder.total,
			createdAt: shopOrder.createdAt,
		})
		.from(shopOrder)
		.where(eq(shopOrder.userId, userId))
		.orderBy(desc(shopOrder.createdAt))
		.limit(3);

	// Get item counts per order
	const orderIds = orders.map((o) => o.id);
	const allItems =
		orderIds.length > 0 ?
			await db
				.select({
					orderId: orderItem.orderId,
					id: orderItem.id,
				})
				.from(orderItem)
		:	[];

	const itemCountMap = new Map<string, number>();
	for (const item of allItems) {
		itemCountMap.set(item.orderId, (itemCountMap.get(item.orderId) ?? 0) + 1);
	}

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl bg-secondary/20">
				<Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
				<p className="text-sm text-muted-foreground">
					No orders yet. Start shopping to see your orders here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{orders.map((order) => {
				const itemCount = itemCountMap.get(order.id) ?? 0;
				return (
					<Link
						key={order.id}
						href={`/account/orders/${order.id}`}
						className={cn(
							"group flex items-center justify-between p-4",
							"border border-border/50 rounded-xl",
							"hover:border-primary/50 hover:bg-accent/30 transition-all",
						)}
					>
						<div className="space-y-1">
							<p className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-2">
								{order.orderNumber}
								<ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</p>
							<p className="text-xs text-muted-foreground">
								{new Date(order.createdAt).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}{" "}
								· {itemCount} {itemCount === 1 ? "item" : "items"}
							</p>
						</div>
						<div className="text-right space-y-1">
							<p className="font-semibold text-sm">
								{formatPrice(Number(order.total))}
							</p>
							<Badge
								variant="outline"
								className={cn(
									"text-xs capitalize",
									statusColors[order.status] || "",
								)}
							>
								{order.status}
							</Badge>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
