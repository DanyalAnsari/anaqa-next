import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, MapPin, ShoppingBag, Bell, Heart } from "lucide-react";
import { AccountNav } from "./_components/account-nav";
import { SignOutButton } from "./_components/sign-out-button";

export const accountNavigation = [
	{ name: "Profile", href: "/account/profile", icon: User },
	{ name: "Addresses", href: "/account/addresses", icon: MapPin },
	{ name: "Orders", href: "/account/orders", icon: ShoppingBag },
	{ name: "Wishlist", href: "/account/wishlist", icon: Heart },
	{ name: "Waitlist", href: "/account/waitlist", icon: Bell },
];

export default async function AccountSidebar() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user;

	return (
		<Card className="border-border">
			<CardHeader className="pb-4">
				{/* User info */}
				<div className="flex items-center space-x-3">
					<Avatar className="h-12 w-12">
						<AvatarImage
							src={user?.image ?? undefined}
							alt={user?.name ?? "User"}
						/>
						<AvatarFallback>
							{user?.name ? user.name[0].toUpperCase() : "U"}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="font-medium truncate">{user?.name || "User"}</p>
						<p className="text-sm text-muted-foreground truncate">
							{user?.email}
						</p>
					</div>
				</div>
			</CardHeader>

			<Separator />

			<CardContent className="pt-6 pb-4 space-y-6">
				{/* Navigation */}
				<AccountNav items={accountNavigation} />

				<Separator />

				{/* Sign out */}
				<SignOutButton />
			</CardContent>
		</Card>
	);
}
