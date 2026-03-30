import { Badge } from "@/components/ui/badge";
import { Star, Truck, RotateCcw, Shield } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
	product: {
		name: string;
		shortDescription: string | null;
		price: number;
		comparePrice: number | null;
		averageRating: number;
		reviewCount: number;
		totalStock: number;
		category: { name: string; slug: string } | null;
		gender: string;
	};
}

export function ProductInfo({ product }: ProductInfoProps) {
	const hasDiscount =
		product.comparePrice !== null && product.comparePrice > product.price;
	const discountPercent =
		hasDiscount ?
			Math.round((1 - product.price / product.comparePrice!) * 100)
		:	0;

	return (
		<div className="space-y-4">
			{/* Badges */}
			<div className="flex flex-wrap items-center gap-2">
				{product.category && (
					<Badge variant="secondary" className="text-xs">
						{product.category.name}
					</Badge>
				)}
				<Badge variant="outline" className="text-xs capitalize">
					{product.gender}
				</Badge>
				{hasDiscount && (
					<Badge variant="destructive" className="text-xs">
						{discountPercent}% OFF
					</Badge>
				)}
			</div>

			{/* Name */}
			<div>
				<h1 className="text-2xl md:text-3xl font-medium">{product.name}</h1>
				{product.shortDescription && (
					<p className="text-muted-foreground mt-1">
						{product.shortDescription}
					</p>
				)}
			</div>

			{/* Rating */}
			{product.reviewCount > 0 && (
				<div className="flex items-center gap-2">
					<div className="flex items-center">
						{[1, 2, 3, 4, 5].map((i) => (
							<Star
								key={i}
								className={`h-4 w-4 ${
									i <= Math.round(product.averageRating) ?
										"text-yellow-500 fill-yellow-500"
									:	"text-muted-foreground/30"
								}`}
							/>
						))}
					</div>
					<span className="text-sm text-muted-foreground">
						{product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
					</span>
				</div>
			)}

			{/* Price */}
			<div className="flex items-baseline gap-3">
				<span className="text-3xl font-medium">
					{formatPrice(product.price)}
				</span>
				{hasDiscount && (
					<span className="text-xl text-muted-foreground line-through">
						{formatPrice(product.comparePrice!)}
					</span>
				)}
			</div>

			{/* Trust Badges */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Truck className="h-4 w-4 shrink-0" />
					<span>Free shipping over 200 SAR</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<RotateCcw className="h-4 w-4 shrink-0" />
					<span>30-day returns</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Shield className="h-4 w-4 shrink-0" />
					<span>Secure checkout</span>
				</div>
			</div>
		</div>
	);
}
