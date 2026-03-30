"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCartData, type CartItemData } from "../lib/data/cart";

export async function getCartDataAction(): Promise<{
	items: CartItemData[];
	subtotal: number;
	itemCount: number;
}> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user?.id) {
		return { items: [], subtotal: 0, itemCount: 0 };
	}
	const data = await getCartData(session.user.id);
	return {
		items: data.items,
		subtotal: data.subtotal,
		itemCount: data.itemCount,
	};
}
