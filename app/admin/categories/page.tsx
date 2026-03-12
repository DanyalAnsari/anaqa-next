import { Card, CardContent } from "@/components/ui/card";
import { getCategories, getCategoryOptions } from "./_lib/data";
import { CategoriesClient } from "./_components/categories-client";

export default async function CategoriesPage() {
	const [categories, parentOptions] = await Promise.all([
		getCategories(),
		getCategoryOptions(),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Categories</h1>
				<p className="text-muted-foreground text-sm">
					Manage product categories and hierarchy.
				</p>
			</div>
			<CategoriesClient categories={categories} parentOptions={parentOptions} />
		</div>
	);
}
