"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesTable } from "./categories-table";
import { CategoryFormDialog } from "./category-form-dialog";
import type { CategoryItem, CategoryOption } from "../_lib/data";

interface Props {
	categories: CategoryItem[];
	parentOptions: CategoryOption[];
}

export function CategoriesClient({ categories, parentOptions }: Props) {
	const [showCreate, setShowCreate] = useState(false);

	return (
		<>
			<div className="flex justify-end">
				<Button onClick={() => setShowCreate(true)}>
					<Plus className="h-4 w-4 mr-2" />
					Add Category
				</Button>
			</div>

			<Card>
				<CardContent className="pt-6">
					<CategoriesTable
						categories={categories}
						parentOptions={parentOptions}
					/>
				</CardContent>
			</Card>

			<CategoryFormDialog
				open={showCreate}
				onOpenChange={setShowCreate}
				parentOptions={parentOptions}
			/>
		</>
	);
}
