import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Truck,
	RefreshCw,
	Shield,
	Sparkles,
	Package,
} from "lucide-react";

import { ProductCard } from "@/components/shared/product-card";
import { CollectionCard } from "@/components/shared/collection-card";
import { NewsletterSection } from "@/components/shared/newsletter-section";
import { getFeaturedCollections } from "@/database/data/collections";
import {
	getProductsPrimaryImages,
	getTopSellingProducts,
} from "@/database/data/products";
import { getCategories } from "@/database/data/categories";

const valueProps = [
	{
		icon: Sparkles,
		title: "Premium Quality",
		description:
			"Ethically sourced materials, expertly crafted for lasting elegance.",
	},
	{
		icon: Truck,
		title: "Free Shipping",
		description: "Complimentary shipping on all orders over 200 SAR.",
	},
	{
		icon: RefreshCw,
		title: "Easy Returns",
		description: "30-day hassle-free returns for your peace of mind.",
	},
	{
		icon: Shield,
		title: "Secure Checkout",
		description: "Your payment information is always protected.",
	},
];

export default async function HomePage() {
	const [featuredCollections, featuredProducts, primaryImages, categories] =
		await Promise.all([
			getFeaturedCollections(3),
			getTopSellingProducts(8),
			getProductsPrimaryImages(),
			getCategories(4),
		]);

	// Fetch primary images for featured products

	const imageMap = new Map(primaryImages.map((img) => [img.productId, img]));

	const serializedProducts = featuredProducts.map((p) => {
		const img = imageMap.get(p.id);
		return {
			...p,
			price: Number(p.price),
			comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
			averageRating: Number(p.averageRating),
			imageFilePath: img?.filePath ?? null,
			imageAlt: img?.altText ?? p.name,
		};
	});

	return (
		<div className="animate-in fade-in duration-500">
			{/* Hero Section */}
			<section className="relative min-h-[85vh] flex items-center">
				<div className="absolute inset-0">
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80')",
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
				</div>

				<div className="relative container-wide py-20">
					<div className="max-w-2xl">
						<span className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground mb-6">
							Spring Collection 2024
						</span>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-balance">
							Elegance Refined for the Modern Woman
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
							Discover our curated collection of premium modest fashion. Each
							piece crafted with intention, designed for grace.
						</p>
						<div className="flex flex-wrap gap-4">
							<Button size="lg" className="h-12 px-8 group" asChild>
								<Link href="/shop">
									Shop Collection
									<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" className="h-12 px-8" asChild>
								<Link href="/collections">View Collections</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
					<div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-2">
						<div className="w-1 h-2 bg-foreground/40 rounded-full animate-bounce" />
					</div>
				</div>
			</section>

			{/* Value Props */}
			<section className="py-12 md:py-16 border-b border-border/40">
				<div className="container-wide">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
						{valueProps.map((prop) => {
							const Icon = prop.icon;
							return (
								<div key={prop.title} className="text-center">
									<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
										<Icon className="h-5 w-5 text-muted-foreground" />
									</div>
									<h3 className="font-medium mb-1 text-sm md:text-base">
										{prop.title}
									</h3>
									<p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
										{prop.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Featured Collections */}
			<section className="editorial-spacing">
				<div className="container-wide">
					<div className="flex items-end justify-between mb-8 md:mb-12">
						<div>
							<span className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
								Curated For You
							</span>
							<h2 className="text-3xl md:text-4xl font-medium">
								Shop by Collection
							</h2>
						</div>
						<Button variant="ghost" className="hidden md:flex" asChild>
							<Link href="/collections">
								View All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					{featuredCollections.length > 0 ?
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{featuredCollections.map((collection) => (
								<CollectionCard
									key={collection.id}
									collection={collection}
									variant="overlay"
								/>
							))}
						</div>
					:	<p className="text-center text-muted-foreground py-12">
							No collections available yet.
						</p>
					}

					<div className="mt-8 text-center md:hidden">
						<Button variant="outline" asChild>
							<Link href="/collections">
								View All Collections
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Featured Products */}
			<section className="editorial-spacing bg-secondary/30">
				<div className="container-wide">
					<div className="flex items-end justify-between mb-8 md:mb-12">
						<div>
							<span className="text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
								Bestsellers
							</span>
							<h2 className="text-3xl md:text-4xl font-medium">
								Featured Products
							</h2>
						</div>
						<Button variant="ghost" className="hidden md:flex" asChild>
							<Link href="/shop">
								Shop All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					{serializedProducts.length > 0 ?
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{serializedProducts.map((p, idx) => (
								<ProductCard key={p.id} product={p} priority={idx < 4} />
							))}
						</div>
					:	<div className="text-center py-16">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
								<Package className="h-8 w-8 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-medium mb-2">No products yet</h3>
							<p className="text-muted-foreground">
								Check back soon for new arrivals.
							</p>
						</div>
					}

					<div className="mt-12 text-center">
						<Button variant="outline" size="lg" asChild>
							<Link href="/shop">
								View All Products
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Editorial Banner */}
			<section className="editorial-spacing">
				<div className="container-wide">
					<div className="relative rounded-2xl overflow-hidden">
						<div
							className="absolute inset-0 bg-cover bg-center"
							style={{
								backgroundImage:
									"url('https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80')",
							}}
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

						<div className="relative py-20 md:py-32 px-8 md:px-16">
							<div className="max-w-xl text-white">
								<span className="text-sm uppercase tracking-widest text-white/70 mb-4 block">
									The Essentials
								</span>
								<h2 className="text-3xl md:text-5xl font-medium mb-6">
									Timeless Pieces for Every Wardrobe
								</h2>
								<p className="text-white/80 mb-8 leading-relaxed">
									Build your foundation with our essentials collection.
									Versatile, elegant, and designed to last.
								</p>
								<Button size="lg" variant="secondary" className="group" asChild>
									<Link href="/collections/essentials">
										Shop Essentials
										<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Categories Grid */}
			<section className="editorial-spacing bg-secondary/30">
				<div className="container-wide">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-medium mb-4">
							Shop by Category
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Find exactly what you&apos;re looking for in our carefully
							organized categories.
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
						{categories.map((cat) => (
							<Link
								key={cat.id}
								href={`/shop?category=${cat.slug}`}
								className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary"
							>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
								<div className="absolute inset-0 flex items-end p-4 md:p-6">
									<h3 className="text-white font-medium text-lg md:text-xl">
										{cat.name}
									</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Testimonial */}
			<section className="editorial-spacing">
				<div className="container-narrow text-center">
					<span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
						What Our Customers Say
					</span>
					<blockquote className="text-2xl md:text-3xl font-medium italic mb-6 leading-relaxed">
						&ldquo;Anāqa has completely transformed my wardrobe. The quality is
						exceptional, and I love how each piece makes me feel elegant and
						confident.&rdquo;
					</blockquote>
					<div className="flex items-center justify-center gap-3">
						<div className="w-12 h-12 rounded-full bg-secondary" />
						<div className="text-left">
							<p className="font-medium">Sarah M.</p>
							<p className="text-sm text-muted-foreground">Verified Customer</p>
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter */}
			<NewsletterSection />
		</div>
	);
}
