import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { getDashboardStats, getRecentOrders } from "./_lib/data";
import { StatsCards } from "./_components/stats-card";
import { RecentOrdersTable } from "./_components/recent-order-table";
import { QuickActions } from "./_components/quick-actions";

export default async function AdminDashboardPage() {
	const [stats, recentOrders] = await Promise.all([
		getDashboardStats(),
		getRecentOrders(6),
	]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold">Dashboard</h1>
				<p className="text-muted-foreground text-sm">
					Welcome back — here's an overview of your store.
				</p>
			</div>

			{/* Stats Cards */}
			<StatsCards stats={stats} />

			{/* Recent Orders */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-4">
					<CardTitle className="text-base font-medium">Recent Orders</CardTitle>
					<Button asChild variant="ghost" size="sm">
						<Link href="/admin/orders">
							View all
							<ArrowRight className="ml-1 h-4 w-4" />
						</Link>
					</Button>
				</CardHeader>
				<CardContent>
					<RecentOrdersTable orders={recentOrders} />
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div>
				<h2 className="text-base font-medium mb-4">Quick Actions</h2>
				<QuickActions />
			</div>
		</div>
	);
}
