// app/account/reviews/_components/review-edit-dialog.tsx
"use client";

import { useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { updateReview, type UpdateReviewInput } from "../actions";

const reviewFormSchema = z.object({
	rating: z.number().int().min(1, "Please select a rating").max(5),
	title: z
		.string()
		.min(2, "Title must be at least 2 characters")
		.max(100, "Title must be under 100 characters"),
	comment: z
		.string()
		.min(10, "Review must be at least 10 characters")
		.max(1000, "Review must be under 1000 characters"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewEditDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	review: {
		id: string;
		rating: number;
		title: string;
		comment: string;
		productName: string;
	};
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export function ReviewEditDialog({
	open,
	onOpenChange,
	review,
}: ReviewEditDialogProps) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<ReviewFormValues>({
		resolver: zodResolver(reviewFormSchema),
		mode: "onBlur",
		defaultValues: {
			rating: review.rating,
			title: review.title,
			comment: review.comment,
		},
	});

	const watchedRating = form.watch("rating");

	useEffect(() => {
		if (open) {
			form.reset({
				rating: review.rating,
				title: review.title,
				comment: review.comment,
			});
		}
	}, [open, review, form]);

	const handleSubmit = (data: ReviewFormValues) => {
		startTransition(async () => {
			const result = await updateReview(review.id, data);
			if (result.success) {
				toast.success("Review updated", {
					description:
						"Your review has been updated and will be re-reviewed for approval.",
				});
				onOpenChange(false);
			} else {
				toast.error(result.error);
			}
		});
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && isPending) return;
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Review</DialogTitle>
					<DialogDescription>
						Update your review for{" "}
						<span className="font-medium text-foreground">
							&ldquo;{review.productName}&rdquo;
						</span>
					</DialogDescription>
				</DialogHeader>

				<Alert className="bg-yellow-500/5 border-yellow-500/20">
					<AlertDescription className="text-xs text-yellow-600">
						Edited reviews are re-submitted for moderation and may take a short
						time to appear publicly.
					</AlertDescription>
				</Alert>

				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-5"
					noValidate
				>
					{/* Star Rating */}
					<Controller
						name="rating"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Rating</FieldLabel>
								<div className="flex items-center gap-3">
									<div className="flex items-center gap-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												onClick={() => field.onChange(star)}
												className={cn(
													"p-0.5 rounded transition-transform hover:scale-110",
													"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
												)}
												disabled={isPending}
											>
												<Star
													className={cn(
														"h-7 w-7 transition-colors",
														star <= field.value ?
															"fill-yellow-400 text-yellow-400"
														:	"fill-muted text-muted hover:fill-yellow-200 hover:text-yellow-200",
													)}
												/>
											</button>
										))}
									</div>
									{watchedRating > 0 && (
										<span className="text-sm text-muted-foreground">
											{RATING_LABELS[watchedRating]}
										</span>
									)}
								</div>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{/* Title */}
					<Controller
						name="title"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Review Title</FieldLabel>
								<Input
									{...field}
									id={field.name}
									placeholder="Summarize your experience"
									aria-invalid={fieldState.invalid}
									disabled={isPending}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{/* Comment */}
					<Controller
						name="comment"
						control={form.control}
						render={({ field, fieldState }) => {
							const charCount = field.value?.length ?? 0;
							return (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Your Review</FieldLabel>
									<Textarea
										{...field}
										id={field.name}
										placeholder="Share details about your experience with this product..."
										rows={5}
										aria-invalid={fieldState.invalid}
										disabled={isPending}
										className="resize-none"
									/>
									<div className="flex items-center justify-between">
										<FieldDescription>
											Be specific and helpful for other shoppers.
										</FieldDescription>
										<span
											className={cn(
												"text-xs tabular-nums",
												charCount > 900 ? "text-yellow-600"
												: charCount > 1000 ? "text-destructive"
												: "text-muted-foreground",
											)}
										>
											{charCount}/1000
										</span>
									</div>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							);
						}}
					/>

					<DialogFooter className="gap-2 sm:gap-0 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isPending || !form.formState.isDirty}
							className="gap-2"
						>
							{isPending ?
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Saving…
								</>
							:	<>
									<Save className="h-4 w-4" />
									Save Changes
								</>
							}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
