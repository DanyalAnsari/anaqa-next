import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Package,
	ShoppingBag,
	Users,
	Plus,
	ArrowRight,
	AlertTriangle,
} from "lucide-react";

interface QuickActionsProps {
	lowStockCount?: number;
}

export function QuickActions({ lowStockCount = 0 }: QuickActionsProps) {
	const actions = [
		{
			label: "Add Product",
			description: "Create a new product listing",
			href: "/admin/products/new",
			icon: Plus,
		},
		{
			label: "View Orders",
			description: "Manage customer orders",
			href: "/admin/orders",
			icon: ShoppingBag,
		},
		{
			label: "Manage Products",
			description: "Edit your product catalog",
			href: "/admin/products",
			icon: Package,
			badge: lowStockCount > 0 ? `${lowStockCount} low stock` : undefined,
			badgeVariant: "destructive" as const,
		},
		{
			label: "View Customers",
			description: "See customer details",
			href: "/admin/customers",
			icon: Users,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{actions.map((action) => {
				const Icon = action.icon;
				return (
					<Link key={action.href} href={action.href}>
						<Card className="hover:bg-secondary/50 transition-colors cursor-pointer h-full">
							<CardContent className="p-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
											<Icon className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<div className="flex items-center gap-2">
												<p className="font-medium text-sm">{action.label}</p>
												{action.badge && (
													<Badge
														variant={action.badgeVariant}
														className="text-xs"
													>
														{action.badge}
													</Badge>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												{action.description}
											</p>
										</div>
									</div>
									<ArrowRight className="h-4 w-4 text-muted-foreground" />
								</div>
							</CardContent>
						</Card>
					</Link>
				);
			})}
		</div>
	);
}
