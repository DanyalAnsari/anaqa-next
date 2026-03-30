"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Search, X, LayoutGrid, LayoutList, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shared/product-card";
import { ShopPagination } from "./shop-pagination";
import { ProductFilters } from "./product-filters";
import { MobileFilters } from "./mobile-filters";

type SortOption =
	| "newest"
	| "price-asc"
	| "price-desc"
	| "popular"
	| "rating"
	| "name";

interface Product {
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

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface Pagination {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
}

interface CurrentParams {
	category?: string;
	search?: string;
	sort?: SortOption;
	minPrice?: string;
	maxPrice?: string;
	sizes?: string;
	inStock?: string;
	onSale?: string;
	gender?: string;
}

interface ShopClientProps {
	products: Product[];
	categories: Category[];
	sizes: string[];
	pagination: Pagination;
	currentParams: CurrentParams;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
	{ value: "newest", label: "Newest" },
	{ value: "price-asc", label: "Price: Low to High" },
	{ value: "price-desc", label: "Price: High to Low" },
	{ value: "popular", label: "Most Popular" },
	{ value: "rating", label: "Highest Rated" },
	{ value: "name", label: "Name: A-Z" },
];

export function ShopClient({
	products,
	categories,
	sizes,
	pagination,
	currentParams,
}: ShopClientProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchInput, setSearchInput] = useState(currentParams.search || "");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const updateParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());

			// Reset page when filters change
			if (!("page" in updates)) {
				params.delete("page");
			}

			Object.entries(updates).forEach(([key, value]) => {
				if (value === undefined || value === "") {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			});

			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[router, pathname, searchParams],
	);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateParams({ search: searchInput || undefined });
	};

	const clearSearch = () => {
		setSearchInput("");
		updateParams({ search: undefined });
	};

	const handleSortChange = (value: SortOption) => {
		updateParams({ sort: value });
	};

	const handlePageChange = (page: number) => {
		updateParams({ page: page > 1 ? String(page) : undefined });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const clearAllFilters = () => {
		setSearchInput("");
		router.push(pathname);
	};

	const activeFilterCount = [
		currentParams.category,
		currentParams.minPrice || currentParams.maxPrice,
		currentParams.sizes,
		currentParams.inStock,
		currentParams.onSale,
		currentParams.gender,
	].filter(Boolean).length;

	return (
		<div className="flex flex-col lg:flex-row gap-8">
			{/* Desktop Filters Sidebar */}
			<aside className="hidden lg:block w-64 shrink-0">
				<div className="sticky top-24">
					<h2 className="text-lg font-medium mb-4">Filters</h2>
					<ProductFilters
						categories={categories}
						sizes={sizes}
						currentParams={currentParams}
						onParamChange={updateParams}
						onClearAll={clearAllFilters}
					/>
				</div>
			</aside>

			{/* Products */}
			<div className="flex-1 min-w-0 space-y-6">
				{/* Toolbar */}
				<div className="flex flex-col sm:flex-row gap-4">
					{/* Search */}
					<form onSubmit={handleSearch} className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="pl-10 pr-10 bg-background/50"
						/>
						{searchInput && (
							<button
								type="button"
								onClick={clearSearch}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</form>

					<div className="flex items-center gap-2">
						{/* Mobile Filters */}
						<MobileFilters
							categories={categories}
							sizes={sizes}
							currentParams={currentParams}
							onParamChange={updateParams}
							onClearAll={clearAllFilters}
							activeFilterCount={activeFilterCount}
						/>

						{/* View Toggle */}
						<div className="hidden sm:flex items-center border rounded-md">
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"rounded-none rounded-l-md",
									viewMode === "grid" && "bg-secondary",
								)}
								onClick={() => setViewMode("grid")}
								aria-label="Grid view"
							>
								<LayoutGrid className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									"rounded-none rounded-r-md",
									viewMode === "list" && "bg-secondary",
								)}
								onClick={() => setViewMode("list")}
								aria-label="List view"
							>
								<LayoutList className="h-4 w-4" />
							</Button>
						</div>

						{/* Sort */}
						<Select
							value={currentParams.sort || "newest"}
							onValueChange={handleSortChange}
						>
							<SelectTrigger className="w-[180px] bg-background/50">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								{SORT_OPTIONS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Results info */}
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{pagination.total} {pagination.total === 1 ? "product" : "products"}
						{currentParams.search && ` for "${currentParams.search}"`}
					</p>
					{activeFilterCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearAllFilters}
							className="text-xs gap-1"
						>
							<X className="h-3 w-3" />
							Clear all filters
						</Button>
					)}
				</div>

				{/* Search notice */}
				{currentParams.search && (
					<div className="p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
						<p className="text-sm">
							Showing results for:{" "}
							<strong>&ldquo;{currentParams.search}&rdquo;</strong>
						</p>
						<Button variant="ghost" size="sm" onClick={clearSearch}>
							Clear search
						</Button>
					</div>
				)}

				{/* Product Grid */}
				{products.length === 0 ?
					<div className="text-center py-16">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
							<Package className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-medium mb-2">No products found</h3>
						<p className="text-muted-foreground mb-6">
							{currentParams.search ?
								`No products found for "${currentParams.search}". Try adjusting your search or filters.`
							:	"No products match your current filters. Try adjusting or clearing filters."
							}
						</p>
						<Button variant="outline" onClick={clearAllFilters}>
							Clear all filters
						</Button>
					</div>
				:	<div
						className={cn(
							"grid gap-6",
							viewMode === "list" ?
								"grid-cols-1 sm:grid-cols-2"
							:	"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						)}
					>
						{products.map((p, idx) => (
							<ProductCard key={p.id} product={p} priority={idx < 4} />
						))}
					</div>
				}

				{/* Pagination */}
				{pagination.totalPages > 1 && (
					<div className="mt-12 space-y-4">
						<ShopPagination
							currentPage={pagination.page}
							totalPages={pagination.totalPages}
							onPageChange={handlePageChange}
						/>
						<p className="text-center text-sm text-muted-foreground">
							Showing {(pagination.page - 1) * pagination.limit + 1}–
							{Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
							of {pagination.total} products
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
