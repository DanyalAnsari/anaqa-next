"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/shared/product-card";

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

const POPULAR_SEARCHES = [
	"Abaya",
	"Hijab",
	"Maxi dress",
	"Evening wear",
	"Cotton",
	"Silk",
];

interface SearchClientProps {
	initialQuery: string;
	initialResults: Product[];
	categories: Category[];
}

export function SearchClient({
	initialQuery,
	initialResults,
	categories,
}: SearchClientProps) {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState(initialQuery);
	const hasSearched = !!initialQuery;

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		}
	};

	const handleQuickSearch = (term: string) => {
		setQuery(term);
		router.push(`/search?q=${encodeURIComponent(term)}`);
	};

	const clearSearch = () => {
		setQuery("");
		router.push("/search");
		inputRef.current?.focus();
	};

	return (
		<div className="animate-in fade-in duration-500 min-h-[80vh]">
			{/* Search Header */}
			<section className="bg-secondary/30 py-8 md:py-12">
				<div className="container-wide">
					<div className="max-w-2xl mx-auto">
						<h1 className="text-3xl md:text-4xl font-medium text-center mb-6">
							Search
						</h1>

						<form onSubmit={handleSubmit} className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								ref={inputRef}
								type="search"
								placeholder="Search for products..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="h-14 pl-12 pr-12 text-lg rounded-full border-2"
							/>
							{query && (
								<button
									type="button"
									onClick={clearSearch}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									<X className="h-5 w-5" />
								</button>
							)}
						</form>
					</div>
				</div>
			</section>

			{/* Content */}
			<section className="py-8 md:py-12">
				<div className="container-wide">
					{!hasSearched ?
						<div className="max-w-2xl mx-auto">
							{/* Popular Searches */}
							<div className="mb-8">
								<h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
									<TrendingUp className="h-4 w-4 mr-2" />
									Popular Searches
								</h2>
								<div className="flex flex-wrap gap-2">
									{POPULAR_SEARCHES.map((term) => (
										<Button
											key={term}
											variant="secondary"
											size="sm"
											onClick={() => handleQuickSearch(term)}
										>
											{term}
										</Button>
									))}
								</div>
							</div>

							{/* Browse by Category */}
							{categories.length > 0 && (
								<div className="mt-12 pt-8 border-t">
									<h2 className="text-lg font-medium mb-4">
										Or browse by category
									</h2>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										{categories.map((cat) => (
											<Link
												key={cat.id}
												href={`/shop?category=${cat.slug}`}
												className="group p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors text-center"
											>
												<span className="font-medium group-hover:text-foreground/80">
													{cat.name}
												</span>
												<ArrowRight className="h-4 w-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					:	<div>
							{/* Results Header */}
							<div className="mb-6 flex items-center justify-between">
								<p className="text-muted-foreground">
									{initialResults.length}{" "}
									{initialResults.length === 1 ? "result" : "results"} for{" "}
									<strong className="text-foreground">
										&ldquo;{initialQuery}&rdquo;
									</strong>
								</p>
								{initialResults.length > 0 && (
									<Button variant="outline" asChild>
										<Link
											href={`/shop?search=${encodeURIComponent(initialQuery)}`}
										>
											View in Shop
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
								)}
							</div>

							{/* Results Grid */}
							{initialResults.length > 0 ?
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
									{initialResults.map((p, idx) => (
										<ProductCard key={p.id} product={p} priority={idx < 4} />
									))}
								</div>
							:	<div className="text-center py-16">
									<Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
									<h3 className="text-lg font-medium mb-2">No results found</h3>
									<p className="text-muted-foreground mb-6">
										No products found for &ldquo;{initialQuery}&rdquo;. Try a
										different search term.
									</p>

									<div className="mt-8 p-6 bg-secondary/30 rounded-lg max-w-lg mx-auto text-left">
										<h4 className="font-medium mb-3">Search suggestions:</h4>
										<ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
											<li>Check the spelling of your search term</li>
											<li>Try using more general keywords</li>
											<li>Browse our categories instead</li>
										</ul>
										<div className="mt-4 flex flex-wrap gap-2">
											{POPULAR_SEARCHES.slice(0, 4).map((term) => (
												<Button
													key={term}
													variant="outline"
													size="sm"
													onClick={() => handleQuickSearch(term)}
												>
													Try &ldquo;{term}&rdquo;
												</Button>
											))}
										</div>
									</div>
								</div>
							}
						</div>
					}
				</div>
			</section>
		</div>
	);
}
