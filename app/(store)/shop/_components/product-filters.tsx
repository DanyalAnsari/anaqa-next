"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface CurrentParams {
	category?: string;
	search?: string;
	sort?: string;
	minPrice?: string;
	maxPrice?: string;
	sizes?: string;
	inStock?: string;
	onSale?: string;
	gender?: string;
}

interface ProductFiltersProps {
	categories: Category[];
	sizes: string[];
	currentParams: CurrentParams;
	onParamChange: (updates: Record<string, string | undefined>) => void;
	onClearAll: () => void;
	className?: string;
}

export function ProductFilters({
	categories,
	sizes,
	currentParams,
	onParamChange,
	onClearAll,
	className,
}: ProductFiltersProps) {
	const selectedSizes = currentParams.sizes?.split(",").filter(Boolean) ?? [];
	const minPrice =
		currentParams.minPrice ? parseFloat(currentParams.minPrice) : 0;
	const maxPrice =
		currentParams.maxPrice ? parseFloat(currentParams.maxPrice) : 500;

	const [priceRange, setPriceRange] = useState<[number, number]>([
		minPrice,
		maxPrice,
	]);

	useEffect(() => {
		setPriceRange([minPrice, maxPrice]);
	}, [minPrice, maxPrice]);

	const handlePriceCommit = (value: number[]) => {
		onParamChange({
			minPrice: value[0] > 0 ? String(value[0]) : undefined,
			maxPrice: value[1] < 500 ? String(value[1]) : undefined,
		});
	};

	const toggleSize = (size: string) => {
		const updated =
			selectedSizes.includes(size) ?
				selectedSizes.filter((s) => s !== size)
			:	[...selectedSizes, size];
		onParamChange({
			sizes: updated.length > 0 ? updated.join(",") : undefined,
		});
	};

	const hasActiveFilters =
		currentParams.category ||
		currentParams.minPrice ||
		currentParams.maxPrice ||
		currentParams.sizes ||
		currentParams.inStock ||
		currentParams.onSale ||
		currentParams.gender;

	const activeFilterCount = [
		currentParams.category,
		currentParams.minPrice || currentParams.maxPrice,
		currentParams.sizes,
		currentParams.inStock,
		currentParams.onSale,
		currentParams.gender,
	].filter(Boolean).length;

	return (
		<div className={cn("space-y-6", className)}>
			{/* Active Filters */}
			{hasActiveFilters && (
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">
							Active ({activeFilterCount})
						</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearAll}
							className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
						>
							Clear All
						</Button>
					</div>
					<div className="flex flex-wrap gap-2">
						{currentParams.category && (
							<Badge variant="secondary" className="gap-1 text-xs">
								{categories.find((c) => c.slug === currentParams.category)
									?.name || currentParams.category}
								<button onClick={() => onParamChange({ category: undefined })}>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{currentParams.gender && (
							<Badge variant="secondary" className="gap-1 text-xs capitalize">
								{currentParams.gender}
								<button onClick={() => onParamChange({ gender: undefined })}>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{(currentParams.minPrice || currentParams.maxPrice) && (
							<Badge variant="secondary" className="gap-1 text-xs">
								{currentParams.minPrice || 0}–{currentParams.maxPrice || "500+"}{" "}
								SAR
								<button
									onClick={() =>
										onParamChange({
											minPrice: undefined,
											maxPrice: undefined,
										})
									}
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{selectedSizes.map((size) => (
							<Badge key={size} variant="secondary" className="gap-1 text-xs">
								{size}
								<button onClick={() => toggleSize(size)}>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
						{currentParams.inStock && (
							<Badge variant="secondary" className="gap-1 text-xs">
								In Stock
								<button onClick={() => onParamChange({ inStock: undefined })}>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
						{currentParams.onSale && (
							<Badge variant="secondary" className="gap-1 text-xs">
								On Sale
								<button onClick={() => onParamChange({ onSale: undefined })}>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						)}
					</div>
					<Separator />
				</div>
			)}

			<Accordion
				type="multiple"
				defaultValue={["category", "gender", "price", "sizes", "availability"]}
				className="w-full"
			>
				{/* Categories */}
				<AccordionItem value="category">
					<AccordionTrigger className="text-sm font-medium">
						Category
					</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-3 pt-1">
							{categories.map((cat) => (
								<button
									key={cat.id}
									onClick={() =>
										onParamChange({
											category:
												currentParams.category === cat.slug ?
													undefined
												:	cat.slug,
										})
									}
									className={cn(
										"block text-sm transition-colors",
										currentParams.category === cat.slug ?
											"font-medium text-foreground"
										:	"text-muted-foreground hover:text-foreground",
									)}
								>
									{cat.name}
								</button>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Gender */}
				<AccordionItem value="gender">
					<AccordionTrigger className="text-sm font-medium">
						Gender
					</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-3 pt-1">
							{(["women", "men", "unisex"] as const).map((g) => (
								<button
									key={g}
									onClick={() =>
										onParamChange({
											gender: currentParams.gender === g ? undefined : g,
										})
									}
									className={cn(
										"block text-sm capitalize transition-colors",
										currentParams.gender === g ?
											"font-medium text-foreground"
										:	"text-muted-foreground hover:text-foreground",
									)}
								>
									{g}
								</button>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Price Range */}
				<AccordionItem value="price">
					<AccordionTrigger className="text-sm font-medium">
						Price Range
					</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-4 pt-1">
							<Slider
								value={priceRange}
								min={0}
								max={500}
								step={10}
								onValueChange={(v) => setPriceRange([v[0], v[1]])}
								onValueCommit={handlePriceCommit}
								className="w-full"
							/>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">
									{priceRange[0]} SAR
								</span>
								<span className="text-muted-foreground">
									{priceRange[1]}
									{priceRange[1] >= 500 ? "+" : ""} SAR
								</span>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Sizes */}
				<AccordionItem value="sizes">
					<AccordionTrigger className="text-sm font-medium">
						Sizes
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-wrap gap-2 pt-1">
							{sizes.map((size) => (
								<button
									key={size}
									onClick={() => toggleSize(size)}
									className={cn(
										"px-3 py-1.5 text-sm border rounded-md transition-colors",
										selectedSizes.includes(size) ?
											"border-foreground bg-foreground text-background"
										:	"border-border hover:border-foreground",
									)}
								>
									{size}
								</button>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Availability */}
				<AccordionItem value="availability">
					<AccordionTrigger className="text-sm font-medium">
						Availability
					</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-3 pt-1">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="inStock"
									checked={currentParams.inStock === "true"}
									onCheckedChange={(checked) =>
										onParamChange({
											inStock: checked ? "true" : undefined,
										})
									}
								/>
								<Label htmlFor="inStock" className="text-sm cursor-pointer">
									In Stock Only
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="onSale"
									checked={currentParams.onSale === "true"}
									onCheckedChange={(checked) =>
										onParamChange({
											onSale: checked ? "true" : undefined,
										})
									}
								/>
								<Label htmlFor="onSale" className="text-sm cursor-pointer">
									On Sale
								</Label>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
