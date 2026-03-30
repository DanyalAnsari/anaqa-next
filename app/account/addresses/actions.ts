"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { addressSchema, type AddressInput } from "@/lib/validations";
import { db } from "@/database";
import { address } from "@/database/schemas";

type ActionResult<T = void> =
	| { success: true; data?: T }
	| { success: false; error: string };

async function getAuthenticatedUserId(): Promise<string> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}
	return session.user.id;
}

export async function createAddress(
	input: AddressInput,
): Promise<ActionResult<{ id: string }>> {
	try {
		const userId = await getAuthenticatedUserId();
		const parsed = addressSchema.safeParse(input);

		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.errors[0]?.message ?? "Invalid input",
			};
		}

		const data = parsed.data;
		const id = nanoid();

		// If setting as default, unset any existing default first
		if (data.isDefault) {
			await db
				.update(address)
				.set({ isDefault: false, updatedAt: new Date() })
				.where(and(eq(address.userId, userId), eq(address.isDefault, true)));
		}

		// Check if this is the first address — auto-set as default
		const existingAddresses = await db
			.select({ id: address.id })
			.from(address)
			.where(eq(address.userId, userId))
			.limit(1);

		const isFirstAddress = existingAddresses.length === 0;

		await db.insert(address).values({
			id,
			userId,
			label: data.label,
			fullName: data.fullName,
			phone: data.phone,
			street: data.street,
			city: data.city,
			state: data.state,
			postalCode: data.postalCode,
			country: data.country,
			isDefault: isFirstAddress || data.isDefault,
		});

		revalidatePath("/account/addresses");
		revalidatePath("/account");

		return { success: true, data: { id } };
	} catch (error) {
		console.error("Create address error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to create address",
		};
	}
}

export async function updateAddress(
	addressId: string,
	input: AddressInput,
): Promise<ActionResult> {
	try {
		const userId = await getAuthenticatedUserId();
		const parsed = addressSchema.safeParse(input);

		if (!parsed.success) {
			return {
				success: false,
				error: parsed.error.errors[0]?.message ?? "Invalid input",
			};
		}

		const data = parsed.data;

		// Verify ownership
		const existing = await db
			.select({ id: address.id })
			.from(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)))
			.limit(1);

		if (existing.length === 0) {
			return { success: false, error: "Address not found" };
		}

		// If setting as default, unset others
		if (data.isDefault) {
			await db
				.update(address)
				.set({ isDefault: false, updatedAt: new Date() })
				.where(
					and(
						eq(address.userId, userId),
						eq(address.isDefault, true),
						ne(address.id, addressId),
					),
				);
		}

		await db
			.update(address)
			.set({
				label: data.label,
				fullName: data.fullName,
				phone: data.phone,
				street: data.street,
				city: data.city,
				state: data.state,
				postalCode: data.postalCode,
				country: data.country,
				isDefault: data.isDefault,
				updatedAt: new Date(),
			})
			.where(and(eq(address.id, addressId), eq(address.userId, userId)));

		revalidatePath("/account/addresses");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Update address error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to update address",
		};
	}
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
	try {
		const userId = await getAuthenticatedUserId();

		// Verify ownership and check if it's default
		const existing = await db
			.select({ id: address.id, isDefault: address.isDefault })
			.from(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)))
			.limit(1);

		if (existing.length === 0) {
			return { success: false, error: "Address not found" };
		}

		await db
			.delete(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)));

		// If deleted address was default, set another one as default
		if (existing[0].isDefault) {
			const remaining = await db
				.select({ id: address.id })
				.from(address)
				.where(eq(address.userId, userId))
				.limit(1);

			if (remaining.length > 0) {
				await db
					.update(address)
					.set({ isDefault: true, updatedAt: new Date() })
					.where(eq(address.id, remaining[0].id));
			}
		}

		revalidatePath("/account/addresses");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Delete address error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to delete address",
		};
	}
}

export async function setDefaultAddress(
	addressId: string,
): Promise<ActionResult> {
	try {
		const userId = await getAuthenticatedUserId();

		// Verify ownership
		const existing = await db
			.select({ id: address.id })
			.from(address)
			.where(and(eq(address.id, addressId), eq(address.userId, userId)))
			.limit(1);

		if (existing.length === 0) {
			return { success: false, error: "Address not found" };
		}

		// Unset all defaults
		await db
			.update(address)
			.set({ isDefault: false, updatedAt: new Date() })
			.where(and(eq(address.userId, userId), eq(address.isDefault, true)));

		// Set the new default
		await db
			.update(address)
			.set({ isDefault: true, updatedAt: new Date() })
			.where(eq(address.id, addressId));

		revalidatePath("/account/addresses");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Set default address error:", error);
		return {
			success: false,
			error:
				error instanceof Error ?
					error.message
				:	"Failed to set default address",
		};
	}
}
