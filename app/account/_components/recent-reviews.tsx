import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

async function getRecentReviews(userId: string, limit = 3) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/reviews?userId=${userId}&limit=${limit}`,
		{ cache: "no-store" },
	);
	if (!response.ok) return [];
	const data = await response.json();
	return data.reviews || [];
}

export async function RecentReviews({ userId }: { userId: string }) {
	const reviews = await getRecentReviews(userId);

	if (reviews.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg">
				<Star className="h-12 w-12 text-muted-foreground/40 mb-3" />
				<p className="text-sm text-muted-foreground">
					No reviews yet. Share your thoughts on products you've purchased!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{reviews.map((review: any) => {
				const productName =
					typeof review.product === "object" ? review.product.name : "Product";
				const productSlug =
					typeof review.product === "object" ? review.product.slug : null;

				return (
					<div
						key={review._id}
						className="flex items-start justify-between p-4 border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all"
					>
						<div className="flex-1 min-w-0 space-y-2">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-0.5">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`h-4 w-4 ${
												star <= review.rating ?
													"fill-yellow-400 text-yellow-400"
												:	"text-muted-foreground/30"
											}`}
										/>
									))}
								</div>
								{review.isVerifiedPurchase && (
									<Badge variant="secondary" className="text-xs">
										Verified
									</Badge>
								)}
							</div>
							<p className="font-semibold text-sm line-clamp-1">
								{review.title}
							</p>
							{productSlug ?
								<Link
									href={`/products/${productSlug}`}
									className="text-xs text-muted-foreground hover:text-primary transition-colors"
								>
									{productName}
								</Link>
							:	<p className="text-xs text-muted-foreground">{productName}</p>}
						</div>
						<span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
							{new Date(review.createdAt).toLocaleDateString()}
						</span>
					</div>
				);
			})}
		</div>
	);
}
