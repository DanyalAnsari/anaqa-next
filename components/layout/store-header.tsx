import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, User, Search } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";
import { getCartItemsCount } from "@/database/data/cart";
import { BRAND } from "@/constants";
import { getServerSession } from "@/lib/actions";

const navigation = [
	{ name: "Shop", href: "/shop" },
	{ name: "Collections", href: "/collections" },
	{ name: "About", href: "/about" },
	{ name: "Contact", href: "/contact" },
];

export async function StoreHeader() {
	const session = await getServerSession();
	const user = session?.user;
	const isAdmin = user?.role === "admin";

	let cartItemCount = 0;
	if (user) {
		const itemCount = await getCartItemsCount(user.id);
		cartItemCount = itemCount;
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container-wide">
				{/* Announcement Bar */}
				<div className="hidden md:flex items-center justify-center py-2 text-xs text-muted-foreground border-b border-border/40">
					Free shipping on orders over 200 SAR • Easy 30-day returns
				</div>

				{/* Main Header */}
				<div className="flex h-16 items-center justify-between">
					{/* Mobile Menu */}
					<MobileNav navigation={navigation} user={user} isAdmin={isAdmin} />

					{/* Logo */}
					<Link href="/" className="flex items-center">
						<span className="text-2xl font-medium tracking-tight">{BRAND}</span>
					</Link>

					{/* Desktop Navigation */}
					<DesktopNav navigation={navigation} />

					{/* Actions */}
					<div className="flex items-center space-x-1">
						<Link href="/search">
							<Button variant="ghost" size="icon" aria-label="Search">
								<Search className="h-5 w-5" />
							</Button>
						</Link>

						<ThemeToggle />

						{/* User Menu */}
						{user ?
							<UserMenu user={user} isAdmin={isAdmin} />
						:	<Link href="/auth/sign-in" className="hidden sm:block">
								<Button variant="ghost" size="icon" aria-label="Sign in">
									<User className="h-5 w-5" />
								</Button>
							</Link>
						}

						{/* Cart */}
						<Link href="/cart">
							<Button
								variant="ghost"
								size="icon"
								aria-label="Shopping bag"
								className="relative"
							>
								<ShoppingBag className="h-5 w-5" />
								{cartItemCount > 0 && (
									<Badge
										variant="default"
										className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
									>
										{cartItemCount > 99 ? "99+" : cartItemCount}
									</Badge>
								)}
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}

function DesktopNav({
	navigation,
}: {
	navigation: { name: string; href: string }[];
}) {
	return (
		<nav className="hidden md:flex items-center space-x-8">
			{navigation.map((item) => (
				<Link
					key={item.name}
					href={item.href}
					className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-2"
				>
					{item.name}
				</Link>
			))}
		</nav>
	);
}
