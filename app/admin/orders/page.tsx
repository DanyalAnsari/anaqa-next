import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Clock, Truck, CheckCircle2 } from "lucide-react";
import { getOrders, getOrderStats } from "./_lib/data";
import { OrdersTable } from "./_components/orders-table";

interface PageProps {
	searchParams: Promise<{
		search?: string;
		status?: string;
		payment?: string;
		page?: string;
	}>;
}

function StatsCards({
	stats,
}: {
	stats: Awaited<ReturnType<typeof getOrderStats>>;
}) {
	const cards = [
		{
			label: "Total Orders",
			value: stats.total,
			icon: ShoppingBag,
			color: "text-blue-600",
			bg: "bg-blue-100 dark:bg-blue-900/30",
		},
		{
			label: "Pending",
			value: stats.pending,
			icon: Clock,
			color: "text-yellow-600",
			bg: "bg-yellow-100 dark:bg-yellow-900/30",
		},
		{
			label: "Shipped",
			value: stats.shipped,
			icon: Truck,
			color: "text-indigo-600",
			bg: "bg-indigo-100 dark:bg-indigo-900/30",
		},
		{
			label: "Delivered",
			value: stats.delivered,
			icon: CheckCircle2,
			color: "text-green-600",
			bg: "bg-green-100 dark:bg-green-900/30",
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((c) => (
				<Card key={c.label}>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center`}
							>
								<c.icon className={`h-5 w-5 ${c.color}`} />
							</div>
							<div>
								<p className="text-2xl font-semibold">{c.value}</p>
								<p className="text-xs text-muted-foreground">{c.label}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export default async function OrdersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;

	const [ordersData, stats] = await Promise.all([
		getOrders({
			search: params.search,
			status: params.status,
			paymentStatus: params.payment,
			page,
		}),
		getOrderStats(),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Orders</h1>
				<p className="text-muted-foreground text-sm">
					Manage and track customer orders.
				</p>
			</div>
			<StatsCards stats={stats} />
			<Card>
				<CardContent className="pt-6">
					<OrdersTable {...ordersData} />
				</CardContent>
			</Card>
		</div>
	);
}
