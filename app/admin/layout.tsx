import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default async function AdminLayout({
	children,
	sidebar,
}: {
	children: React.ReactNode;
	sidebar: React.ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) redirect("/login");
	// if (session.user.role !== "admin") redirect("/");

	return (
		<SidebarProvider>
			{sidebar}
			<SidebarInset>
				<AdminHeader user={session.user} />
				<main className="flex-1 overflow-auto bg-secondary/20 p-4 lg:p-6">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
