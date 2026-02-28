"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ShoppingBag,
	User,
	Menu,
	Search,
	Heart,
	LogOut,
	Settings,
	Package,
	LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navigation = [
	{ name: "Shop", href: "/shop" },
	{ name: "Collections", href: "/collections" },
	{ name: "About", href: "/about" },
	{ name: "Contact", href: "/contact" },
];

export function StoreHeader() {
	const location = usePathname();
	const navigate = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const cartItemCount = 0;

	const handleSignOut = async () => {
		toast.success("Signed out successfully");
		navigate.push("/");
	};

	const handleCartClick = () => {
		toast.info("Cart is empty");
		navigate.push("/cart");
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container-wide">
				{/* Top bar */}
				<div className="hidden md:flex items-center justify-center py-2 text-xs text-muted-foreground border-b border-border/40">
					Free shipping on orders over 200 SAR • Easy 30-day returns
				</div>

				{/* Main header */}
				<div className="flex h-16 items-center justify-between">
					{/* Mobile menu trigger */}
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="ghost" size="icon" aria-label="Open menu">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-75 sm:w-87.5">
							<SheetHeader>
								<SheetTitle className="text-left text-2xl font-medium tracking-tight">
									Anāqa
								</SheetTitle>
							</SheetHeader>
							<nav className="mt-8 flex flex-col space-y-4">
								{navigation.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											"text-lg font-medium py-2 transition-colors",
											(
												location === item.href ||
													location.startsWith(item.href + "/")
											) ?
												"text-foreground"
											:	"text-muted-foreground hover:text-foreground",
										)}
									>
										{item.name}
									</Link>
								))}
								<div className="h-px bg-border my-4" />
								{
									<>
										<Link
											href="/auth/sign-in"
											onClick={() => setMobileMenuOpen(false)}
											className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
										>
											Sign In
										</Link>
										<Link
											href="/auth/sign-up"
											onClick={() => setMobileMenuOpen(false)}
											className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
										>
											Create Account
										</Link>
									</>
								}
							</nav>
						</SheetContent>
					</Sheet>

					{/* Logo */}
					<Link href="/" className="flex items-center">
						<span className="text-2xl font-medium tracking-tight">Anāqa</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"text-sm font-medium transition-colors relative py-2",
									(
										location === item.href ||
											location.startsWith(item.href + "/")
									) ?
										"text-foreground"
									:	"text-muted-foreground hover:text-foreground",
								)}
							>
								{item.name}
								{(location === item.href ||
									location.startsWith(item.href + "/")) && (
									<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
								)}
							</Link>
						))}
					</nav>

					{/* Actions */}
					<div className="flex items-center space-x-1">
						<Link href="/search">
							<Button variant="ghost" size="icon" aria-label="Search">
								<Search className="h-5 w-5" />
							</Button>
						</Link>

						<ThemeToggle />

						{/* User Menu */}

						<Link href="/auth/sign-in" className="hidden sm:block">
							<Button variant="ghost" size="icon" aria-label="Sign in">
								<User className="h-5 w-5" />
							</Button>
						</Link>

						{/* Cart */}
						<Button
							variant="ghost"
							size="icon"
							aria-label="Shopping bag"
							onClick={handleCartClick}
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
					</div>
				</div>
			</div>
		</header>
	);
}
