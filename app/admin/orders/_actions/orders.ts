"use server";

import { db } from "@/database";
import { shopOrder, orderStatusHistory } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { VALID_TRANSITIONS, type OrderStatus } from "../_lib/data";
import { nanoid } from "nanoid";

type Result = { success: true } | { success: false; error: string };

export async function updateOrderStatus(
	orderId: string,
	newStatus: OrderStatus,
	note?: string,
): Promise<Result> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user || session.user.role !== "admin") {
			return { success: false, error: "Unauthorized" };
		}

		const [order] = await db
			.select({ status: shopOrder.status })
			.from(shopOrder)
			.where(eq(shopOrder.id, orderId))
			.limit(1);
		if (!order) return { success: false, error: "Order not found" };

		const allowed = VALID_TRANSITIONS[order.status] ?? [];
		if (!allowed.includes(newStatus)) {
			return {
				success: false,
				error: `Cannot transition from ${order.status} to ${newStatus}`,
			};
		}

		await db.transaction(async (tx) => {
			await tx
				.update(shopOrder)
				.set({ status: newStatus, updatedAt: new Date() })
				.where(eq(shopOrder.id, orderId));

			await tx.insert(orderStatusHistory).values({
				id: nanoid(),
				orderId,
				status: newStatus,
				note: note || null,
				occurredAt: new Date(),
			});
		});

		revalidatePath(`/admin/orders/${orderId}`);
		revalidatePath("/admin/orders");
		revalidatePath("/admin");

		return { success: true };
	} catch (error) {
		console.error("Update order status error:", error);
		return { success: false, error: "Failed to update order status" };
	}
}

export async function updateAdminNote(
	orderId: string,
	note: string,
): Promise<Result> {
	try {
		const session = await auth.api.getSession({ headers: await headers() });
		if (!session?.user || session.user.role !== "admin") {
			return { success: false, error: "Unauthorized" };
		}

		await db
			.update(shopOrder)
			.set({ adminNote: note, updatedAt: new Date() })
			.where(eq(shopOrder.id, orderId));

		revalidatePath(`/admin/orders/${orderId}`);
		return { success: true };
	} catch {
		return { success: false, error: "Failed to update note" };
	}
}
