// app/account/_components/recent-reviews.tsx
import { db } from "@/lib/db";
import { review, product } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export async function RecentReviews({ userId }: { userId: string }) {
	const reviews = await db
		.select({
			id: review.id,
			rating: review.rating,
			title: review.title,
			comment: review.comment,
			isApproved: review.isApproved,
			isVerifiedPurchase: review.isVerifiedPurchase,
			createdAt: review.createdAt,
			productName: product.name,
			productSlug: product.slug,
		})
		.from(review)
		.innerJoin(product, eq(review.productId, product.id))
		.where(eq(review.userId, userId))
		.orderBy(desc(review.createdAt))
		.limit(3);

	if (reviews.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-xl bg-secondary/20">
				<MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-3" />
				<p className="text-sm text-muted-foreground">
					No reviews yet. Share your experience after receiving your orders.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{reviews.map((r) => (
				<Link
					key={r.id}
					href={`/products/${r.productSlug}`}
					className={cn(
						"group block p-4 border border-border/50 rounded-xl",
						"hover:border-primary/50 hover:bg-accent/30 transition-all",
					)}
				>
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0 flex-1">
							<p className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
								{r.productName}
							</p>
							<div className="flex items-center gap-2 mt-1.5">
								<div className="flex items-center gap-0.5">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={cn(
												"h-3.5 w-3.5",
												star <= r.rating ?
													"fill-yellow-400 text-yellow-400"
												:	"fill-muted text-muted",
											)}
										/>
									))}
								</div>
								{r.isApproved ?
									<Badge
										variant="outline"
										className="text-xs gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20"
									>
										<CheckCircle className="h-2.5 w-2.5" />
										Published
									</Badge>
								:	<Badge
										variant="outline"
										className="text-xs gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
									>
										<Clock className="h-2.5 w-2.5" />
										Pending
									</Badge>
								}
							</div>
							<p className="text-sm text-muted-foreground mt-2 line-clamp-2">
								<span className="font-medium text-foreground">{r.title}</span>
								{" — "}
								{r.comment}
							</p>
						</div>
						<p className="text-xs text-muted-foreground shrink-0">
							{new Date(r.createdAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
						</p>
					</div>
				</Link>
			))}
		</div>
	);
}
