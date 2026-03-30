"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CartItemRow } from "@/app/(store)/cart/_components/cart-item-row";
import { getCartDataAction } from "./cart-drawer-actions";
import type { CartItemData } from "../lib/data/cart";

const SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 25;
const VAT_RATE = 0.15;

interface CartDrawerProps {
	isAuthenticated: boolean;
}

export function CartDrawer({ isAuthenticated }: CartDrawerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [items, setItems] = useState<CartItemData[]>([]);
	const [isLoading, startTransition] = useTransition();

	// Listen for custom event to open drawer
	useEffect(() => {
		const handleOpen = () => {
			setIsOpen(true);
			if (isAuthenticated) {
				startTransition(async () => {
					const data = await getCartDataAction();
					setItems(data.items);
				});
			}
		};

		window.addEventListener("open-cart-drawer", handleOpen);
		return () => window.removeEventListener("open-cart-drawer", handleOpen);
	}, [isAuthenticated]);

	// Refetch when drawer opens
	useEffect(() => {
		if (isOpen && isAuthenticated) {
			startTransition(async () => {
				const data = await getCartDataAction();
				setItems(data.items);
			});
		}
	}, [isOpen, isAuthenticated]);

	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
	const tax = (subtotal + shipping) * VAT_RATE;
	const total = subtotal + shipping + tax;

	const handleClose = () => setIsOpen(false);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
				<SheetHeader className="px-6 py-4 border-b">
					<SheetTitle className="flex items-center gap-2">
						<ShoppingBag className="h-5 w-5" />
						Shopping Bag
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">
								({itemCount} {itemCount === 1 ? "item" : "items"})
							</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{!isAuthenticated ?
					<div className="flex-1 flex flex-col items-center justify-center p-6">
						<div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-medium mb-2">Sign in to view cart</h3>
						<p className="text-muted-foreground text-center mb-6">
							Sign in to add items and manage your shopping bag.
						</p>
						<Button onClick={handleClose} asChild>
							<Link href="/auth/sign-in">
								Sign In
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				: isLoading ?
					<div className="flex-1 flex items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
				: items.length === 0 ?
					<div className="flex-1 flex flex-col items-center justify-center p-6">
						<div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-medium mb-2">Your bag is empty</h3>
						<p className="text-muted-foreground text-center mb-6">
							Looks like you haven&apos;t added any items yet.
						</p>
						<Button onClick={handleClose} asChild>
							<Link href="/shop">
								Start Shopping
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				:	<>
						{/* Cart Items */}
						<ScrollArea className="flex-1 px-6">
							<div className="divide-y">
								{items.map((item) => (
									<CartItemRow key={item.id} item={item} variant="drawer" />
								))}
							</div>
						</ScrollArea>

						{/* Footer */}
						<div className="border-t p-6 space-y-4 bg-background">
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
								<Separator />
								<div className="flex justify-between font-semibold">
									<span>Estimated Total</span>
									<span>{formatPrice(total)}</span>
								</div>
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									className="flex-1"
									onClick={handleClose}
									asChild
								>
									<Link href="/cart">View Cart</Link>
								</Button>
								<Button className="flex-1" onClick={handleClose} asChild>
									<Link href="/checkout">
										Checkout
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>
					</>
				}
			</SheetContent>
		</Sheet>
	);
}

// Helper to open the drawer from anywhere
export function openCartDrawer() {
	window.dispatchEvent(new Event("open-cart-drawer"));
}
