"use server";

import { db } from "@/database";
import { product, productVariant } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const variantSchema = z.object({
	size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
	stock: z.coerce.number().int().min(0),
	sku: z.string().min(1),
});

const productSchema = z.object({
	name: z.string().min(2),
	description: z.string().optional(),
	shortDescription: z.string().optional(),
	price: z.coerce.number().min(0),
	comparePrice: z.coerce.number().optional(),
	categoryId: z.string().min(1),
	collectionId: z.string().optional(),
	tags: z.array(z.string()).default([]),
	gender: z.enum(["men", "women", "unisex"]),
	isActive: z.boolean().default(true),
	isFeatured: z.boolean().default(false),
	variants: z.array(variantSchema).min(1),
});

type Result<T = void> =
	| { success: true; data?: T }
	| { success: false; error: string };

function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export async function createProduct(
	input: z.infer<typeof productSchema>,
): Promise<Result<{ id: string }>> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user || session.user.role !== "admin")
			return { success: false, error: "Unauthorized" };

		const data = productSchema.parse(input);
		const id = nanoid();
		const slug = `${slugify(data.name)}-${nanoid(6)}`;
		const totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);

		await db.transaction(async (tx) => {
			await tx.insert(product).values({
				id,
				name: data.name,
				slug,
				description: data.description || null,
				shortDescription: data.shortDescription || null,
				price: data.price.toString(),
				comparePrice: data.comparePrice?.toString() || null,
				categoryId: data.categoryId,
				collectionId: data.collectionId || null,
				tags: data.tags,
				gender: data.gender,
				totalStock,
				isActive: data.isActive,
				isFeatured: data.isFeatured,
			});

			for (const variant of data.variants) {
				await tx.insert(productVariant).values({
					id: nanoid(),
					productId: id,
					size: variant.size,
					stock: variant.stock,
					sku: variant.sku,
				});
			}
		});

		revalidatePath("/admin/products");
		revalidatePath("/admin");
		return { success: true, data: { id } };
	} catch (error) {
		console.error("Create product error:", error);
		return { success: false, error: "Failed to create product" };
	}
}

export async function updateProduct(
	id: string,
	input: z.infer<typeof productSchema>,
): Promise<Result> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user || session.user.role !== "admin")
			return { success: false, error: "Unauthorized" };

		const data = productSchema.parse(input);
		const totalStock = data.variants.reduce((sum, v) => sum + v.stock, 0);

		await db.transaction(async (tx) => {
			await tx
				.update(product)
				.set({
					name: data.name,
					description: data.description || null,
					shortDescription: data.shortDescription || null,
					price: data.price.toString(),
					comparePrice: data.comparePrice?.toString() || null,
					categoryId: data.categoryId,
					collectionId: data.collectionId || null,
					tags: data.tags,
					gender: data.gender,
					totalStock,
					isActive: data.isActive,
					isFeatured: data.isFeatured,
					updatedAt: new Date(),
				})
				.where(eq(product.id, id));

			// Replace variants
			await tx.delete(productVariant).where(eq(productVariant.productId, id));
			for (const variant of data.variants) {
				await tx.insert(productVariant).values({
					id: nanoid(),
					productId: id,
					size: variant.size,
					stock: variant.stock,
					sku: variant.sku,
				});
			}
		});

		revalidatePath("/admin/products");
		revalidatePath(`/admin/products/${id}/edit`);
		revalidatePath("/admin");
		return { success: true };
	} catch (error) {
		console.error("Update product error:", error);
		return { success: false, error: "Failed to update product" };
	}
}

export async function toggleProductActive(
	id: string,
	isActive: boolean,
): Promise<Result> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user || session.user.role !== "admin")
			return { success: false, error: "Unauthorized" };

		await db
			.update(product)
			.set({ isActive, updatedAt: new Date() })
			.where(eq(product.id, id));

		revalidatePath("/admin/products");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to update product" };
	}
}
