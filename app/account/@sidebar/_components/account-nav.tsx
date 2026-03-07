"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, Bell, Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const accountNavigation = [
	{ name: "Profile", href: "/account/profile", icon: User },
	{ name: "Addresses", href: "/account/addresses", icon: MapPin },
	{ name: "Orders", href: "/account/orders", icon: ShoppingBag },
	{ name: "Wishlist", href: "/account/wishlist", icon: Heart },
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
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							buttonVariants({ variant: "ghost" }),
							"justify-start",
							isActive ?
								"bg-secondary text-foreground hover:bg-secondary"
							:	"text-muted-foreground hover:text-foreground hover:bg-secondary/50",
						)}
					>
						<Icon className="h-4 w-4 mr-3" />
						<span>{item.name}</span>
					</Link>
				);
			})}
		</nav>
	);
}
