"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Heart, Package, LayoutDashboard } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

interface UserMenuProps {
	user: {
		name: string;
		email: string;
		role?: string | null;
	};
	isAdmin: boolean;
}

export function UserMenu({ user, isAdmin }: UserMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Account menu">
					<User className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>
					<div className="flex flex-col">
						<span className="truncate">{user.name}</span>
						<span className="text-xs font-normal text-muted-foreground truncate">
							{user.email}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/account" className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						My Account
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/account/orders" className="cursor-pointer">
						<Package className="mr-2 h-4 w-4" />
						My Orders
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/account/wishlist" className="cursor-pointer">
						<Heart className="mr-2 h-4 w-4" />
						Wishlist
					</Link>
				</DropdownMenuItem>
				{isAdmin && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/admin" className="cursor-pointer">
								<LayoutDashboard className="mr-2 h-4 w-4" />
								Admin Dashboard
							</Link>
						</DropdownMenuItem>
					</>
				)}
				<DropdownMenuSeparator />
				<SignOutButton variant="dropdown" />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
