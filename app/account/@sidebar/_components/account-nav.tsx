// app/account/@sidebar/_components/account-nav.tsx
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	User,
	MapPin,
	ShoppingBag,
	Bell,
	Heart,
	Star,
	LayoutDashboard,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const accountNavigation = [
	{ name: "Overview", href: "/account", icon: LayoutDashboard },
	{ name: "Profile", href: "/account/profile", icon: User },
	{ name: "Addresses", href: "/account/addresses", icon: MapPin },
	{ name: "Orders", href: "/account/orders", icon: ShoppingBag },
	{ name: "Wishlist", href: "/account/wishlist", icon: Heart },
	{ name: "Reviews", href: "/account/reviews", icon: Star },
	{ name: "Waitlist", href: "/account/waitlist", icon: Bell },
];

export function AccountNav() {
	const pathname = usePathname();

	return (
		<nav
			className="flex flex-col space-y-1"
			role="navigation"
			aria-label="Account navigation"
		>
			{accountNavigation.map((item) => {
				const Icon = item.icon;
				const isActive =
					pathname === item.href ||
					(item.href !== "/account" && pathname.startsWith(item.href));
				const isOverview = item.href === "/account" && pathname === "/account";
				const active = isActive || isOverview;

				return (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							buttonVariants({ variant: "ghost", size: "sm" }),
							"justify-start h-10",
							active ?
								"bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary font-medium"
							:	"text-muted-foreground hover:text-foreground hover:bg-secondary/80",
						)}
					>
						<Icon className={cn("h-4 w-4 mr-3", active && "text-primary")} />
						<span>{item.name}</span>
					</Link>
				);
			})}
		</nav>
	);
}
