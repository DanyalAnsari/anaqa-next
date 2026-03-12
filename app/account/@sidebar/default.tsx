import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AccountNav } from "./_components/account-nav";
import { SignOutButton } from "./_components/sign-out-button";
import {
	FloatingSidebar,
	FloatingSidebarHeader,
	FloatingSidebarContent,
	FloatingSidebarFooter,
} from "@/components/ui/floating-sidebar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default async function AccountSidebar() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const user = session?.user;

	return (
		<FloatingSidebar>
			<FloatingSidebarHeader>
				{/* User info */}
				<div className="flex items-center space-x-3">
					<Avatar className="h-12 w-12 border-2 border-primary/10">
						<AvatarImage
							src={user?.image ?? undefined}
							alt={user?.name ?? "User"}
						/>
						<AvatarFallback className="bg-primary/10 text-primary font-semibold">
							{user?.name ? user.name[0].toUpperCase() : "U"}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0 flex-1">
						<p className="font-semibold text-sm truncate leading-none">
							{user?.name || "User"}
						</p>
						<p className="text-xs mt-1.5 text-muted-foreground truncate">
							{user?.email}
						</p>
						{user?.emailVerified && (
							<Badge variant="secondary" className="mt-2 text-xs gap-1">
								<CheckCircle className="h-3 w-3" />
								Verified
							</Badge>
						)}
					</div>
				</div>
			</FloatingSidebarHeader>

			<Separator className="my-2" />

			<FloatingSidebarContent>
				<AccountNav />
			</FloatingSidebarContent>

			<Separator className="my-2" />

			<FloatingSidebarFooter>
				<SignOutButton />
			</FloatingSidebarFooter>
		</FloatingSidebar>
	);
}
