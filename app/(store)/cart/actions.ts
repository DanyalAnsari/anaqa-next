"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database";
import { cart, cartItem, product } from "@/database/schemas";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

type ActionResult = { success: true } | { success: false; error: string };

async function getAuthUserId(): Promise<string> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) throw new Error("Unauthorized");
	return session.user.id;
}

async function getUserCart(userId: string) {
	const [userCart] = await db
		.select({ id: cart.id })
		.from(cart)
		.where(eq(cart.userId, userId))
		.limit(1);
	return userCart;
}

export async function addToCart(
	productId: string,
	size: string,
	quantity: number,
): Promise<ActionResult> {
	try {
		const userId = await getAuthUserId();

		// Get or create cart
		let userCart = await getUserCart(userId);
		if (!userCart) {
			const cartId = nanoid();
			await db.insert(cart).values({ id: cartId, userId });
			userCart = { id: cartId };
		}

		// Check if item already exists
		const [existing] = await db
			.select({ id: cartItem.id, quantity: cartItem.quantity })
			.from(cartItem)
			.where(
				and(
					eq(cartItem.cartId, userCart.id),
					eq(cartItem.productId, productId),
					eq(cartItem.size, size as any),
				),
			)
			.limit(1);

		if (existing) {
			await db
				.update(cartItem)
				.set({ quantity: existing.quantity + quantity })
				.where(eq(cartItem.id, existing.id));
		} else {
			const [prod] = await db
				.select({ price: product.price })
				.from(product)
				.where(eq(product.id, productId))
				.limit(1);

			if (!prod) return { success: false, error: "Product not found" };

			await db.insert(cartItem).values({
				id: nanoid(),
				cartId: userCart.id,
				productId,
				size: size as any,
				quantity,
				price: prod.price,
			});
		}

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		console.error("Add to cart error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to add to cart",
		};
	}
}

export async function updateCartItemQuantity(
	cartItemId: string,
	quantity: number,
): Promise<ActionResult> {
	try {
		const userId = await getAuthUserId();

		const [item] = await db
			.select({ cartId: cartItem.cartId })
			.from(cartItem)
			.where(eq(cartItem.id, cartItemId))
			.limit(1);

		if (!item) return { success: false, error: "Item not found" };

		const [userCart] = await db
			.select({ id: cart.id })
			.from(cart)
			.where(and(eq(cart.id, item.cartId), eq(cart.userId, userId)))
			.limit(1);

		if (!userCart) return { success: false, error: "Cart not found" };

		if (quantity < 1) {
			await db.delete(cartItem).where(eq(cartItem.id, cartItemId));
		} else {
			await db
				.update(cartItem)
				.set({ quantity })
				.where(eq(cartItem.id, cartItemId));
		}

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to update",
		};
	}
}

export async function removeCartItem(
	cartItemId: string,
): Promise<ActionResult> {
	try {
		const userId = await getAuthUserId();

		const [item] = await db
			.select({ cartId: cartItem.cartId })
			.from(cartItem)
			.where(eq(cartItem.id, cartItemId))
			.limit(1);

		if (!item) return { success: false, error: "Item not found" };

		const [userCart] = await db
			.select({ id: cart.id })
			.from(cart)
			.where(and(eq(cart.id, item.cartId), eq(cart.userId, userId)))
			.limit(1);

		if (!userCart) return { success: false, error: "Not authorized" };

		await db.delete(cartItem).where(eq(cartItem.id, cartItemId));

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to remove",
		};
	}
}

export async function clearCart(): Promise<ActionResult> {
	try {
		const userId = await getAuthUserId();

		const userCart = await getUserCart(userId);
		if (userCart) {
			await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
		}

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to clear cart",
		};
	}
}
