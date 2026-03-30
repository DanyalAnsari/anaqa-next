"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitReview } from "./product-action-server";

interface ReviewData {
	id: string;
	rating: number;
	title: string;
	comment: string;
	isVerifiedPurchase: boolean;
	createdAt: Date;
	userName: string;
}

interface ProductReviewsProps {
	productId: string;
	productName: string;
	reviews: ReviewData[];
	totalReviews: number;
	averageRating: number;
}

export function ProductReviews({
	productId,
	productName,
	reviews,
	totalReviews,
	averageRating,
}: ProductReviewsProps) {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-medium">
					Customer Reviews
					{totalReviews > 0 && (
						<span className="text-muted-foreground font-normal ml-2">
							({totalReviews})
						</span>
					)}
				</h3>
			</div>

			{/* Summary */}
			{totalReviews > 0 && (
				<div className="flex items-center gap-4">
					<div className="text-center">
						<p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
						<div className="flex items-center gap-0.5 mt-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={cn(
										"h-4 w-4",
										star <= Math.round(averageRating) ?
											"fill-yellow-400 text-yellow-400"
										:	"fill-muted text-muted",
									)}
								/>
							))}
						</div>
					</div>
					<Separator orientation="vertical" className="h-12" />
					<p className="text-sm text-muted-foreground">
						Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
					</p>
				</div>
			)}

			{/* Review Form */}
			<ReviewForm productId={productId} productName={productName} />

			{/* Reviews List */}
			{reviews.length === 0 ?
				<div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
					<Star className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
					<p>No reviews yet. Be the first to review this product!</p>
				</div>
			:	<div className="space-y-4">
					{reviews.map((r) => (
						<ReviewCard key={r.id} review={r} />
					))}
				</div>
			}
		</div>
	);
}

function ReviewCard({ review }: { review: ReviewData }) {
	return (
		<div className="border border-border/50 rounded-lg p-4 space-y-3">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<div className="flex items-center gap-0.5">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={cn(
										"h-4 w-4",
										star <= review.rating ?
											"fill-yellow-400 text-yellow-400"
										:	"fill-muted text-muted",
									)}
								/>
							))}
						</div>
						{review.isVerifiedPurchase && (
							<Badge variant="secondary" className="text-xs">
								Verified Purchase
							</Badge>
						)}
					</div>
					<h4 className="font-medium text-sm">{review.title}</h4>
				</div>
				<span className="text-xs text-muted-foreground whitespace-nowrap">
					{new Date(review.createdAt).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</span>
			</div>
			<p className="text-sm text-muted-foreground leading-relaxed">
				{review.comment}
			</p>
			<p className="text-xs text-muted-foreground">— {review.userName}</p>
		</div>
	);
}

function ReviewForm({
	productId,
	productName,
}: {
	productId: string;
	productName: string;
}) {
	const [rating, setRating] = useState(0);
	const [hovered, setHovered] = useState(0);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (rating === 0) {
			toast.error("Please select a rating");
			return;
		}
		if (!title.trim()) {
			toast.error("Please add a title");
			return;
		}
		if (!comment.trim() || comment.trim().length < 10) {
			toast.error("Review must be at least 10 characters");
			return;
		}

		startTransition(async () => {
			const result = await submitReview(productId, {
				rating,
				title: title.trim(),
				comment: comment.trim(),
			});

			if (result.success) {
				toast.success("Review submitted!", {
					description:
						"Thank you for your feedback. It will be visible after moderation.",
				});
				setRating(0);
				setTitle("");
				setComment("");
			} else {
				toast.error(result.error);
			}
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="border border-border/50 rounded-lg p-4 space-y-4"
		>
			<h4 className="font-medium">Write a Review</h4>

			{/* Stars */}
			<div className="space-y-2">
				<label className="text-sm font-medium">Your Rating</label>
				<div className="flex items-center gap-1">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onMouseEnter={() => setHovered(star)}
							onMouseLeave={() => setHovered(0)}
							onClick={() => setRating(star)}
							className="p-0.5"
							disabled={isPending}
						>
							<Star
								className={cn(
									"h-6 w-6 transition-colors",
									star <= (hovered || rating) ?
										"fill-yellow-400 text-yellow-400"
									:	"text-muted-foreground/30 hover:fill-yellow-200 hover:text-yellow-200",
								)}
							/>
						</button>
					))}
				</div>
			</div>

			<div className="space-y-2">
				<label htmlFor="review-title" className="text-sm font-medium">
					Title
				</label>
				<Input
					id="review-title"
					placeholder="Summarize your experience"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					maxLength={100}
					disabled={isPending}
				/>
			</div>

			<div className="space-y-2">
				<label htmlFor="review-comment" className="text-sm font-medium">
					Your Review
				</label>
				<Textarea
					id="review-comment"
					placeholder="Tell others about your experience with this product..."
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					rows={4}
					maxLength={1000}
					disabled={isPending}
					className="resize-none"
				/>
				<p className="text-xs text-muted-foreground text-right">
					{comment.length}/1000
				</p>
			</div>

			<Button type="submit" disabled={isPending} className="w-full sm:w-auto">
				{isPending ?
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Submitting…
					</>
				:	<>
						<Send className="mr-2 h-4 w-4" />
						Submit Review
					</>
				}
			</Button>
		</form>
	);
}
