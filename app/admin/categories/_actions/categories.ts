"use server";

import { db } from "@/database";
import { category } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { z } from "zod";

const categorySchema = z.object({
	name: z.string().min(2),
	slug: z.string().min(2),
	description: z.string().optional(),
	parentCategoryId: z.string().optional(),
	level: z.coerce.number().int().min(0).default(0),
	sortOrder: z.coerce.number().int().min(0).default(0),
	isActive: z.boolean().default(true),
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

export async function createCategory(
	input: z.infer<typeof categorySchema>,
): Promise<Result<{ id: string }>> {
	try {
		await requireAdmin();
		const data = categorySchema.parse(input);

		const id = nanoid();
		await db.insert(category).values({
			id,
			name: data.name,
			slug: data.slug || slugify(data.name),
			description: data.description || null,
			parentCategoryId: data.parentCategoryId || null,
			level: data.parentCategoryId ? data.level : 0,
			sortOrder: data.sortOrder,
			isActive: data.isActive,
		});

		revalidatePath("/admin/categories");
		return { success: true, data: { id } };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to create category",
		};
	}
}

export async function updateCategory(
	id: string,
	input: z.infer<typeof categorySchema>,
): Promise<Result> {
	try {
		await requireAdmin();
		const data = categorySchema.parse(input);

		await db
			.update(category)
			.set({
				name: data.name,
				slug: data.slug,
				description: data.description || null,
				parentCategoryId: data.parentCategoryId || null,
				level: data.parentCategoryId ? data.level : 0,
				sortOrder: data.sortOrder,
				isActive: data.isActive,
				updatedAt: new Date(),
			})
			.where(eq(category.id, id));

		revalidatePath("/admin/categories");
		return { success: true };
	} catch (error: any) {
		return {
			success: false,
			error: error.message || "Failed to update category",
		};
	}
}

export async function toggleCategoryActive(
	id: string,
	isActive: boolean,
): Promise<Result> {
	try {
		await requireAdmin();
		await db
			.update(category)
			.set({ isActive, updatedAt: new Date() })
			.where(eq(category.id, id));
		revalidatePath("/admin/categories");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to update category" };
	}
}

export async function deleteCategory(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db.delete(category).where(eq(category.id, id));
		revalidatePath("/admin/categories");
		return { success: true };
	} catch {
		return {
			success: false,
			error:
				"Failed to delete category. It may have products or subcategories.",
		};
	}
}
