"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createCategory, updateCategory } from "../_actions/categories";
import type { CategoryItem, CategoryOption } from "../_lib/data";

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: CategoryItem | null;
	parentOptions: CategoryOption[];
}

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export function CategoryFormDialog({
	open,
	onOpenChange,
	category,
	parentOptions,
}: CategoryFormDialogProps) {
	const router = useRouter();
	const isEditing = !!category;
	const [loading, setLoading] = useState(false);

	const [name, setName] = useState(category?.name ?? "");
	const [slug, setSlug] = useState(category?.slug ?? "");
	const [description, setDescription] = useState(category?.description ?? "");
	const [parentId, setParentId] = useState(
		category?.parentCategoryId ?? "none",
	);
	const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
	const [isActive, setIsActive] = useState(category?.isActive ?? true);

	async function handleSubmit() {
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}

		setLoading(true);
		const parent = parentOptions.find((p) => p.id === parentId);

		const payload = {
			name,
			slug: slug || slugify(name),
			description: description || undefined,
			parentCategoryId: parentId === "none" ? undefined : parentId,
			level: parent ? parent.level + 1 : 0,
			sortOrder,
			isActive,
		};

		try {
			const result =
				isEditing ?
					await updateCategory(category!.id, payload)
				:	await createCategory(payload);

			if (result.success) {
				toast.success(isEditing ? "Category updated" : "Category created");
				onOpenChange(false);
				router.refresh();
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	// Auto-generate slug from name
	function handleNameChange(value: string) {
		setName(value);
		if (!isEditing) setSlug(slugify(value));
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Category" : "New Category"}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Name *</Label>
						<Input
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="Category name"
						/>
					</div>
					<div className="space-y-2">
						<Label>Slug</Label>
						<Input
							value={slug}
							onChange={(e) => setSlug(e.target.value)}
							placeholder="auto-generated"
						/>
					</div>
					<div className="space-y-2">
						<Label>Description</Label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Optional description"
							rows={3}
						/>
					</div>
					<div className="space-y-2">
						<Label>Parent Category</Label>
						<Select value={parentId} onValueChange={setParentId}>
							<SelectTrigger>
								<SelectValue placeholder="None (top level)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None (top level)</SelectItem>
								{parentOptions
									.filter((p) => p.id !== category?.id)
									.map((p) => (
										<SelectItem key={p.id} value={p.id}>
											{"—".repeat(p.level)} {p.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Sort Order</Label>
						<Input
							type="number"
							value={sortOrder}
							onChange={(e) => setSortOrder(Number(e.target.value))}
						/>
					</div>
					<div className="flex items-center justify-between p-3 rounded-lg border">
						<Label>Active</Label>
						<Switch checked={isActive} onCheckedChange={setIsActive} />
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={loading || !name.trim()}>
						{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
						{isEditing ? "Update" : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
