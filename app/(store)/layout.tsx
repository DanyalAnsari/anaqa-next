import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { CartDrawer } from "./cart/_components/cart-drawer";
import { getServerSession } from "@/lib/actions";

export default async function StoreLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	return (
		<>
			<div className="flex flex-col min-h-screen">
				<StoreHeader />
				<main className="flex-1">{children}</main>
				<StoreFooter />
			</div>
			<CartDrawer isAuthenticated={!!session?.user} />
		</>
	);
}
