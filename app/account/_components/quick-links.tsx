"use client";

import Link from "next/link";
import {
	ArrowRight,
	Heart,
	MapPin,
	ShoppingBag,
	Star,
	User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const quickLinks = [
	{
		name: "Profile Settings",
		description: "Update your personal information",
		href: "/account/profile",
		icon: User,
	},
	{
		name: "My Addresses",
		description: "Manage shipping addresses",
		href: "/account/addresses",
		icon: MapPin,
	},
	{
		name: "Order History",
		description: "View past orders and track current ones",
		href: "/account/orders",
		icon: ShoppingBag,
	},
	{
		name: "Wishlist",
		description: "Products you've saved for later",
		href: "/account/wishlist",
		icon: Heart,
	},
	{
		name: "My Reviews",
		description: "View and manage your product reviews",
		href: "/account/reviews",
		icon: Star,
	},
];

export function QuickLinks() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{quickLinks.map((link) => {
				const Icon = link.icon;
				return (
					<Link
						key={link.name}
						href={link.href}
						className={cn(
							"group relative flex items-start gap-4 p-4",
							"rounded-xl border border-border/50",
							"bg-background/50 backdrop-blur-sm",
							"hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm",
							"transition-all duration-200",
						)}
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
							<Icon className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-sm flex items-center gap-2 group-hover:text-primary transition-colors">
								{link.name}
								<ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
							</h3>
							<p className="text-sm text-muted-foreground mt-1 line-clamp-1">
								{link.description}
							</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
