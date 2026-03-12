"use server";

import { db } from "@/database";
import { newsletter } from "@/database/schemas";
import { eq, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Result = { success: true; data?: any } | { success: false; error: string };

async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user || session.user.role !== "admin")
		throw new Error("Unauthorized");
}

export async function sendNewsletter(
	subject: string,
	content: string,
): Promise<Result> {
	try {
		await requireAdmin();

		const subscribers = await db
			.select({ email: newsletter.email })
			.from(newsletter)
			.where(eq(newsletter.isActive, true));

		if (subscribers.length === 0)
			return { success: false, error: "No active subscribers" };

		// TODO: Integrate with email service
		console.log(`Sending "${subject}" to ${subscribers.length} subscribers`);

		return { success: true, data: { sent: subscribers.length } };
	} catch {
		return { success: false, error: "Failed to send newsletter" };
	}
}

export async function unsubscribeUser(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db
			.update(newsletter)
			.set({ isActive: false, unsubscribedAt: new Date() })
			.where(eq(newsletter.id, id));
		revalidatePath("/admin/settings");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to unsubscribe" };
	}
}

export async function resubscribeUser(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db
			.update(newsletter)
			.set({ isActive: true, unsubscribedAt: null })
			.where(eq(newsletter.id, id));
		revalidatePath("/admin/settings");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to resubscribe" };
	}
}

export async function deleteSubscriber(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db.delete(newsletter).where(eq(newsletter.id, id));
		revalidatePath("/admin/settings");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to delete subscriber" };
	}
}
