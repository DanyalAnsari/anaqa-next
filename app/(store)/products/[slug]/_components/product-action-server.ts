"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database";
import { cart, cartItem, wishlist, waitlist } from "@/database/schemas";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

type ActionResult = { success: true } | { success: false; error: string };

export async function addToCart(
	productId: string,
	size: string,
	quantity: number,
): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user?.id)
			return { success: false, error: "Please sign in to add items to cart." };

		const userId = session.user.id;

		// Get or create cart
		let [userCart] = await db
			.select({ id: cart.id })
			.from(cart)
			.where(eq(cart.userId, userId))
			.limit(1);

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
			// Get product price
			const { product } = await import("@/database/schemas");
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

export async function addToWishlist(productId: string): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user?.id)
			return { success: false, error: "Please sign in to add to wishlist." };

		const userId = session.user.id;

		// Check if already in wishlist
		const [existing] = await db
			.select({ userId: wishlist.userId })
			.from(wishlist)
			.where(
				and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)),
			)
			.limit(1);

		if (existing) {
			return { success: false, error: "Already in your wishlist" };
		}

		await db.insert(wishlist).values({
			userId,
			productId,
		});

		revalidatePath("/account/wishlist");
		return { success: true };
	} catch (error) {
		console.error("Add to wishlist error:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "Failed to add to wishlist",
		};
	}
}

export async function joinWaitlist(
	productId: string,
	size: string,
): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user?.id)
			return { success: false, error: "Please sign in to join the waitlist." };

		const userId = session.user.id;
		const email = session.user.email;

		// Check if already on waitlist
		const [existing] = await db
			.select({ id: waitlist.id })
			.from(waitlist)
			.where(
				and(
					eq(waitlist.email, email),
					eq(waitlist.productId, productId),
					eq(waitlist.variantSize, size as any),
				),
			)
			.limit(1);

		if (existing) {
			return { success: false, error: "You're already on the waitlist" };
		}

		await db.insert(waitlist).values({
			id: nanoid(),
			email,
			userId,
			productId,
			variantSize: size as any,
		});

		revalidatePath("/account/waitlist");
		return { success: true };
	} catch (error) {
		console.error("Join waitlist error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to join waitlist",
		};
	}
}

export async function submitReview(
	productId: string,
	input: { rating: number; title: string; comment: string },
): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user?.id)
			return { success: false, error: "Please sign in to submit a review." };

		const userId = session.user.id;

		// Check if already reviewed
		const { review } = await import("@/database/schemas");
		const [existing] = await db
			.select({ id: review.id })
			.from(review)
			.where(and(eq(review.userId, userId), eq(review.productId, productId)))
			.limit(1);

		if (existing) {
			return {
				success: false,
				error: "You've already reviewed this product.",
			};
		}

		// Check if user has ordered this product (verified purchase)
		const { orderItem, shopOrder } = await import("@/database/schemas");
		const [purchase] = await db
			.select({ id: orderItem.id })
			.from(orderItem)
			.innerJoin(shopOrder, eq(orderItem.orderId, shopOrder.id))
			.where(
				and(
					eq(shopOrder.userId, userId),
					eq(orderItem.productId, productId),
					eq(shopOrder.status, "delivered"),
				),
			)
			.limit(1);

		await db.insert(review).values({
			id: nanoid(),
			userId,
			productId,
			rating: input.rating,
			title: input.title,
			comment: input.comment,
			isVerifiedPurchase: !!purchase,
			isApproved: false,
		});

		revalidatePath(`/products`);
		revalidatePath("/account/reviews");

		return { success: true };
	} catch (error) {
		console.error("Submit review error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to submit review",
		};
	}
}
