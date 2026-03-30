// app/account/reviews/_components/review-card.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	MoreVertical,
	Pencil,
	Trash2,
	Loader2,
	Package,
	CheckCircle,
	Clock,
	ShieldCheck,
	ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
import { deleteReview } from "../actions";
import { ReviewEditDialog } from "./review-edit-dialog";

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

interface ReviewCardProps {
	review: ReviewData;
}

export function ReviewCard({ review: r }: ReviewCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [isDeleting, startDeleteTransition] = useTransition();

	const handleDelete = () => {
		startDeleteTransition(async () => {
			const result = await deleteReview(r.id);
			if (result.success) {
				toast.success("Review deleted");
				setShowDeleteDialog(false);
			} else {
				toast.error(result.error);
			}
		});
	};

	const wasEdited =
		r.updatedAt &&
		r.createdAt &&
		new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime() > 1000;

	return (
		<>
			<Card
				className={cn(
					"group transition-all duration-200",
					"border-border/50 bg-background/50 backdrop-blur-sm",
					"hover:border-primary/30 hover:shadow-sm",
				)}
			>
				<CardContent className="p-5">
					<div className="flex gap-4">
						{/* Product Image */}
						<Link href={`/products/${r.productSlug}`} className="shrink-0">
							<div className="w-16 h-20 bg-secondary/30 rounded-lg overflow-hidden">
								{r.imageUrl ?
									<Image
										src={r.imageUrl}
										alt={r.imageAlt}
										width={64}
										height={80}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								:	<div className="w-full h-full flex items-center justify-center">
										<Package className="h-6 w-6 text-muted-foreground/20" />
									</div>
								}
							</div>
						</Link>

						{/* Content */}
						<div className="flex-1 min-w-0">
							{/* Top Row */}
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<Link
										href={`/products/${r.productSlug}`}
										className="text-sm font-semibold hover:text-primary transition-colors line-clamp-1"
									>
										{r.productName}
									</Link>
									<p className="text-xs text-muted-foreground mt-0.5">
										{formatPrice(r.productPrice)}
									</p>
								</div>

								{/* Actions */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<MoreVertical className="h-4 w-4" />
											<span className="sr-only">Review actions</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-44">
										<DropdownMenuItem
											onClick={() => setShowEditDialog(true)}
											className="cursor-pointer"
										>
											<Pencil className="mr-2 h-4 w-4" />
											Edit Review
										</DropdownMenuItem>
										<DropdownMenuItem asChild className="cursor-pointer">
											<Link href={`/products/${r.productSlug}`}>
												<ExternalLink className="mr-2 h-4 w-4" />
												View Product
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => setShowDeleteDialog(true)}
											className="text-destructive focus:text-destructive cursor-pointer"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							{/* Rating Stars */}
							<div className="flex items-center gap-2 mt-2">
								<div className="flex items-center gap-0.5">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={cn(
												"h-4 w-4",
												star <= r.rating ?
													"fill-yellow-400 text-yellow-400"
												:	"fill-muted text-muted",
											)}
										/>
									))}
								</div>
								<div className="flex items-center gap-1.5 flex-wrap">
									{r.isVerifiedPurchase && (
										<Badge
											variant="outline"
											className="text-xs gap-1 bg-green-500/10 text-green-600 border-green-500/20"
										>
											<ShieldCheck className="h-3 w-3" />
											Verified
										</Badge>
									)}
									{r.isApproved ?
										<Badge
											variant="outline"
											className="text-xs gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20"
										>
											<CheckCircle className="h-3 w-3" />
											Published
										</Badge>
									:	<Badge
											variant="outline"
											className="text-xs gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
										>
											<Clock className="h-3 w-3" />
											Pending
										</Badge>
									}
								</div>
							</div>

							{/* Review Content */}
							<div className="mt-3 space-y-1">
								<h4 className="font-semibold text-sm">{r.title}</h4>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{r.comment}
								</p>
							</div>

							{/* Footer */}
							<div className="flex items-center gap-2 mt-3">
								<p className="text-xs text-muted-foreground">
									{new Date(r.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</p>
								{wasEdited && (
									<span className="text-xs text-muted-foreground">
										· Edited
									</span>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Edit Dialog */}
			<ReviewEditDialog
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
				review={r}
			/>

			{/* Delete Confirmation */}
			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setShowDeleteDialog(false);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Review</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete your review for{" "}
							<span className="font-medium text-foreground">
								&ldquo;{r.productName}&rdquo;
							</span>
							? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowDeleteDialog(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting ?
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting…
								</>
							:	"Delete"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
