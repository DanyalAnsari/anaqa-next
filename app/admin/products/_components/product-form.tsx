"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { createProduct, updateProduct } from "../_actions/products";
import type { ProductDetail } from "../_lib/data";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const GENDERS = ["men", "women", "unisex"] as const;

const variantSchema = z.object({
	size: z.enum(SIZES),
	stock: z.coerce.number().int().min(0),
	sku: z.string().min(1, "SKU is required"),
});

const formSchema = z.object({
	name: z.string().min(2),
	description: z.string().optional(),
	shortDescription: z.string().optional(),
	price: z.coerce.number().min(0),
	comparePrice: z.coerce.number().optional(),
	categoryId: z.string().min(1, "Category is required"),
	collectionId: z.string().optional(),
	tags: z.string().optional(),
	gender: z.enum(GENDERS),
	isActive: z.boolean().default(true),
	isFeatured: z.boolean().default(false),
	variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
	product?: ProductDetail | null;
	categories: { id: string; name: string; slug: string }[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
	const router = useRouter();
	const isEditing = !!product;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues:
			product ?
				{
					name: product.name,
					description: product.description ?? "",
					shortDescription: product.shortDescription ?? "",
					price: product.price,
					comparePrice: product.comparePrice ?? undefined,
					categoryId: product.categoryId,
					collectionId: product.collectionId ?? "",
					tags: product.tags.join(", "),
					gender: product.gender as (typeof GENDERS)[number],
					isActive: product.isActive,
					isFeatured: product.isFeatured,
					variants: product.variants.map((v) => ({
						size: v.size as (typeof SIZES)[number],
						stock: v.stock,
						sku: v.sku,
					})),
				}
			:	{
					name: "",
					description: "",
					shortDescription: "",
					price: 0,
					categoryId: "",
					tags: "",
					gender: "women",
					isActive: true,
					isFeatured: false,
					variants: [{ size: "M" as const, stock: 0, sku: "" }],
				},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "variants",
	});
	const { errors, isSubmitting } = form.formState;

	async function onSubmit(values: FormValues) {
		const payload = {
			...values,
			tags:
				values.tags
					?.split(",")
					.map((t) => t.trim())
					.filter(Boolean) ?? [],
			comparePrice: values.comparePrice || undefined,
			collectionId: values.collectionId || undefined,
		};

		const result =
			isEditing ?
				await updateProduct(product!.id, payload)
			:	await createProduct(payload);

		if (result.success) {
			toast.success(isEditing ? "Product updated" : "Product created");
			router.push("/admin/products");
		} else {
			toast.error(result.error);
		}
	}

	return (
		<div className="max-w-4xl space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push("/admin/products")}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h1 className="text-2xl font-semibold">
						{isEditing ? "Edit Product" : "New Product"}
					</h1>
					<p className="text-sm text-muted-foreground">
						{isEditing ?
							"Update product details."
						:	"Fill in the details to create a new product."}
					</p>
				</div>
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Basic Info */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label>Name *</Label>
							<Input {...form.register("name")} placeholder="Product name" />
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label>Short Description</Label>
							<Input
								{...form.register("shortDescription")}
								placeholder="Brief tagline"
							/>
						</div>
						<div className="space-y-2">
							<Label>Description</Label>
							<Textarea
								{...form.register("description")}
								placeholder="Full product description..."
								rows={4}
							/>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label>Category *</Label>
								<Select
									value={form.watch("categoryId")}
									onValueChange={(v) => form.setValue("categoryId", v)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select..." />
									</SelectTrigger>
									<SelectContent>
										{categories.map((c) => (
											<SelectItem key={c.id} value={c.id}>
												{c.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.categoryId && (
									<p className="text-sm text-destructive">
										{errors.categoryId.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label>Gender *</Label>
								<Select
									value={form.watch("gender")}
									onValueChange={(v) =>
										form.setValue("gender", v as (typeof GENDERS)[number])
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{GENDERS.map((g) => (
											<SelectItem key={g} value={g} className="capitalize">
												{g}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Tags (comma-separated)</Label>
								<Input
									{...form.register("tags")}
									placeholder="modest, summer"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Price (SAR) *</Label>
								<Input type="number" step="0.01" {...form.register("price")} />
								{errors.price && (
									<p className="text-sm text-destructive">
										{errors.price.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<Label>Compare Price (SAR)</Label>
								<Input
									type="number"
									step="0.01"
									{...form.register("comparePrice")}
									placeholder="Original price"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Toggles */}
				<Card>
					<CardContent className="p-6 flex flex-col sm:flex-row gap-6">
						<div className="flex items-center justify-between gap-4 flex-1 p-4 rounded-lg border">
							<div>
								<p className="font-medium">Active</p>
								<p className="text-xs text-muted-foreground">
									Visible in storefront
								</p>
							</div>
							<Switch
								checked={form.watch("isActive")}
								onCheckedChange={(v) => form.setValue("isActive", v)}
							/>
						</div>
						<div className="flex items-center justify-between gap-4 flex-1 p-4 rounded-lg border">
							<div>
								<p className="font-medium">Featured</p>
								<p className="text-xs text-muted-foreground">
									Show on homepage
								</p>
							</div>
							<Switch
								checked={form.watch("isFeatured")}
								onCheckedChange={(v) => form.setValue("isFeatured", v)}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Variants */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-base">Variants</CardTitle>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => append({ size: "M", stock: 0, sku: "" })}
						>
							<Plus className="h-3 w-3 mr-1" /> Add Variant
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{errors.variants?.root && (
							<p className="text-sm text-destructive">
								{errors.variants.root.message}
							</p>
						)}
						{fields.map((field, idx) => (
							<div key={field.id} className="p-4 rounded-lg border space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-muted-foreground">
										Variant {idx + 1}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-7 w-7 text-destructive"
										onClick={() => remove(idx)}
										disabled={fields.length === 1}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>
								<div className="grid grid-cols-3 gap-3">
									<div className="space-y-1">
										<Label className="text-xs">Size *</Label>
										<Select
											value={form.watch(`variants.${idx}.size`)}
											onValueChange={(v) =>
												form.setValue(
													`variants.${idx}.size`,
													v as (typeof SIZES)[number],
												)
											}
										>
											<SelectTrigger className="h-8">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{SIZES.map((s) => (
													<SelectItem key={s} value={s}>
														{s}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-1">
										<Label className="text-xs">SKU *</Label>
										<Input
											{...form.register(`variants.${idx}.sku`)}
											className="h-8 text-sm"
											placeholder="SKU-001"
										/>
										{errors.variants?.[idx]?.sku && (
											<p className="text-xs text-destructive">
												{errors.variants[idx]?.sku?.message}
											</p>
										)}
									</div>
									<div className="space-y-1">
										<Label className="text-xs">Stock *</Label>
										<Input
											type="number"
											{...form.register(`variants.${idx}.stock`)}
											className="h-8 text-sm"
											placeholder="0"
										/>
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				<Separator />
				<div className="flex justify-end gap-3 pb-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/admin/products")}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isEditing ? "Update Product" : "Create Product"}
					</Button>
				</div>
			</form>
		</div>
	);
}
