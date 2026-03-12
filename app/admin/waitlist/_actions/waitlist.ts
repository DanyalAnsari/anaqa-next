"use server";

import { db } from "@/database";
import { waitlist } from "@/database/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Result = { success: true } | { success: false; error: string };

async function requireAdmin() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user || session.user.role !== "admin")
		throw new Error("Unauthorized");
}

export async function markNotified(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db
			.update(waitlist)
			.set({ notified: true, notifiedAt: new Date() })
			.where(eq(waitlist.id, id));
		revalidatePath("/admin/waitlist");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to update" };
	}
}

export async function deleteWaitlistEntry(id: string): Promise<Result> {
	try {
		await requireAdmin();
		await db.delete(waitlist).where(eq(waitlist.id, id));
		revalidatePath("/admin/waitlist");
		return { success: true };
	} catch {
		return { success: false, error: "Failed to delete" };
	}
}
