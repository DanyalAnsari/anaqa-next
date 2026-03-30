import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, asc } from "drizzle-orm";
import { AddressesClient } from "./_components/addresses-client";
import { db } from "@/database";
import { address } from "@/database/schemas";

export default async function AddressesPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		return null;
	}

	const addresses = await db
		.select()
		.from(address)
		.where(eq(address.userId, session.user.id))
		.orderBy(asc(address.createdAt));

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
				<p className="text-muted-foreground mt-1">
					Manage your shipping addresses for faster checkout.
				</p>
			</div>

			<AddressesClient addresses={addresses} />
		</div>
	);
}
