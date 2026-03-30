import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { cart, cartItem } from "../schemas";

export const getCartItemsCount = async (userId: string) => {
	const result = await db
		.select({
			count: sql<number>`COALESCE(SUM(${cartItem.quantity}), 0)::int`,
		})
		.from(cart)
		.leftJoin(cartItem, eq(cart.id, cartItem.id))
		.where(eq(cart.userId, userId));

	return result[0]?.count ?? 0;
};
