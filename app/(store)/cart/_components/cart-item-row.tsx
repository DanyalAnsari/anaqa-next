"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { buildImageKitUrl } from "@/components/ui/image";
import { updateCartItemQuantity, removeCartItem } from "../actions";
import type { CartItemData } from "../lib/data/cart";

interface CartItemRowProps {
	item: CartItemData;
	variant?: "page" | "drawer";
}

export function CartItemRow({ item, variant = "page" }: CartItemRowProps) {
	const [isUpdating, startUpdateTransition] = useTransition();
	const [isRemoving, startRemoveTransition] = useTransition();

	const imageUrl =
		item.imageFilePath ?
			buildImageKitUrl(
				item.imageFilePath,
				variant === "drawer" ?
					"w-128,h-160,c-at_max,q-70"
				:	"w-256,h-320,c-at_max,q-80",
			)
		:	null;

	const handleUpdateQuantity = (newQuantity: number) => {
		if (newQuantity < 1 || newQuantity > item.currentStock) return;

		startUpdateTransition(async () => {
			const result = await updateCartItemQuantity(item.id, newQuantity);
			if (!result.success) {
				toast.error(result.error);
			}
		});
	};

	const handleRemove = () => {
		startRemoveTransition(async () => {
			const result = await removeCartItem(item.id);
			if (result.success) {
				toast.success("Item removed");
			} else {
				toast.error(result.error);
			}
		});
	};

	const isBusy = isUpdating || isRemoving;
	const lineTotal = item.price * item.quantity;
	const isDrawer = variant === "drawer";

	return (
		<div
			className={cn(
				"flex gap-4 py-4",
				isBusy && "opacity-60 pointer-events-none",
			)}
		>
			{/* Image */}
			<Link href={`/products/${item.productSlug}`} className="shrink-0">
				<div
					className={cn(
						"bg-secondary rounded-lg overflow-hidden",
						isDrawer ? "w-16 h-20" : "w-24 h-32 md:w-28 md:h-36",
					)}
				>
					{imageUrl ?
						<Image
							src={imageUrl}
							alt={item.imageAlt}
							width={isDrawer ? 64 : 128}
							height={isDrawer ? 80 : 160}
							className="w-full h-full object-cover"
						/>
					:	<div className="w-full h-full flex items-center justify-center">
							<Package className="h-6 w-6 text-muted-foreground/20" />
						</div>
					}
				</div>
			</Link>

			{/* Details */}
			<div className="flex-1 min-w-0">
				<Link
					href={`/products/${item.productSlug}`}
					className={cn(
						"font-medium hover:text-primary transition-colors line-clamp-2",
						isDrawer ? "text-xs" : "text-sm",
					)}
				>
					{item.productName}
				</Link>
				<p
					className={cn(
						"text-muted-foreground mt-0.5",
						isDrawer ? "text-xs" : "text-sm",
					)}
				>
					Size: {item.size}
				</p>
				<p
					className={cn("font-medium mt-0.5", isDrawer ? "text-xs" : "text-sm")}
				>
					{formatPrice(item.price)}
				</p>

				{/* Quantity Controls */}
				<div className="flex items-center gap-2 mt-2">
					<div className="flex items-center border rounded-md">
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"rounded-none rounded-l-md",
								isDrawer ? "h-7 w-7" : "h-8 w-8",
							)}
							onClick={() => handleUpdateQuantity(item.quantity - 1)}
							disabled={isBusy || item.quantity <= 1}
						>
							<Minus className="h-3 w-3" />
						</Button>
						<div
							className={cn(
								"flex items-center justify-center border-x",
								isDrawer ? "w-8 h-7 text-xs" : "w-10 h-8 text-sm",
							)}
						>
							{isUpdating ?
								<Loader2 className="h-3 w-3 animate-spin" />
							:	item.quantity}
						</div>
						<Button
							variant="ghost"
							size="icon"
							className={cn(
								"rounded-none rounded-r-md",
								isDrawer ? "h-7 w-7" : "h-8 w-8",
							)}
							onClick={() => handleUpdateQuantity(item.quantity + 1)}
							disabled={isBusy || item.quantity >= item.currentStock}
						>
							<Plus className="h-3 w-3" />
						</Button>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"text-muted-foreground hover:text-destructive",
							isDrawer ? "h-7 w-7" : "h-8 w-8",
						)}
						onClick={handleRemove}
						disabled={isBusy}
					>
						{isRemoving ?
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
						:	<Trash2 className="h-3.5 w-3.5" />}
					</Button>
				</div>

				{item.currentStock > 0 && item.currentStock <= 3 && (
					<p className="text-xs text-orange-600 mt-1.5">
						Only {item.currentStock} left
					</p>
				)}
			</div>

			{/* Line Total */}
			{!isDrawer && (
				<div className="text-right shrink-0">
					<p className="font-semibold text-sm">{formatPrice(lineTotal)}</p>
				</div>
			)}
		</div>
	);
}
