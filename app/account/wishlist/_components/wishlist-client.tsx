"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Heart,
	Trash2,
	ShoppingBag,
	Loader2,
	Star,
	ExternalLink,
	PackageX,
	X,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
import { removeFromWishlist, clearWishlist } from "../actions";

interface WishlistProduct {
	id: string;
	name: string;
	slug: string;
	price: number;
	comparePrice: number | null;
	isActive: boolean;
	totalStock: number;
	averageRating: number;
	reviewCount: number;
	image: {
		filePath: string;
		altText: string | null;
	} | null;
}

interface WishlistItem {
	productId: string;
	createdAt: Date;
	product: WishlistProduct;
}

interface WishlistClientProps {
	items: WishlistItem[];
}

export function WishlistClient({ items }: WishlistClientProps) {
	const [showClearDialog, setShowClearDialog] = useState(false);
	const [isClearing, startClearTransition] = useTransition();

	const handleClearAll = () => {
		startClearTransition(async () => {
			const result = await clearWishlist();
			if (result.success) {
				toast.success("Wishlist cleared");
				setShowClearDialog(false);
			} else {
				toast.error(result.error);
			}
		});
	};

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-secondary/20">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
					<Heart className="h-8 w-8 text-primary" />
				</div>
				<h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
				<p className="text-muted-foreground mb-6 max-w-sm">
					Save items you love to your wishlist to easily find them later.
				</p>
				<Button asChild className="gap-2">
					<Link href="/shop">
						<ShoppingBag className="h-4 w-4" />
						Continue Shopping
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<>
			{/* Action Bar */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{items.length} {items.length === 1 ? "item" : "items"} saved
				</p>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setShowClearDialog(true)}
					className="text-muted-foreground hover:text-destructive gap-2"
				>
					<Trash2 className="h-4 w-4" />
					Clear All
				</Button>
			</div>

			{/* Wishlist Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((item) => (
					<WishlistItemCard key={item.productId} item={item} />
				))}
			</div>

			{/* Clear All Confirmation */}
			<AlertDialog
				open={showClearDialog}
				onOpenChange={(open) => {
					if (!open && !isClearing) setShowClearDialog(false);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear Wishlist</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove all {items.length} items from your
							wishlist? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowClearDialog(false)}
							disabled={isClearing}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleClearAll}
							disabled={isClearing}
						>
							{isClearing ?
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Clearing…
								</>
							:	"Clear All"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

function WishlistItemCard({ item }: { item: WishlistItem }) {
	const [isRemoving, startRemoveTransition] = useTransition();
	const { product } = item;
	const isOutOfStock = product.totalStock === 0;
	const isInactive = !product.isActive;
	const hasDiscount =
		product.comparePrice && product.comparePrice > product.price;
	const discountPercent =
		hasDiscount ?
			Math.round(
				((product.comparePrice! - product.price) / product.comparePrice!) * 100,
			)
		:	0;

	const imageUrl =
		product.image?.filePath ?
			product.image.filePath.startsWith("http") ?
				product.image.filePath
			:	`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${product.image.filePath}`
		:	null;

	const handleRemove = () => {
		startRemoveTransition(async () => {
			const result = await removeFromWishlist(item.productId);
			if (result.success) {
				toast.success("Removed from wishlist");
			} else {
				toast.error(result.error);
			}
		});
	};

	return (
		<Card
			className={cn(
				"group relative overflow-hidden transition-all duration-200",
				"border-border/50 bg-background/50 backdrop-blur-sm",
				"hover:border-primary/30 hover:shadow-sm",
				(isOutOfStock || isInactive) && "opacity-75",
			)}
		>
			{/* Remove Button */}
			<Button
				variant="ghost"
				size="icon"
				className={cn(
					"absolute top-2 right-2 z-10 h-8 w-8 rounded-full",
					"bg-background/80 backdrop-blur-sm shadow-sm",
					"opacity-0 group-hover:opacity-100 transition-opacity",
					"hover:bg-destructive/10 hover:text-destructive",
				)}
				onClick={handleRemove}
				disabled={isRemoving}
			>
				{isRemoving ?
					<Loader2 className="h-4 w-4 animate-spin" />
				:	<X className="h-4 w-4" />}
				<span className="sr-only">Remove from wishlist</span>
			</Button>

			{/* Status Badges */}
			<div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
				{hasDiscount && (
					<Badge className="bg-red-500 text-white border-0 text-xs">
						-{discountPercent}%
					</Badge>
				)}
				{isOutOfStock && (
					<Badge variant="secondary" className="text-xs gap-1">
						<PackageX className="h-3 w-3" />
						Out of Stock
					</Badge>
				)}
				{isInactive && (
					<Badge variant="destructive" className="text-xs">
						Unavailable
					</Badge>
				)}
			</div>

			<Link href={`/products/${product.slug}`}>
				{/* Image */}
				<div className="aspect-[3/4] bg-secondary/30 overflow-hidden">
					{imageUrl ?
						<Image
							src={imageUrl}
							alt={product.image?.altText || product.name}
							width={400}
							height={533}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
					:	<div className="w-full h-full flex items-center justify-center">
							<ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
						</div>
					}
				</div>
			</Link>

			<CardContent className="p-4 space-y-3">
				{/* Product Info */}
				<div className="space-y-1.5">
					<Link
						href={`/products/${product.slug}`}
						className="block group-hover:text-primary transition-colors"
					>
						<h3 className="font-semibold text-sm leading-snug line-clamp-2">
							{product.name}
						</h3>
					</Link>

					{/* Rating */}
					{product.reviewCount > 0 && (
						<div className="flex items-center gap-1.5">
							<div className="flex items-center gap-0.5">
								<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
								<span className="text-xs font-medium">
									{product.averageRating.toFixed(1)}
								</span>
							</div>
							<span className="text-xs text-muted-foreground">
								({product.reviewCount})
							</span>
						</div>
					)}
				</div>

				{/* Price */}
				<div className="flex items-center gap-2">
					<span className="font-bold text-sm">
						{formatPrice(product.price)}
					</span>
					{hasDiscount && (
						<span className="text-xs text-muted-foreground line-through">
							{formatPrice(product.comparePrice!)}
						</span>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-2 pt-1">
					<Button
						asChild
						variant="outline"
						size="sm"
						className="flex-1 gap-1.5"
						disabled={isOutOfStock || isInactive}
					>
						<Link href={`/products/${product.slug}`}>
							<ExternalLink className="h-3.5 w-3.5" />
							View
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="text-destructive hover:text-destructive hover:bg-destructive/10"
						onClick={handleRemove}
						disabled={isRemoving}
					>
						{isRemoving ?
							<Loader2 className="h-4 w-4 animate-spin" />
						:	<Trash2 className="h-4 w-4" />}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
