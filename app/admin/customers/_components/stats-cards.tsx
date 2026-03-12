import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Ban, ShieldCheck } from "lucide-react";

interface StatsCardsProps {
	stats: {
		total: number;
		active: number;
		banned: number;
		verified: number;
	};
}

export function StatsCards({ stats }: StatsCardsProps) {
	const cards = [
		{
			label: "Total Users",
			value: stats.total,
			icon: Users,
			color: "text-blue-600",
			bg: "bg-blue-100 dark:bg-blue-900/30",
		},
		{
			label: "Active",
			value: stats.active,
			icon: UserCheck,
			color: "text-green-600",
			bg: "bg-green-100 dark:bg-green-900/30",
		},
		{
			label: "Banned",
			value: stats.banned,
			icon: Ban,
			color: "text-red-600",
			bg: "bg-red-100 dark:bg-red-900/30",
		},
		{
			label: "Verified",
			value: stats.verified,
			icon: ShieldCheck,
			color: "text-purple-600",
			bg: "bg-purple-100 dark:bg-purple-900/30",
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card) => (
				<Card key={card.label}>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							<div
								className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}
							>
								<card.icon className={`h-5 w-5 ${card.color}`} />
							</div>
							<div>
								<p className="text-2xl font-semibold">{card.value}</p>
								<p className="text-xs text-muted-foreground">{card.label}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
