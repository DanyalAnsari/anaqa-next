import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface Order {
	_id: string;
	orderNumber: string;
	createdAt: string | Date;
	status: string;
	items: any[];
	pricing: {
		total: number;
	};
}

async function getRecentOrders(userId: string, limit = 3): Promise<Order[]> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/orders?userId=${userId}&limit=${limit}`,
		{ cache: "no-store" },
	);
	if (!response.ok) return [];
	const data = await response.json();
	return data.orders || [];
}

export async function RecentOrders({ userId }: { userId: string }) {
	const orders = await getRecentOrders(userId);

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
				<Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
				<p className="text-sm text-muted-foreground">
					No orders yet. Start shopping to see your orders here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{orders.map((order) => (
				<Link
					key={order._id}
					href={`/account/orders/${order._id}`}
					className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all"
				>
					<div className="space-y-1">
						<p className="font-semibold text-sm">{order.orderNumber}</p>
						<p className="text-xs text-muted-foreground">
							{new Date(order.createdAt).toLocaleDateString()} ·{" "}
							{order.items.length} {order.items.length === 1 ? "item" : "items"}
						</p>
					</div>
					<div className="text-right space-y-1">
						<p className="font-semibold text-sm">
							{formatPrice(order.pricing.total)}
						</p>
						<Badge variant="secondary" className="text-xs capitalize">
							{order.status}
						</Badge>
					</div>
				</Link>
			))}
		</div>
	);
}
