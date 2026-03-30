"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Heart,
	ShoppingBag,
	Loader2,
	Check,
	Minus,
	Plus,
	Bell,
	Ruler,
	CheckCircle,
	Share2,
	Link as LinkIcon,
	Copy,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
	addToCart,
	addToWishlist,
	joinWaitlist,
} from "./product-action-server";
import { openCartDrawer } from "@/app/(store)/cart/_components/cart-drawer";

interface Variant {
	id: string;
	size: string;
	stock: number;
	sku: string;
}

interface ProductActionsProps {
	product: {
		id: string;
		name: string;
		variants: Variant[];
	};
}

export function ProductActions({ product }: ProductActionsProps) {
	const router = useRouter();
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [justAdded, setJustAdded] = useState(false);
	const [waitlistSubscribed, setWaitlistSubscribed] = useState(false);
	const [showSizeGuide, setShowSizeGuide] = useState(false);
	const [isAddingToCart, startCartTransition] = useTransition();
	const [isAddingToWishlist, startWishlistTransition] = useTransition();
	const [isJoiningWaitlist, startWaitlistTransition] = useTransition();

	const selectedVariant = useMemo(() => {
		if (!selectedSize) return null;
		return product.variants.find((v) => v.size === selectedSize) ?? null;
	}, [product.variants, selectedSize]);

	// Auto-select if only one variant
	useEffect(() => {
		if (product.variants.length === 1 && !selectedSize) {
			setSelectedSize(product.variants[0].size);
		}
	}, [product.variants, selectedSize]);

	// Reset quantity on size change
	useEffect(() => {
		setQuantity(1);
	}, [selectedSize]);

	const maxQuantity = selectedVariant?.stock ?? 10;
	const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;

	const handleAddToCart = () => {
		if (!selectedSize) {
			toast.error("Please select a size");
			return;
		}

		startCartTransition(async () => {
			const result = await addToCart(product.id, selectedSize!, quantity);
			if (result.success) {
				setJustAdded(true);
				toast.success("Added to cart!", {
					description: `${product.name} has been added to your cart.`,
					action: {
						label: "View Cart",
						onClick: () => openCartDrawer(),
					},
				});
				setTimeout(() => setJustAdded(false), 2000);
				router.refresh();
			} else {
				toast.error(result.error);
			}
		});
	};

	const handleAddToWishlist = () => {
		startWishlistTransition(async () => {
			const result = await addToWishlist(product.id);
			if (result.success) {
				toast.success("Added to wishlist!");
			} else {
				toast.error(result.error);
			}
		});
	};

	const handleJoinWaitlist = () => {
		if (!selectedSize) return;

		startWaitlistTransition(async () => {
			const result = await joinWaitlist(product.id, selectedSize!);
			if (result.success) {
				setWaitlistSubscribed(true);
				toast.success("You're on the list!", {
					description: `We'll notify you when ${product.name} (${selectedSize}) is back in stock.`,
				});
			} else {
				if (result.error?.includes("already")) {
					setWaitlistSubscribed(true);
					toast.info("Already on waitlist");
				} else {
					toast.error(result.error);
				}
			}
		});
	};

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast.success("Link copied!");
		} catch {
			toast.error("Failed to copy link");
		}
	};

	return (
		<div className="space-y-6">
			{/* Size Selector */}
			{product.variants.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Size</span>
						<button
							onClick={() => setShowSizeGuide(true)}
							className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
						>
							<Ruler className="h-4 w-4" />
							Size Guide
						</button>
					</div>

					<div className="flex flex-wrap gap-2">
						{product.variants.map((variant) => {
							const isSelected = selectedSize === variant.size;
							const isAvailable = variant.stock > 0;
							const isLowStock = isAvailable && variant.stock <= 3;

							return (
								<button
									key={variant.sku}
									onClick={() => isAvailable && setSelectedSize(variant.size)}
									disabled={!isAvailable}
									className={cn(
										"relative min-w-12 px-4 py-2 text-sm border rounded-md transition-all",
										isSelected ?
											"border-foreground bg-foreground text-background"
										: isAvailable ? "border-border hover:border-foreground"
										: "border-border opacity-40 cursor-not-allowed line-through",
									)}
									aria-label={`Size ${variant.size}${!isAvailable ? " - Out of stock" : ""}`}
									aria-pressed={isSelected}
								>
									{variant.size}
									{isLowStock && !isSelected && (
										<span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
									)}
								</button>
							);
						})}
					</div>

					{/* Stock info */}
					{selectedVariant && (
						<div>
							{selectedVariant.stock === 0 ?
								<span className="text-sm text-destructive font-medium">
									Out of Stock
								</span>
							: selectedVariant.stock <= 5 ?
								<span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
									Only {selectedVariant.stock} left in stock
								</span>
							:	<span className="text-sm text-green-600 dark:text-green-400 font-medium">
									In Stock
								</span>
							}
						</div>
					)}
				</div>
			)}

			{/* Quantity */}
			{selectedVariant && selectedVariant.stock > 0 && (
				<div className="flex items-center">
					<span className="text-sm font-medium mr-4">Quantity</span>
					<div className="flex items-center border rounded-md">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setQuantity((q) => Math.max(1, q - 1))}
							disabled={quantity <= 1}
							className="h-10 w-10 rounded-none rounded-l-md"
						>
							<Minus className="h-4 w-4" />
						</Button>
						<div className="w-12 h-10 flex items-center justify-center border-x text-sm font-medium">
							{quantity}
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
							disabled={quantity >= maxQuantity}
							className="h-10 w-10 rounded-none rounded-r-md"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					{maxQuantity < 10 && (
						<span className="ml-3 text-sm text-muted-foreground">
							(Max {maxQuantity})
						</span>
					)}
				</div>
			)}

			{/* Action Buttons */}
			<div className="space-y-3 pt-2">
				{isOutOfStock && selectedVariant ?
					waitlistSubscribed ?
						<Button
							size="lg"
							variant="outline"
							className="w-full h-14"
							disabled
						>
							<CheckCircle className="mr-2 h-5 w-5 text-green-600" />
							You&apos;ll Be Notified
						</Button>
					:	<Button
							size="lg"
							variant="secondary"
							onClick={handleJoinWaitlist}
							disabled={isJoiningWaitlist}
							className="w-full h-14 text-base"
						>
							{isJoiningWaitlist ?
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									Adding…
								</>
							:	<>
									<Bell className="mr-2 h-5 w-5" />
									Notify Me When Available
								</>
							}
						</Button>

				:	<Button
						size="lg"
						onClick={handleAddToCart}
						disabled={
							!selectedVariant || selectedVariant.stock === 0 || isAddingToCart
						}
						className={cn(
							"w-full h-14 text-base transition-all",
							justAdded && "bg-green-600 hover:bg-green-600",
						)}
					>
						{isAddingToCart ?
							<>
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
								Adding…
							</>
						: justAdded ?
							<>
								<Check className="mr-2 h-5 w-5" />
								Added to Cart!
							</>
						:	<>
								<ShoppingBag className="mr-2 h-5 w-5" />
								Add to Cart
							</>
						}
					</Button>
				}

				{/* Secondary actions */}
				<div className="flex gap-3">
					<Button
						variant="outline"
						size="lg"
						className="flex-1 h-12"
						onClick={handleAddToWishlist}
						disabled={isAddingToWishlist}
					>
						{isAddingToWishlist ?
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						:	<Heart className="mr-2 h-5 w-5" />}
						Wishlist
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="h-12 w-12">
								<Share2 className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem onClick={handleCopyLink}>
								<Copy className="mr-2 h-4 w-4" />
								Copy Link
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Selection hint */}
				{!selectedSize && product.variants.length > 1 && (
					<p className="text-sm text-muted-foreground text-center">
						Please select a size
					</p>
				)}
			</div>

			{/* Size Guide Dialog */}
			<Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Size Guide</DialogTitle>
						<DialogDescription>Measurements are approximate.</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b">
									<th className="text-left py-2 font-medium">Size</th>
									<th className="text-left py-2 font-medium">Bust (in)</th>
									<th className="text-left py-2 font-medium">Waist (in)</th>
									<th className="text-left py-2 font-medium">Hips (in)</th>
								</tr>
							</thead>
							<tbody className="text-muted-foreground">
								{[
									["XS", "32-33", "24-25", "34-35"],
									["S", "34-35", "26-27", "36-37"],
									["M", "36-37", "28-29", "38-39"],
									["L", "38-40", "30-32", "40-42"],
									["XL", "41-43", "33-35", "43-45"],
									["XXL", "44-46", "36-38", "46-48"],
								].map(([size, bust, waist, hips], i) => (
									<tr key={size} className={i < 5 ? "border-b" : ""}>
										<td className="py-2 font-medium text-foreground">{size}</td>
										<td className="py-2">{bust}</td>
										<td className="py-2">{waist}</td>
										<td className="py-2">{hips}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
