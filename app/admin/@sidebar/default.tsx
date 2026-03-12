"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	Settings,
	Store,
	LogOut,
	FolderTree,
	Layers,
	MessageSquare,
	Ticket,
	Clock,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navigation = [
	{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ name: "Products", href: "/admin/products", icon: Package },
	{ name: "Categories", href: "/admin/categories", icon: FolderTree },
	{ name: "Collections", href: "/admin/collections", icon: Layers },
	{ name: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: "3" },
	{ name: "Customers", href: "/admin/customers", icon: Users },
	{ name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
	{ name: "Coupons", href: "/admin/coupons", icon: Ticket },
	{ name: "Waitlist", href: "/admin/waitlist", icon: Clock },
	{ name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	const isActive = (href: string) =>
		href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	};

	return (
		<Sidebar>
			<SidebarHeader className="p-4">
				<Link href="/admin" className="flex items-center gap-2">
					<span className="text-xl font-medium tracking-tight">Anāqa</span>
					<Badge variant="secondary" className="text-xs">
						Admin
					</Badge>
				</Link>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigation.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild isActive={isActive(item.href)}>
										<Link href={item.href}>
											<item.icon className="h-4 w-4" />
											<span>{item.name}</span>
										</Link>
									</SidebarMenuButton>
									{item.badge && (
										<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator />

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/">
								<Store className="h-4 w-4" />
								<span>View Store</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton onClick={handleSignOut}>
							<LogOut className="h-4 w-4" />
							<span>Sign Out</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
