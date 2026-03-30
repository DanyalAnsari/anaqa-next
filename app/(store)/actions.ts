"use server";

import { db } from "@/database";
import { newsletter } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

type ActionResult = { success: true } | { success: false; error: string };

export async function subscribeNewsletter(
	email: string,
): Promise<ActionResult> {
	try {
		const existing = await db
			.select({ id: newsletter.id })
			.from(newsletter)
			.where(eq(newsletter.email, email.toLowerCase()))
			.limit(1);

		if (existing.length > 0) {
			// Reactivate if previously unsubscribed
			await db
				.update(newsletter)
				.set({ isActive: true, unsubscribedAt: null })
				.where(eq(newsletter.email, email.toLowerCase()));
			return { success: true };
		}

		await db.insert(newsletter).values({
			id: nanoid(),
			email: email.toLowerCase(),
		});

		return { success: true };
	} catch (error) {
		console.error("Newsletter subscribe error:", error);
		return { success: false, error: "Failed to subscribe. Please try again." };
	}
}
