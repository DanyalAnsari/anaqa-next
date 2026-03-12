"use server";

import { db } from "@/database";
import { collection } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const collectionSchema = z.object({
	name: z.string().min(2),
	slug: z.string().min(2),
	description: z.string().optional(),
	isActive: z.boolean().default(true),
	isFeatured: z.boolean().default(false),
});

type Result<T = void> =
	| { success: true; data?: T }
	| { success: false; error: string };

async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user || session.user.role !== "admin")
		throw new Error("Unauthorized");
}

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export async function createCollection(
	formData: FormData,
): Promise<Result<{ id: string }>> {
	try {
		await requireAdmin();

		const name = formData.get("name") as string;
		const slug = (formData.get("slug") as string) || slugify(name);
		const description = formData.get("description") as string;
		const isActive = formData.get("isActive") === "true";
		const isFeatured = formData.get("isFeatured") === "true";
		const file = formData.get("image") as File;

		if (!name || name.length < 2)
			return { success: false, error: "Name is required" };
		if (!file || file.size === 0)
			return { success: false, error: "Image is required" };

		const buffer = Buffer.from(await file.arrayBuffer());
		const { imageKitService } = await import("@/services/imagekit.service");
		const upload = await imageKitService.uploadCategoryImage(
			buffer,
			file.name,
			nanoid(),
		);

		const id = nanoid();
		await db.insert(collection).values({
			id,
			name,
			slug,
			description: description || null,
			imageFileId: upload.fileId,
			imageFilePath: upload.filePath,
			isActive,
			isFeatured,
		});

		revalidatePath("/admin/collections");
		return { success: true, data: { id } };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to create collection",
		};
	}
}

export async function updateCollection(
	id: string,
	formData: FormData,
): Promise<Result> {
	try {
		await requireAdmin();

		const name = formData.get("name") as string;
		const slug = formData.get("slug") as string;
		const description = formData.get("description") as string;
		const isActive = formData.get("isActive") === "true";
		const isFeatured = formData.get("isFeatured") === "true";
		const file = formData.get("image") as File | null;

		const updates: Record<string, any> = {
			name,
			slug,
			description: description || null,
			isActive,
			isFeatured,
			updatedAt: new Date(),
		};

		if (file && file.size > 0) {
			const [existing] = await db
				.select({ imageFileId: collection.imageFileId })
				.from(collection)
				.where(eq(collection.id, id));

			const buffer = Buffer.from(await file.arrayBuffer());
			const { imageKitService } = await import("@/services/imagekit.service");

			if (existing?.imageFileId) {
				await imageKitService
					.deleteImage(existing.imageFileId)
					.catch(console.warn);
			}

			const upload = await imageKitService.uploadCategoryImage(
				buffer,
				file.name,
				id,
			);
			updates.imageFileId = upload.fileId;
			updates.imageFilePath = upload.filePath;
		}

		await db.update(collection).set(updates).where(eq(collection.id, id));

		revalidatePath("/admin/collections");
		return { success: true };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to update collection",
		};
	}
}

export async function deleteCollection(id: string): Promise<Result> {
	try {
		await requireAdmin();

		const [existing] = await db
			.select({ imageFileId: collection.imageFileId })
			.from(collection)
			.where(eq(collection.id, id));

		if (existing?.imageFileId) {
			const { imageKitService } = await import("@/services/imagekit.service");
			await imageKitService
				.deleteImage(existing.imageFileId)
				.catch(console.warn);
		}

		await db.delete(collection).where(eq(collection.id, id));
		revalidatePath("/admin/collections");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to delete collection" };
	}
}

export async function toggleCollectionActive(
	id: string,
	isActive: boolean,
): Promise<Result> {
	try {
		await requireAdmin();
		await db
			.update(collection)
			.set({ isActive, updatedAt: new Date() })
			.where(eq(collection.id, id));
		revalidatePath("/admin/collections");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to update collection" };
	}
}
