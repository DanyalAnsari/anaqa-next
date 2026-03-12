"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CollectionsTable } from "./collections-table";
import { CollectionFormDialog } from "./collection-form-dialog";
import type { CollectionItem } from "../_lib/data";

export function CollectionsClient({
	collections,
}: {
	collections: CollectionItem[];
}) {
	const [showCreate, setShowCreate] = useState(false);

	return (
		<>
			<div className="flex justify-end">
				<Button onClick={() => setShowCreate(true)}>
					<Plus className="h-4 w-4 mr-2" />
					Add Collection
				</Button>
			</div>
			<Card>
				<CardContent className="pt-6">
					<CollectionsTable collections={collections} />
				</CardContent>
			</Card>
			<CollectionFormDialog open={showCreate} onOpenChange={setShowCreate} />
		</>
	);
}
