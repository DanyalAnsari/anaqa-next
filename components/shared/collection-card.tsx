import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/image";
import { cn } from "@/lib/utils";

interface CollectionData {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	imageFilePath: string;
}

interface CollectionCardProps {
	collection: CollectionData;
	variant?: "default" | "large" | "overlay";
	className?: string;
}

export function CollectionCard({
	collection,
	variant = "default",
	className,
}: CollectionCardProps) {
	if (variant === "overlay") {
		return (
			<Link
				href={`/collections/${collection.slug}`}
				className={cn(
					"group relative block aspect-[4/5] overflow-hidden rounded-lg",
					className,
				)}
			>
				<ProductImage
					filePath={collection.imageFilePath}
					alt={collection.name}
					width={600}
					height={750}
					className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					transforms="w-1200,h-1500,c-at_max,q-80"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
				<div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
					<h3 className="text-xl font-medium mb-2 group-hover:translate-x-1 transition-transform">
						{collection.name}
					</h3>
					{collection.description && (
						<p className="text-sm text-white/80 line-clamp-2 mb-4">
							{collection.description}
						</p>
					)}
					<span className="inline-flex items-center text-sm font-medium">
						Shop Now
						<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</span>
				</div>
			</Link>
		);
	}

	if (variant === "large") {
		return (
			<Link
				href={`/collections/${collection.slug}`}
				className={cn(
					"group relative block aspect-video md:aspect-[21/9] overflow-hidden rounded-lg",
					className,
				)}
			>
				<ProductImage
					filePath={collection.imageFilePath}
					alt={collection.name}
					width={1200}
					height={514}
					priority
					className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					transforms="w-2400,h-1028,c-at_max,q-80"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
				<div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white max-w-2xl">
					<span className="text-sm uppercase tracking-widest text-white/70 mb-2">
						Collection
					</span>
					<h2 className="text-3xl md:text-4xl font-medium mb-4">
						{collection.name}
					</h2>
					{collection.description && (
						<p className="text-white/80 mb-6 line-clamp-2">
							{collection.description}
						</p>
					)}
					<span className="inline-flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
						Explore Collection
						<ArrowRight className="ml-2 h-4 w-4" />
					</span>
				</div>
			</Link>
		);
	}

	// Default
	return (
		<Link
			href={`/collections/${collection.slug}`}
			className={cn("group block", className)}
		>
			<div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-secondary">
				<ProductImage
					filePath={collection.imageFilePath}
					alt={collection.name}
					width={600}
					height={450}
					className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					transforms="w-1200,h-900,c-at_max,q-80"
				/>
			</div>
			<h3 className="font-medium mb-1 group-hover:text-foreground/80 transition-colors">
				{collection.name}
			</h3>
			{collection.description && (
				<p className="text-sm text-muted-foreground line-clamp-2">
					{collection.description}
				</p>
			)}
		</Link>
	);
}
