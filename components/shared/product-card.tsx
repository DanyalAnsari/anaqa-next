import Link from "next/link";
import { Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/image";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductCardProduct {
	id: string;
	name: string;
	slug: string;
	price: number;
	comparePrice: number | null;
	averageRating: number;
	reviewCount: number;
	totalStock: number;
	imageFilePath: string | null;
	imageAlt: string;
}

interface ProductCardProps {
	product: ProductCardProduct;
	priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
	const hasDiscount =
		product.comparePrice !== null && product.comparePrice > product.price;
	const discountPercent =
		hasDiscount ?
			Math.round(
				((product.comparePrice! - product.price) / product.comparePrice!) * 100,
			)
		:	0;
	const isOutOfStock = product.totalStock === 0;

	return (
		<Link
			href={`/products/${product.slug}`}
			className={cn("group block", isOutOfStock && "opacity-75")}
		>
			{/* Image */}
			<div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary mb-3">
				{product.imageFilePath ?
					<ProductImage
						filePath={product.imageFilePath}
						alt={product.imageAlt}
						width={400}
						height={533}
						priority={priority}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						transforms="w-800,h-1066,c-at_max,q-80"
					/>
				:	<div className="w-full h-full flex items-center justify-center">
						<Package className="h-12 w-12 text-muted-foreground/20" />
					</div>
				}

				{/* Badges */}
				<div className="absolute top-2 left-2 flex flex-col gap-1">
					{hasDiscount && (
						<Badge className="bg-red-500 text-white border-0 text-xs">
							-{discountPercent}%
						</Badge>
					)}
					{isOutOfStock && (
						<Badge variant="secondary" className="text-xs">
							Out of Stock
						</Badge>
					)}
				</div>
			</div>

			{/* Info */}
			<div className="space-y-1.5">
				<h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
					{product.name}
				</h3>

				{product.reviewCount > 0 && (
					<div className="flex items-center gap-1">
						<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-medium">
							{product.averageRating.toFixed(1)}
						</span>
						<span className="text-xs text-muted-foreground">
							({product.reviewCount})
						</span>
					</div>
				)}

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
			</div>
		</Link>
	);
}

export function ProductCardSkeleton() {
	return (
		<div className="space-y-3">
			<div className="aspect-[3/4] rounded-lg bg-secondary animate-pulse" />
			<div className="space-y-2">
				<div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
				<div className="h-4 bg-secondary rounded animate-pulse w-1/2" />
			</div>
		</div>
	);
}
