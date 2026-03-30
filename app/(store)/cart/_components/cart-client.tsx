"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, Loader2, ChevronRight, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { clearCart } from "../actions";
import { CartItemRow } from "./cart-item-row";
import type { CartItemData } from "../lib/data/cart";

interface CartClientProps {
	items: CartItemData[];
	subtotal: number;
	isAuthenticated: boolean;
	couponCode: string | null;
}

const SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 25;
const VAT_RATE = 0.15;

export function CartClient({
	items,
	subtotal,
	isAuthenticated,
	couponCode,
}: CartClientProps) {
	const [isClearing, startClearTransition] = useTransition();

	// Empty / unauthenticated state
	if (!isAuthenticated || items.length === 0) {
		return (
			<div className="text-center py-16">
				<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
					<ShoppingBag className="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
				<p className="text-muted-foreground mb-6 max-w-sm mx-auto">
					{isAuthenticated ?
						"Add some items to your cart to get started."
					:	"Sign in to view your cart."}
				</p>
				<Button asChild>
					<Link href={isAuthenticated ? "/shop" : "/auth/sign-in"}>
						{isAuthenticated ? "Start Shopping" : "Sign In"}
						<ArrowRight className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	}

	const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
	const tax = (subtotal + shipping) * VAT_RATE;
	const total = subtotal + shipping + tax;

	const handleClearCart = () => {
		startClearTransition(async () => {
			const result = await clearCart();
			if (result.success) {
				toast.success("Cart cleared");
			} else {
				toast.error(result.error);
			}
		});
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Cart Items */}
			<div className="lg:col-span-2">
				<div className="bg-card border rounded-lg p-4 md:p-6">
					{/* Clear cart button */}
					<div className="flex justify-end mb-4">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="text-muted-foreground"
									disabled={isClearing}
								>
									{isClearing && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Clear Cart
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Clear Cart?</AlertDialogTitle>
									<AlertDialogDescription>
										This will remove all items from your cart. This action
										cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleClearCart}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										Clear Cart
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>

					<div className="divide-y">
						{items.map((item) => (
							<CartItemRow key={item.id} item={item} />
						))}
					</div>
				</div>

				<div className="mt-6">
					<Link
						href="/shop"
						className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
					>
						<ChevronRight className="h-4 w-4 mr-1 rotate-180" />
						Continue Shopping
					</Link>
				</div>
			</div>

			{/* Order Summary */}
			<div className="lg:col-span-1">
				<div className="bg-card border rounded-lg p-6 lg:sticky lg:top-24 space-y-4">
					<h2 className="text-lg font-medium">Order Summary</h2>

					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span>{formatPrice(subtotal)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Shipping</span>
							<span>
								{shipping === 0 ?
									<span className="text-green-600">Free</span>
								:	formatPrice(shipping)}
							</span>
						</div>
						{shipping > 0 && (
							<p className="text-xs text-muted-foreground">
								Free shipping on orders over {formatPrice(SHIPPING_THRESHOLD)}
							</p>
						)}
						<div className="flex justify-between">
							<span className="text-muted-foreground">VAT (15%)</span>
							<span>{formatPrice(tax)}</span>
						</div>
						{couponCode && (
							<div className="flex justify-between text-green-600">
								<span>Coupon: {couponCode}</span>
								<span>Applied</span>
							</div>
						)}
						<Separator />
						<div className="flex justify-between font-semibold text-base pt-1">
							<span>Total</span>
							<span>{formatPrice(total)}</span>
						</div>
					</div>

					<Button asChild className="w-full h-12" size="lg">
						<Link href="/checkout">
							Proceed to Checkout
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>

					<p className="text-xs text-center text-muted-foreground">
						Taxes and shipping calculated at checkout
					</p>
				</div>
			</div>
		</div>
	);
}
