import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/database";
import { collection } from "@/database/schemas";
import { eq, desc } from "drizzle-orm";
import { CollectionCard } from "@/components/shared/collection-card";

export default async function CollectionsPage() {
	const collections = await db
		.select({
			id: collection.id,
			name: collection.name,
			slug: collection.slug,
			description: collection.description,
			imageFilePath: collection.imageFilePath,
		})
		.from(collection)
		.where(eq(collection.isActive, true))
		.orderBy(desc(collection.createdAt));

	return (
		<div className="animate-in fade-in duration-500">
			{/* Hero */}
			<section className="bg-secondary/30 py-12 md:py-20">
				<div className="container-wide">
					<nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground transition-colors">
							Home
						</Link>
						<ChevronRight className="h-4 w-4" />
						<span className="text-foreground">Collections</span>
					</nav>

					<div className="max-w-2xl">
						<h1 className="text-4xl md:text-5xl font-medium mb-4">
							Our Collections
						</h1>
						<p className="text-lg text-muted-foreground">
							Explore our thoughtfully curated collections, each designed to
							bring elegance and grace to your wardrobe.
						</p>
					</div>
				</div>
			</section>

			{/* Collections Grid */}
			<section className="editorial-spacing">
				<div className="container-wide">
					{collections.length === 0 ?
						<div className="text-center py-16">
							<h3 className="text-lg font-medium mb-2">
								No collections available
							</h3>
							<p className="text-muted-foreground">
								Check back soon for new collections.
							</p>
						</div>
					:	<>
							{/* Featured — first collection large */}
							{collections[0] && (
								<div className="mb-12">
									<CollectionCard collection={collections[0]} variant="large" />
								</div>
							)}

							{/* Rest */}
							{collections.length > 1 && (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{collections.slice(1).map((coll) => (
										<CollectionCard
											key={coll.id}
											collection={coll}
											variant="overlay"
										/>
									))}
								</div>
							)}
						</>
					}
				</div>
			</section>
		</div>
	);
}
