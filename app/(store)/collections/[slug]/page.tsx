import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/database";
import { collection, product, productImage } from "@/database/schemas";
import { eq, and, desc } from "drizzle-orm";
import { ProductCard } from "@/components/shared/product-card";
import { ProductImage as ProductImg } from "@/components/ui/image";

interface CollectionDetailPageProps {
	params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({
	params,
}: CollectionDetailPageProps) {
	const { slug } = await params;

	// Fetch collection
	const [coll] = await db
		.select({
			id: collection.id,
			name: collection.name,
			slug: collection.slug,
			description: collection.description,
			imageFilePath: collection.imageFilePath,
		})
		.from(collection)
		.where(and(eq(collection.slug, slug), eq(collection.isActive, true)))
		.limit(1);

	if (!coll) {
		notFound();
	}

	// Fetch products in this collection
	const products = await db
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
		.where(and(eq(product.collectionId, coll.id), eq(product.isActive, true)))
		.orderBy(desc(product.createdAt));

	// Fetch primary images
	const productIds = products.map((p) => p.id);
	const primaryImages =
		productIds.length > 0 ?
			await db
				.select({
					productId: productImage.productId,
					filePath: productImage.filePath,
					altText: productImage.altText,
				})
				.from(productImage)
				.where(eq(productImage.position, 0))
		:	[];

	const imageMap = new Map(
		primaryImages
			.filter((img) => productIds.includes(img.productId))
			.map((img) => [img.productId, img]),
	);

	const serialized = products.map((p) => {
		const img = imageMap.get(p.id);
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

	return (
		<div className="animate-in fade-in duration-500">
			{/* Hero */}
			<section className="relative">
				{coll.imageFilePath && (
					<div className="absolute inset-0">
						<ProductImg
							filePath={coll.imageFilePath}
							alt={coll.name}
							width={1920}
							height={600}
							priority
							className="w-full h-full object-cover"
							transforms="w-1920,h-600,c-at_max,q-80"
						/>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

				<div className="relative container-wide py-16 md:py-24">
					<nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<ChevronRight className="h-4 w-4" />
						<Link
							href="/collections"
							className="hover:text-foreground transition-colors"
						>
							Collections
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="text-foreground">{coll.name}</span>
					</nav>

					<div className="max-w-2xl">
						<h1 className="text-4xl md:text-5xl font-medium mb-4">
							{coll.name}
						</h1>
						{coll.description && (
							<p className="text-lg text-muted-foreground">
								{coll.description}
							</p>
						)}
					</div>
				</div>
			</section>

			{/* Products */}
			<section className="editorial-spacing">
				<div className="container-wide">
					<div className="mb-8">
						<p className="text-muted-foreground">
							{serialized.length}{" "}
							{serialized.length === 1 ? "product" : "products"}
						</p>
					</div>

					{serialized.length === 0 ?
						<div className="text-center py-16">
							<h3 className="text-lg font-medium mb-2">
								No products in this collection yet
							</h3>
							<p className="text-muted-foreground">
								Check back soon for new additions.
							</p>
						</div>
					:	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{serialized.map((p, idx) => (
								<ProductCard key={p.id} product={p} priority={idx < 4} />
							))}
						</div>
					}
				</div>
			</section>
		</div>
	);
}
