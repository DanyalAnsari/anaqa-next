import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/database";
import {
	product,
	productImage,
	productVariant,
	category,
} from "@/database/schemas";
import { eq, and, desc, asc, gte, lte, gt, sql, inArray } from "drizzle-orm";
import { ShopClient } from "./_components/shop-client";

type SortOption =
	| "newest"
	| "price-asc"
	| "price-desc"
	| "popular"
	| "rating"
	| "name";

interface ShopPageProps {
	searchParams: Promise<{
		category?: string;
		search?: string;
		sort?: SortOption;
		page?: string;
		minPrice?: string;
		maxPrice?: string;
		sizes?: string;
		inStock?: string;
		onSale?: string;
		gender?: string;
	}>;
}

const PAGE_SIZE = 12;

export default async function ShopPage({ searchParams }: ShopPageProps) {
	const params = await searchParams;

	const currentPage = Math.max(1, parseInt(params.page || "1", 10));
	const sort: SortOption = (params.sort as SortOption) || "newest";
	const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
	const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
	const selectedSizes = params.sizes?.split(",").filter(Boolean) ?? [];
	const inStockOnly = params.inStock === "true";
	const onSaleOnly = params.onSale === "true";
	const searchQuery = params.search?.trim() || undefined;
	const categorySlug = params.category || undefined;
	const gender = params.gender || undefined;

	// ── Resolve category ──
	let categoryId: string | undefined;
	let categoryName: string | undefined;

	if (categorySlug) {
		const [cat] = await db
			.select({ id: category.id, name: category.name })
			.from(category)
			.where(and(eq(category.slug, categorySlug), eq(category.isActive, true)))
			.limit(1);
		if (cat) {
			categoryId = cat.id;
			categoryName = cat.name;
		}
	}

	// ── Build conditions ──
	const conditions = [eq(product.isActive, true)];

	if (categoryId) {
		conditions.push(eq(product.categoryId, categoryId));
	}
	if (gender) {
		conditions.push(eq(product.gender, gender as "men" | "women" | "unisex"));
	}
	if (minPrice !== undefined) {
		conditions.push(gte(product.price, String(minPrice)));
	}
	if (maxPrice !== undefined) {
		conditions.push(lte(product.price, String(maxPrice)));
	}
	if (inStockOnly) {
		conditions.push(gt(product.totalStock, 0));
	}
	if (onSaleOnly) {
		conditions.push(
			sql`${product.comparePrice} IS NOT NULL AND ${product.comparePrice} > ${product.price}`,
		);
	}
	if (searchQuery) {
		conditions.push(
			sql`(
        ${product.name} ILIKE ${"%" + searchQuery + "%"} OR
        ${product.description} ILIKE ${"%" + searchQuery + "%"} OR
        ${product.shortDescription} ILIKE ${"%" + searchQuery + "%"}
      )`,
		);
	}

	// ── Size filter: find products that have matching variants ──
	let sizeFilteredProductIds: string[] | undefined;
	if (selectedSizes.length > 0) {
		const sizeResults = await db
			.selectDistinct({ productId: productVariant.productId })
			.from(productVariant)
			.where(
				and(
					inArray(productVariant.size, selectedSizes as any),
					gt(productVariant.stock, 0),
				),
			);
		sizeFilteredProductIds = sizeResults.map((r) => r.productId);

		if (sizeFilteredProductIds.length === 0) {
			// No products match the size filter
			sizeFilteredProductIds = ["__none__"];
		}
		conditions.push(inArray(product.id, sizeFilteredProductIds));
	}

	// ── Sort ──
	const orderByClause = (() => {
		switch (sort) {
			case "price-asc":
				return asc(product.price);
			case "price-desc":
				return desc(product.price);
			case "popular":
				return desc(product.soldCount);
			case "rating":
				return desc(product.averageRating);
			case "name":
				return asc(product.name);
			case "newest":
			default:
				return desc(product.createdAt);
		}
	})();

	// ── Count ──
	const [{ count: totalCount }] = await db
		.select({ count: sql<number>`COUNT(*)::int` })
		.from(product)
		.where(and(...conditions));

	const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
	const offset = (currentPage - 1) * PAGE_SIZE;

	// ── Query products ──
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
		.where(and(...conditions))
		.orderBy(orderByClause)
		.limit(PAGE_SIZE)
		.offset(offset);

	// ── Primary images ──
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
				.where(
					and(
						inArray(productImage.productId, productIds),
						eq(productImage.position, 0),
					),
				)
		:	[];

	const imageMap = new Map(primaryImages.map((img) => [img.productId, img]));

	// ── Fetch all categories for filter sidebar ──
	const allCategories = await db
		.select({
			id: category.id,
			name: category.name,
			slug: category.slug,
		})
		.from(category)
		.where(and(eq(category.isActive, true), eq(category.level, 0)))
		.orderBy(asc(category.sortOrder));

	// ── Fetch available sizes ──
	const availableSizes = await db
		.selectDistinct({ size: productVariant.size })
		.from(productVariant)
		.innerJoin(product, eq(productVariant.productId, product.id))
		.where(eq(product.isActive, true));

	const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
	const sizes = availableSizes
		.map((s) => s.size)
		.sort((a, b) => {
			const ai = sizeOrder.indexOf(a);
			const bi = sizeOrder.indexOf(b);
			if (ai === -1 && bi === -1) return a.localeCompare(b);
			if (ai === -1) return 1;
			if (bi === -1) return -1;
			return ai - bi;
		});

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
			<section className="bg-secondary/30 py-8 md:py-12">
				<div className="container-wide">
					<nav className="mb-4 flex items-center space-x-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="text-foreground">Shop</span>
						{categoryName && (
							<>
								<ChevronRight className="h-4 w-4" />
								<span className="text-foreground">{categoryName}</span>
							</>
						)}
					</nav>

					<div className="max-w-2xl">
						<h1 className="text-3xl md:text-4xl font-medium mb-2">
							{categoryName || "All Products"}
						</h1>
						<p className="text-muted-foreground">
							{searchQuery ?
								`Search results for "${searchQuery}"`
							:	"Discover our complete collection of premium modest fashion."}
						</p>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="py-8 md:py-12">
				<div className="container-wide">
					<ShopClient
						products={serialized}
						categories={allCategories}
						sizes={sizes}
						pagination={{
							page: currentPage,
							totalPages,
							total: totalCount,
							limit: PAGE_SIZE,
						}}
						currentParams={{
							category: categorySlug,
							search: searchQuery,
							sort,
							minPrice: minPrice?.toString(),
							maxPrice: maxPrice?.toString(),
							sizes:
								selectedSizes.length > 0 ? selectedSizes.join(",") : undefined,
							inStock: inStockOnly ? "true" : undefined,
							onSale: onSaleOnly ? "true" : undefined,
							gender,
						}}
					/>
				</div>
			</section>
		</div>
	);
}
