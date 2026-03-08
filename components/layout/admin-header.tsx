"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface User {
	name: string;
	email: string;
	image?: string | null;
}

function getInitials(name: string) {
	const parts = name.split(" ");
	return parts.length > 1 ?
			`${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
		:	parts[0][0].toUpperCase();
}

export function AdminHeader({ user }: { user: User }) {
	const pathname = usePathname();

	const pageTitle = (() => {
		if (pathname === "/admin") return "Dashboard";
		const segment = pathname.split("/")[2];
		if (!segment) return "Dashboard";
		return segment.charAt(0).toUpperCase() + segment.slice(1);
	})();

	return (
		<header className="flex h-16 shrink-0 items-center justify-between border-b px-4 gap-4">
			<div className="flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="h-6" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>{pageTitle}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />
				<Avatar className="h-8 w-8">
					<AvatarImage src={user.image ?? undefined} alt={user.name} />
					<AvatarFallback className="text-xs">
						{getInitials(user.name)}
					</AvatarFallback>
				</Avatar>
			</div>
		</header>
	);
}
