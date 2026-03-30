"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { ProductFilters } from "./product-filters";

interface MobileFiltersProps {
	categories: { id: string; name: string; slug: string }[];
	sizes: string[];
	currentParams: Record<string, string | undefined>;
	onParamChange: (updates: Record<string, string | undefined>) => void;
	onClearAll: () => void;
	activeFilterCount: number;
}

export function MobileFilters({
	categories,
	sizes,
	currentParams,
	onParamChange,
	onClearAll,
	activeFilterCount,
}: MobileFiltersProps) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="outline" className="lg:hidden">
					<SlidersHorizontal className="h-4 w-4 mr-2" />
					Filters
					{activeFilterCount > 0 && (
						<span className="ml-2 px-2 py-0.5 bg-foreground text-background rounded-full text-xs">
							{activeFilterCount}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Filters</SheetTitle>
				</SheetHeader>
				<div className="py-6">
					<ProductFilters
						categories={categories}
						sizes={sizes}
						currentParams={currentParams}
						onParamChange={(updates) => {
							onParamChange(updates);
						}}
						onClearAll={onClearAll}
					/>
				</div>
				<SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
					<Button onClick={() => setOpen(false)} className="w-full">
						View Results
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
