import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import {
	product,
	productImage,
	productVariant,
	category,
	review,
	user,
} from "@/database/schemas";
import { eq, and, desc, sql, ne } from "drizzle-orm";
import { ProductGallery } from "./_components/product-gallery";
import { ProductActions } from "./_components/product-action";
import { ProductInfo } from "./_components/product-info";
import { ProductDetailTabs } from "./_components/product-details-tab";
import { ProductReviews } from "./_components/product-reviews";
import { ProductCard } from "@/components/shared/product-card";

interface ProductDetailPageProps {
	params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
	params,
}: ProductDetailPageProps) {
	const { slug } = await params;

	// ── Fetch product ──
	const [prod] = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			description: product.description,
			shortDescription: product.shortDescription,
			price: product.price,
			comparePrice: product.comparePrice,
			categoryId: product.categoryId,
			collectionId: product.collectionId,
			tags: product.tags,
			gender: product.gender,
			totalStock: product.totalStock,
			averageRating: product.averageRating,
			reviewCount: product.reviewCount,
		})
		.from(product)
		.where(and(eq(product.slug, slug), eq(product.isActive, true)))
		.limit(1);

	if (!prod) {
		notFound();
	}

	// ── Fetch category ──
	const [cat] = await db
		.select({ name: category.name, slug: category.slug })
		.from(category)
		.where(eq(category.id, prod.categoryId))
		.limit(1);

	// ── Fetch images ──
	const images = await db
		.select({
			id: productImage.id,
			filePath: productImage.filePath,
			altText: productImage.altText,
			position: productImage.position,
		})
		.from(productImage)
		.where(eq(productImage.productId, prod.id))
		.orderBy(productImage.position);

	// ── Fetch variants ──
	const variants = await db
		.select({
			id: productVariant.id,
			size: productVariant.size,
			stock: productVariant.stock,
			sku: productVariant.sku,
		})
		.from(productVariant)
		.where(eq(productVariant.productId, prod.id));

	const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
	const sortedVariants = [...variants].sort((a, b) => {
		const ai = sizeOrder.indexOf(a.size);
		const bi = sizeOrder.indexOf(b.size);
		if (ai === -1 && bi === -1) return a.size.localeCompare(b.size);
		if (ai === -1) return 1;
		if (bi === -1) return -1;
		return ai - bi;
	});

	// ── Fetch reviews (first page) ──
	const reviews = await db
		.select({
			id: review.id,
			rating: review.rating,
			title: review.title,
			comment: review.comment,
			isVerifiedPurchase: review.isVerifiedPurchase,
			createdAt: review.createdAt,
			userName: user.name,
		})
		.from(review)
		.innerJoin(user, eq(review.userId, user.id))
		.where(and(eq(review.productId, prod.id), eq(review.isApproved, true)))
		.orderBy(desc(review.createdAt))
		.limit(5);

	const [reviewStats] = await db
		.select({
			total: sql<number>`COUNT(*)::int`,
			avg: sql<number>`COALESCE(AVG(${review.rating}), 0)`,
		})
		.from(review)
		.where(and(eq(review.productId, prod.id), eq(review.isApproved, true)));

	// ── Fetch related products ──
	const relatedProducts = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			comparePrice: product.comparePrice,
			averageRating: product.averageRating,
			reviewCount: product.reviewCount,
			totalStock: product.totalStock,
		})
		.from(product)
		.where(
			and(
				eq(product.isActive, true),
				eq(product.categoryId, prod.categoryId),
				ne(product.id, prod.id),
			),
		)
		.orderBy(desc(product.soldCount))
		.limit(4);

	// Primary images for related products
	const relatedIds = relatedProducts.map((p) => p.id);
	const relatedImages = await db
		.select({
			productId: productImage.productId,
			filePath: productImage.filePath,
			altText: productImage.altText,
		})
		.from(productImage)
		.where(eq(productImage.position, 0));

	const relatedImageMap = new Map(
		relatedImages
			.filter((img) => relatedIds.includes(img.productId))
			.map((img) => [img.productId, img]),
	);

	const serializedRelated = relatedProducts.map((p) => {
		const img = relatedImageMap.get(p.id);
		return {
			id: p.id,
			name: p.name,
			slug: p.slug,
			price: Number(p.price),
			comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
			averageRating: Number(p.averageRating),
			reviewCount: p.reviewCount,
			totalStock: p.totalStock,
			imageFilePath: img?.filePath ?? null,
			imageAlt: img?.altText ?? p.name,
		};
	});

	// ── Serialize ──
	const serializedProduct = {
		id: prod.id,
		name: prod.name,
		slug: prod.slug,
		description: prod.description,
		shortDescription: prod.shortDescription,
		price: Number(prod.price),
		comparePrice: prod.comparePrice ? Number(prod.comparePrice) : null,
		tags: prod.tags,
		gender: prod.gender,
		totalStock: prod.totalStock,
		averageRating: Number(prod.averageRating),
		reviewCount: prod.reviewCount,
		category: cat ? { name: cat.name, slug: cat.slug } : null,
		images: images.map((img) => ({
			id: img.id,
			filePath: img.filePath,
			altText: img.altText,
			position: img.position,
		})),
		variants: sortedVariants.map((v) => ({
			id: v.id,
			size: v.size,
			stock: v.stock,
			sku: v.sku,
		})),
	};

	const serializedReviews = reviews.map((r) => ({
		id: r.id,
		rating: r.rating,
		title: r.title,
		comment: r.comment,
		isVerifiedPurchase: r.isVerifiedPurchase,
		createdAt: r.createdAt,
		userName: r.userName,
	}));

	return (
		<div className="animate-in fade-in duration-500">
			{/* Breadcrumb */}
			<div className="bg-secondary/30 py-4">
				<div className="container-wide">
					<nav className="flex items-center space-x-2 text-sm text-muted-foreground overflow-x-auto">
						<Link
							href="/"
							className="hover:text-foreground transition-colors whitespace-nowrap"
						>
							Home
						</Link>
						<ChevronRight className="h-4 w-4 shrink-0" />
						<Link
							href="/shop"
							className="hover:text-foreground transition-colors whitespace-nowrap"
						>
							Shop
						</Link>
						{serializedProduct.category && (
							<>
								<ChevronRight className="h-4 w-4 shrink-0" />
								<Link
									href={`/shop?category=${serializedProduct.category.slug}`}
									className="hover:text-foreground transition-colors whitespace-nowrap"
								>
									{serializedProduct.category.name}
								</Link>
							</>
						)}
						<ChevronRight className="h-4 w-4 shrink-0" />
						<span className="text-foreground truncate max-w-[200px]">
							{serializedProduct.name}
						</span>
					</nav>
				</div>
			</div>

			{/* Main Product */}
			<section className="py-8 md:py-12">
				<div className="container-wide">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						{/* Gallery */}
						<ProductGallery
							images={serializedProduct.images}
							productTitle={serializedProduct.name}
						/>

						{/* Details */}
						<div className="lg:sticky lg:top-24 lg:self-start space-y-6">
							<ProductInfo product={serializedProduct} />
							<Separator />
							<ProductActions product={serializedProduct} />
						</div>
					</div>

					{/* Tabs */}
					<ProductDetailTabs product={serializedProduct} />

					{/* Reviews */}
					<div className="mt-12 pt-8 border-t border-border">
						<ProductReviews
							productId={serializedProduct.id}
							productName={serializedProduct.name}
							reviews={serializedReviews}
							totalReviews={reviewStats.total}
							averageRating={Number(reviewStats.avg)}
						/>
					</div>
				</div>
			</section>

			{/* Related Products */}
			{serializedRelated.length > 0 && (
				<section className="py-12 md:py-16 bg-secondary/30">
					<div className="container-wide">
						<h2 className="text-2xl font-medium mb-8">You May Also Like</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{serializedRelated.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
