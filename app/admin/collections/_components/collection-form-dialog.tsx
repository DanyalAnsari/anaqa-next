"use client";

import { useState, useRef } from "react";
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
import { Loader2, Upload, ImageIcon } from "lucide-react";
import { createCollection, updateCollection } from "../_actions/collections";
import type { CollectionItem } from "../_lib/data";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	collection?: CollectionItem | null;
}

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export function CollectionFormDialog({
	open,
	onOpenChange,
	collection,
}: Props) {
	const router = useRouter();
	const isEditing = !!collection;
	const fileRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);

	const [name, setName] = useState(collection?.name ?? "");
	const [slug, setSlug] = useState(collection?.slug ?? "");
	const [description, setDescription] = useState(collection?.description ?? "");
	const [isActive, setIsActive] = useState(collection?.isActive ?? true);
	const [isFeatured, setIsFeatured] = useState(collection?.isFeatured ?? false);
	const [preview, setPreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	function handleNameChange(value: string) {
		setName(value);
		if (!isEditing) setSlug(slugify(value));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0];
		if (!f) return;
		setFile(f);
		if (preview) URL.revokeObjectURL(preview);
		setPreview(URL.createObjectURL(f));
	}

	async function handleSubmit() {
		if (!name.trim()) {
			toast.error("Name is required");
			return;
		}
		if (!isEditing && !file) {
			toast.error("Image is required");
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append("name", name);
		formData.append("slug", slug || slugify(name));
		formData.append("description", description);
		formData.append("isActive", String(isActive));
		formData.append("isFeatured", String(isFeatured));
		if (file) formData.append("image", file);

		try {
			const result =
				isEditing ?
					await updateCollection(collection!.id, formData)
				:	await createCollection(formData);

			if (result.success) {
				toast.success(isEditing ? "Collection updated" : "Collection created");
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Collection" : "New Collection"}
					</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Name *</Label>
						<Input
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="Collection name"
						/>
					</div>
					<div className="space-y-2">
						<Label>Slug</Label>
						<Input value={slug} onChange={(e) => setSlug(e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label>Description</Label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
						/>
					</div>

					{/* Image Upload */}
					<div className="space-y-2">
						<Label>Image {!isEditing && "*"}</Label>
						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
						<div
							className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
							onClick={() => fileRef.current?.click()}
						>
							{preview || (isEditing && collection?.imageFilePath) ?
								<img
									src={
										preview ||
										`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:w-400,h-200,c-at_max/${collection?.imageFilePath}`
									}
									alt="Preview"
									className="max-h-32 mx-auto rounded-md object-contain"
								/>
							:	<div className="flex flex-col items-center gap-2 text-muted-foreground">
									<ImageIcon className="h-8 w-8" />
									<p className="text-sm">Click to upload image</p>
								</div>
							}
						</div>
					</div>

					<div className="flex gap-4">
						<div className="flex items-center justify-between gap-4 flex-1 p-3 rounded-lg border">
							<Label className="text-sm">Active</Label>
							<Switch checked={isActive} onCheckedChange={setIsActive} />
						</div>
						<div className="flex items-center justify-between gap-4 flex-1 p-3 rounded-lg border">
							<Label className="text-sm">Featured</Label>
							<Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
						</div>
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
					<Button onClick={handleSubmit} disabled={loading}>
						{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
						{isEditing ? "Update" : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
