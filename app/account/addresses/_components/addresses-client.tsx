// app/account/addresses/_components/addresses-client.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { AddressCard } from "./address-card";
import { AddressFormDialog } from "./address-form-dialog";
import type { InferSelectModel } from "drizzle-orm";
import type { address } from "@/lib/db/schema";

type Address = InferSelectModel<typeof address>;

interface AddressesClientProps {
	addresses: Address[];
}

export function AddressesClient({ addresses }: AddressesClientProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);

	const handleAdd = () => {
		setEditingAddress(null);
		setIsDialogOpen(true);
	};

	const handleEdit = (addr: Address) => {
		setEditingAddress(addr);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setEditingAddress(null);
	};

	return (
		<>
			{/* Action Bar */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{addresses.length === 0 ?
						"No addresses saved"
					:	`${addresses.length} address${addresses.length !== 1 ? "es" : ""} saved`
					}
				</p>
				<Button onClick={handleAdd} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					Add Address
				</Button>
			</div>

			{/* Address Grid or Empty State */}
			{addresses.length === 0 ?
				<div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-secondary/20">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
						<MapPin className="h-8 w-8 text-primary" />
					</div>
					<h2 className="text-xl font-semibold mb-2">No Addresses Yet</h2>
					<p className="text-muted-foreground mb-6 max-w-sm">
						Add a shipping address to make checkout faster and easier.
					</p>
					<Button onClick={handleAdd} className="gap-2">
						<Plus className="h-4 w-4" />
						Add Your First Address
					</Button>
				</div>
			:	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Default address always first */}
					{[...addresses]
						.sort((a, b) => {
							if (a.isDefault && !b.isDefault) return -1;
							if (!a.isDefault && b.isDefault) return 1;
							return 0;
						})
						.map((addr) => (
							<AddressCard key={addr.id} address={addr} onEdit={handleEdit} />
						))}
				</div>
			}

			{/* Form Dialog */}
			<AddressFormDialog
				open={isDialogOpen}
				onOpenChange={(open) => {
					if (!open) handleDialogClose();
					else setIsDialogOpen(true);
				}}
				address={editingAddress}
				onSuccess={handleDialogClose}
			/>
		</>
	);
}
