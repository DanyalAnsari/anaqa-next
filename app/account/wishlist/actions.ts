// app/account/wishlist/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/database";
import { wishlist } from "@/database/schemas";

type ActionResult = { success: true } | { success: false; error: string };

export async function removeFromWishlist(
	productId: string,
): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		await db
			.delete(wishlist)
			.where(
				and(
					eq(wishlist.userId, session.user.id),
					eq(wishlist.productId, productId),
				),
			);

		revalidatePath("/account/wishlist");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Remove from wishlist error:", error);
		return {
			success: false,
			error:
				error instanceof Error ?
					error.message
				:	"Failed to remove from wishlist",
		};
	}
}

export async function clearWishlist(): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		await db.delete(wishlist).where(eq(wishlist.userId, session.user.id));

		revalidatePath("/account/wishlist");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Clear wishlist error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to clear wishlist",
		};
	}
}
