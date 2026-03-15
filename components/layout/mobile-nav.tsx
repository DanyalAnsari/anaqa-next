"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { User } from "@/lib/auth-client";

interface MobileNavProps {
	navigation: { name: string; href: string }[];
	user: User | null | undefined;
	isAdmin: boolean;
}

export function MobileNav({ navigation, user, isAdmin }: MobileNavProps) {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const activeLink = (href: string) =>
		pathname === href || pathname.startsWith(href + "/");

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild className="md:hidden">
				<Button variant="ghost" size="icon" aria-label="Open menu">
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[300px] sm:w-[350px] pl-4">
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
							onClick={() => setOpen(false)}
							className={cn(
								"text-lg font-medium py-2 transition-colors",
								activeLink(item.href) ? "text-foreground" : (
									"text-muted-foreground hover:text-foreground"
								),
							)}
						>
							{item.name}
						</Link>
					))}

					<div className="h-px bg-border my-4" />

					{user ?
						<>
							<Link
								href="/account"
								onClick={() => setOpen(false)}
								className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								My Account
							</Link>
							{isAdmin && (
								<Link
									href="/admin"
									onClick={() => setOpen(false)}
									className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
								>
									Admin Dashboard
								</Link>
							)}
							<SignOutButton
								variant="mobile"
								onSuccess={() => setOpen(false)}
							/>
						</>
					:	<>
							<Link
								href="/auth/sign-in"
								onClick={() => setOpen(false)}
								className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								Sign In
							</Link>
							<Link
								href="/auth/sign-up"
								onClick={() => setOpen(false)}
								className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors"
							>
								Create Account
							</Link>
						</>
					}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
