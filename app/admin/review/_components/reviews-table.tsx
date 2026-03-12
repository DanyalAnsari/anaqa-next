"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Star,
	CheckCircle2,
	XCircle,
	Trash2,
	ShieldCheck,
	ChevronLeft,
	ChevronRight,
	MessageSquare,
	Loader2,
} from "lucide-react";
import { approveReview, rejectReview, deleteReview } from "../_actions/reviews";
import type { ReviewItem } from "../_lib/data";

interface Props {
	reviews: ReviewItem[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

function Stars({ rating }: { rating: number }) {
	return (
		<div className="flex gap-0.5">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
				/>
			))}
		</div>
	);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

export function ReviewsTable({
	reviews,
	total,
	page,
	pageSize,
	totalPages,
}: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [loading, setLoading] = useState<string | null>(null);
	const [deleteId, setDeleteId] = useState<string | null>(null);

	function updateParams(updates: Record<string, string | undefined>) {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(updates).forEach(([k, v]) => {
			if (!v || v === "all") params.delete(k);
			else params.set(k, v);
		});
		if (!("page" in updates)) params.delete("page");
		startTransition(() => router.push(`?${params.toString()}`));
	}

	const status = searchParams.get("status") ?? "all";

	async function handleAction(
		id: string,
		action: () => Promise<any>,
		msg: string,
	) {
		setLoading(id);
		try {
			const result = await action();
			if (result.success) {
				toast.success(msg);
				router.refresh();
			} else toast.error(result.error);
		} catch {
			toast.error("Action failed");
		} finally {
			setLoading(null);
		}
	}

	async function handleDelete() {
		if (!deleteId) return;
		await handleAction(
			deleteId,
			() => deleteReview(deleteId),
			"Review deleted",
		);
		setDeleteId(null);
	}

	return (
		<>
			<div className="space-y-4">
				<div className="flex justify-end">
					<Select
						value={status}
						onValueChange={(v) => updateParams({ status: v })}
					>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Reviews</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="approved">Approved</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{reviews.length === 0 ?
					<div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
						<MessageSquare className="h-8 w-8 opacity-50" />
						<p>No reviews found</p>
					</div>
				:	<div className="space-y-4">
						{reviews.map((r) => (
							<Card key={r.id} className={isPending ? "opacity-50" : ""}>
								<CardContent className="pt-6">
									<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
										<div className="flex-1 space-y-2">
											<div className="flex items-center gap-2 flex-wrap">
												<Stars rating={r.rating} />
												<Badge variant={r.isApproved ? "default" : "secondary"}>
													{r.isApproved ? "Approved" : "Pending"}
												</Badge>
												{r.isVerifiedPurchase && (
													<Badge variant="outline" className="text-xs">
														<ShieldCheck className="h-3 w-3 mr-1" />
														Verified
													</Badge>
												)}
											</div>
											<h3 className="font-medium">{r.title}</h3>
											<p className="text-sm text-muted-foreground">
												{r.comment}
											</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
												<span>
													By <strong>{r.userName}</strong> ({r.userEmail})
												</span>
												<span>
													Product: <strong>{r.productName}</strong>
												</span>
												<span>{formatDate(r.createdAt)}</span>
											</div>
										</div>
										<div className="flex gap-2 shrink-0">
											{!r.isApproved && (
												<Button
													size="sm"
													variant="outline"
													disabled={loading === r.id}
													onClick={() =>
														handleAction(
															r.id,
															() => approveReview(r.id),
															"Review approved",
														)
													}
												>
													{loading === r.id ?
														<Loader2 className="h-4 w-4 animate-spin" />
													:	<CheckCircle2 className="h-4 w-4 mr-1" />}
													Approve
												</Button>
											)}
											{r.isApproved && (
												<Button
													size="sm"
													variant="outline"
													disabled={loading === r.id}
													onClick={() =>
														handleAction(
															r.id,
															() => rejectReview(r.id),
															"Review rejected",
														)
													}
												>
													<XCircle className="h-4 w-4 mr-1" />
													Reject
												</Button>
											)}
											<Button
												size="sm"
												variant="outline"
												className="text-destructive"
												onClick={() => setDeleteId(r.id)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				}

				{total > 0 && totalPages > 1 && (
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Showing {(page - 1) * pageSize + 1}-
							{Math.min(page * pageSize, total)} of {total}
						</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8"
								disabled={page === 1 || isPending}
								onClick={() => updateParams({ page: String(page - 1) })}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm text-muted-foreground px-2">
								{page} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8"
								disabled={page === totalPages || isPending}
								onClick={() => updateParams({ page: String(page + 1) })}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}
			</div>

			<AlertDialog
				open={!!deleteId}
				onOpenChange={(o) => !o && setDeleteId(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Review</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete this review and recalculate the
							product rating.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
