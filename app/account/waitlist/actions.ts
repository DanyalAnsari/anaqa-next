// app/account/waitlist/actions.ts
"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/database";
import { waitlist } from "@/database/schemas";

type ActionResult = { success: true } | { success: false; error: string };

export async function removeFromWaitlist(
	waitlistId: string,
): Promise<ActionResult> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			return { success: false, error: "Unauthorized" };
		}

		// Verify ownership
		const existing = await db
			.select({ id: waitlist.id })
			.from(waitlist)
			.where(
				and(eq(waitlist.id, waitlistId), eq(waitlist.userId, session.user.id)),
			)
			.limit(1);

		if (existing.length === 0) {
			return { success: false, error: "Waitlist entry not found" };
		}

		await db.delete(waitlist).where(eq(waitlist.id, waitlistId));

		revalidatePath("/account/waitlist");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Remove from waitlist error:", error);
		return {
			success: false,
			error:
				error instanceof Error ?
					error.message
				:	"Failed to remove from waitlist",
		};
	}
}
