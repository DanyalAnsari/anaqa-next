import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AccountLayout({
	children,
	sidebar,
}: {
	children: ReactNode;
	sidebar: ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<StoreHeader />
			<main className="flex-1 bg-secondary/20">
				<div className="container-wide py-8 md:py-12">
					{/* Breadcrumb */}
					<Breadcrumb className="mb-6">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link
										href="/"
										className="hover:text-foreground transition-colors"
									>
										Home
									</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-foreground">
									Account
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
						{/* Parallel Sidebar Slot */}
						<aside className="md:col-span-1">{sidebar}</aside>

						{/* Content */}
						<div className="md:col-span-3">
							{children}
						</div>
					</div>
				</div>
			</main>
			<StoreFooter />
		</div>
	);
}
