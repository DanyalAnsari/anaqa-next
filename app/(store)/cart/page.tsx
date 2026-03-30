import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CartClient } from "./_components/cart-client";
import { ProductCard } from "@/components/shared/product-card";
import { getCartData, getRecommendedProducts } from "./lib/data/cart";

export default async function CartPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const user = session?.user;
	const { items, subtotal, itemCount, couponCode } = await getCartData(
		user?.id,
	);
	const recommended = await getRecommendedProducts();

	return (
		<div className="animate-in fade-in duration-500">
			{/* Header */}
			<div className="bg-secondary/30 py-6">
				<div className="container-wide">
					<nav className="mb-4 flex items-center space-x-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="text-foreground">Shopping Cart</span>
					</nav>
					<h1 className="text-2xl md:text-3xl font-medium">
						Shopping Cart
						{itemCount > 0 && (
							<span className="text-lg font-normal text-muted-foreground ml-2">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</h1>
				</div>
			</div>

			{/* Cart Content */}
			<section className="py-8 md:py-12">
				<div className="container-wide">
					<CartClient
						items={items}
						subtotal={subtotal}
						isAuthenticated={!!user}
						couponCode={couponCode}
					/>
				</div>
			</section>

			{/* Recommended */}
			{items.length > 0 && recommended.length > 0 && (
				<section className="py-12 bg-secondary/30">
					<div className="container-wide">
						<h2 className="text-2xl font-medium mb-8">You Might Also Like</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{recommended.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
