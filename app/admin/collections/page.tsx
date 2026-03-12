import { getCollections } from "./_lib/data";
import { CollectionsClient } from "./_components/collections-client";

export default async function CollectionsPage() {
	const collections = await getCollections();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Collections</h1>
				<p className="text-muted-foreground text-sm">
					Manage product collections.
				</p>
			</div>
			<CollectionsClient collections={collections} />
		</div>
	);
}
