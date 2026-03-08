import { Card, CardContent } from "@/components/ui/card";
import {
	DollarSign,
	ShoppingBag,
	Users,
	Package,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import type { DashboardStats } from "../_lib/data";

interface StatsCardsProps {
	stats: DashboardStats;
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

const kpiConfig = [
	{
		key: "totalRevenue" as const,
		changeKey: "revenueChange" as const,
		label: "Total Revenue",
		icon: DollarSign,
		color: "text-green-600",
		bg: "bg-green-100 dark:bg-green-900/30",
		format: formatCurrency,
	},
	{
		key: "totalOrders" as const,
		changeKey: "ordersChange" as const,
		label: "Total Orders",
		icon: ShoppingBag,
		color: "text-blue-600",
		bg: "bg-blue-100 dark:bg-blue-900/30",
		format: (v: number) => v.toString(),
	},
	{
		key: "totalCustomers" as const,
		changeKey: "customersChange" as const,
		label: "Customers",
		icon: Users,
		color: "text-purple-600",
		bg: "bg-purple-100 dark:bg-purple-900/30",
		format: (v: number) => v.toString(),
	},
	{
		key: "totalProducts" as const,
		changeKey: "productsChange" as const,
		label: "Active Products",
		icon: Package,
		color: "text-orange-600",
		bg: "bg-orange-100 dark:bg-orange-900/30",
		format: (v: number) => v.toString(),
	},
];

export function StatsCards({ stats }: StatsCardsProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{kpiConfig.map((kpi) => {
				const Icon = kpi.icon;
				const value = stats[kpi.key];
				const change = stats[kpi.changeKey];
				const isPositive = change >= 0;

				return (
					<Card key={kpi.key}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div
									className={`w-10 h-10 rounded-full ${kpi.bg} flex items-center justify-center`}
								>
									<Icon className={`h-5 w-5 ${kpi.color}`} />
								</div>
								<div
									className={`flex items-center gap-1 text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}
								>
									{isPositive ?
										<TrendingUp className="h-3 w-3" />
									:	<TrendingDown className="h-3 w-3" />}
									<span>{Math.abs(change)}%</span>
								</div>
							</div>
							<p className="text-2xl font-semibold">{kpi.format(value)}</p>
							<p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
