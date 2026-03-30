// app/account/reviews/_components/reviews-client.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Star,
	MessageSquare,
	ShoppingBag,
	ArrowRight,
	Filter,
	X,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { ReviewCard } from "./review-card";

interface ReviewData {
	id: string;
	productId: string;
	orderId: string | null;
	rating: number;
	title: string;
	comment: string;
	isVerifiedPurchase: boolean;
	isApproved: boolean;
	createdAt: Date;
	updatedAt: Date;
	productName: string;
	productSlug: string;
	productPrice: number;
	productIsActive: boolean;
	imageUrl: string | null;
	imageAlt: string;
}

interface ReviewsClientProps {
	reviews: ReviewData[];
}

type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1";
type StatusFilter = "all" | "approved" | "pending";

export function ReviewsClient({ reviews }: ReviewsClientProps) {
	const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	const filteredReviews = useMemo(() => {
		return reviews.filter((r) => {
			const matchesRating =
				ratingFilter === "all" || r.rating === Number(ratingFilter);
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "approved" && r.isApproved) ||
				(statusFilter === "pending" && !r.isApproved);
			return matchesRating && matchesStatus;
		});
	}, [reviews, ratingFilter, statusFilter]);

	const hasFilters = ratingFilter !== "all" || statusFilter !== "all";

	const clearFilters = () => {
		setRatingFilter("all");
		setStatusFilter("all");
	};

	// Stats
	const stats = useMemo(() => {
		if (reviews.length === 0)
			return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
		const total = reviews.length;
		const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
		const distribution = [5, 4, 3, 2, 1].map(
			(star) => reviews.filter((r) => r.rating === star).length,
		);
		return { avg, total, distribution };
	}, [reviews]);

	if (reviews.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-secondary/20">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
					<MessageSquare className="h-8 w-8 text-primary" />
				</div>
				<h2 className="text-xl font-semibold mb-2">No Reviews Yet</h2>
				<p className="text-muted-foreground mb-6 max-w-sm">
					After receiving your orders, you can share your experience by leaving
					a review.
				</p>
				<Button asChild className="gap-2">
					<Link href="/shop">
						<ShoppingBag className="h-4 w-4" />
						Start Shopping
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats Summary */}
			<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
				<CardContent className="p-5">
					<div className="flex flex-col sm:flex-row sm:items-center gap-6">
						{/* Average Rating */}
						<div className="flex items-center gap-4">
							<div className="text-center">
								<p className="text-4xl font-bold">{stats.avg.toFixed(1)}</p>
								<div className="flex items-center gap-0.5 mt-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={cn(
												"h-4 w-4",
												star <= Math.round(stats.avg) ?
													"fill-yellow-400 text-yellow-400"
												:	"fill-muted text-muted",
											)}
										/>
									))}
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{stats.total} {stats.total === 1 ? "review" : "reviews"}
								</p>
							</div>
						</div>

						{/* Distribution Bars */}
						<div className="flex-1 space-y-1.5">
							{[5, 4, 3, 2, 1].map((star, idx) => {
								const count = stats.distribution[idx];
								const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
								return (
									<button
										key={star}
										onClick={() =>
											setRatingFilter(
												ratingFilter === String(star) ? "all" : (
													(String(star) as RatingFilter)
												),
											)
										}
										className={cn(
											"flex items-center gap-2 w-full group",
											"hover:opacity-80 transition-opacity",
										)}
									>
										<span className="text-xs text-muted-foreground w-3 text-right">
											{star}
										</span>
										<Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
										<div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-300",
													ratingFilter === String(star) ? "bg-primary" : (
														"bg-yellow-400"
													),
												)}
												style={{ width: `${pct}%` }}
											/>
										</div>
										<span className="text-xs text-muted-foreground w-6 text-right tabular-nums">
											{count}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Select
					value={ratingFilter}
					onValueChange={(v) => setRatingFilter(v as RatingFilter)}
				>
					<SelectTrigger className="w-full sm:w-44 bg-background/50">
						<SelectValue placeholder="All Ratings" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Ratings</SelectItem>
						{[5, 4, 3, 2, 1].map((star) => (
							<SelectItem key={star} value={String(star)}>
								<span className="flex items-center gap-1.5">
									{star}{" "}
									<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
								</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={statusFilter}
					onValueChange={(v) => setStatusFilter(v as StatusFilter)}
				>
					<SelectTrigger className="w-full sm:w-44 bg-background/50">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
					</SelectContent>
				</Select>

				{hasFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="gap-1 text-muted-foreground"
					>
						<X className="h-3.5 w-3.5" />
						Clear
					</Button>
				)}
			</div>

			{/* Results */}
			{hasFilters && (
				<p className="text-sm text-muted-foreground">
					{filteredReviews.length} of {reviews.length} reviews
				</p>
			)}

			{filteredReviews.length === 0 ?
				<div className="text-center py-12 border border-dashed rounded-xl">
					<Filter className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
					<p className="text-muted-foreground text-sm">
						No reviews match your filters.
					</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="mt-2"
					>
						Clear filters
					</Button>
				</div>
			:	<div className="space-y-4">
					{filteredReviews.map((r) => (
						<ReviewCard key={r.id} review={r} />
					))}
				</div>
			}
		</div>
	);
}
