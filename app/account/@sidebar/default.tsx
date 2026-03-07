import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AccountNav } from "./_components/account-nav";
import { SignOutButton } from "./_components/sign-out-button";

export default async function AccountSidebar() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user;

	return (
		<nav className="flex flex-col gap-6 sticky top-24 pt-2">
			{/* User info */}
			<div className="flex items-center space-x-3 px-2">
				<Avatar className="h-10 w-10">
					<AvatarImage
						src={user?.image ?? undefined}
						alt={user?.name ?? "User"}
					/>
					<AvatarFallback>
						{user?.name ? user.name[0].toUpperCase() : "U"}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-sm truncate leading-none">{user?.name || "User"}</p>
					<p className="text-xs mt-1.5 text-muted-foreground truncate">
						{user?.email}
					</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* Navigation */}
				<AccountNav />

				<Separator />

				{/* Sign out */}
				<div className="px-2">
					<SignOutButton />
				</div>
			</div>
		</nav>
	);
}
