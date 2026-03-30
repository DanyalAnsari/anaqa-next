// app/account/profile/_components/avatar-upload.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, Upload, Trash2, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadAvatar, deleteAvatar } from "../actions";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
];

interface AvatarUploadProps {
	hasAvatar: boolean;
	initials: string;
}

export function AvatarUpload({ hasAvatar, initials }: AvatarUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [preview, setPreview] = useState<{ url: string; file: File } | null>(
		null,
	);
	const [showPreviewDialog, setShowPreviewDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const cleanupPreview = useCallback(() => {
		if (preview?.url) {
			URL.revokeObjectURL(preview.url);
		}
		setPreview(null);
	}, [preview?.url]);

	const processFile = useCallback(
		(file: File) => {
			if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
				toast.error("Invalid file type", {
					description: "Please upload a JPEG, PNG, WebP, or GIF image.",
				});
				return;
			}

			if (file.size > MAX_FILE_SIZE) {
				toast.error("File too large", {
					description: "Please upload an image smaller than 5MB.",
				});
				return;
			}

			if (preview?.url) {
				URL.revokeObjectURL(preview.url);
			}

			const objectUrl = URL.createObjectURL(file);
			setPreview({ url: objectUrl, file });
			setShowPreviewDialog(true);
		},
		[preview?.url],
	);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			e.target.value = "";
			if (file) processFile(file);
		},
		[processFile],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) processFile(file);
		},
		[processFile],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleUpload = async () => {
		if (!preview?.file) return;

		setIsUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", preview.file);

			const result = await uploadAvatar(formData);

			if (result.success) {
				toast.success("Avatar updated", {
					description: "Your profile picture has been updated successfully.",
				});
				setShowPreviewDialog(false);
				cleanupPreview();
			} else {
				toast.error("Upload failed", { description: result.error });
			}
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const result = await deleteAvatar();

			if (result.success) {
				toast.success("Avatar removed", {
					description: "Your profile picture has been removed.",
				});
				setShowDeleteDialog(false);
			} else {
				toast.error("Delete failed", { description: result.error });
			}
		} catch {
			toast.error("Something went wrong. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	const handlePreviewOpenChange = (open: boolean) => {
		if (!open && !isUploading) {
			setShowPreviewDialog(false);
			cleanupPreview();
		}
	};

	const handleDeleteOpenChange = (open: boolean) => {
		if (!open && !isDeleting) {
			setShowDeleteDialog(false);
		}
	};

	const isBusy = isUploading || isDeleting;

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept={ACCEPTED_IMAGE_TYPES.join(",")}
				onChange={handleFileChange}
				className="hidden"
				aria-label="Select avatar image"
			/>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						size="icon"
						variant="secondary"
						className={cn(
							"absolute bottom-0 right-0 h-9 w-9 rounded-full",
							"shadow-lg border border-border/50",
							"bg-background hover:bg-accent",
							"transition-all duration-200",
							"hover:scale-110 active:scale-95",
						)}
						disabled={isBusy}
					>
						{isBusy ?
							<Loader2 className="h-4 w-4 animate-spin" />
						:	<Camera className="h-4 w-4" />}
						<span className="sr-only">Change avatar</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={() => fileInputRef.current?.click()}
						className="cursor-pointer"
					>
						<Upload className="h-4 w-4 mr-2" />
						Upload photo
					</DropdownMenuItem>
					{hasAvatar && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setShowDeleteDialog(true)}
								className="text-destructive focus:text-destructive cursor-pointer"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Remove photo
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Upload Preview Dialog */}
			<Dialog open={showPreviewDialog} onOpenChange={handlePreviewOpenChange}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Update Profile Picture</DialogTitle>
						<DialogDescription>
							Preview your new avatar before uploading.
						</DialogDescription>
					</DialogHeader>

					<div
						className={cn(
							"flex flex-col items-center gap-4 py-6 rounded-lg transition-colors",
							isDragging &&
								"bg-primary/5 border-2 border-dashed border-primary/50",
						)}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
					>
						<div className="relative">
							<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/30 rounded-full blur opacity-25" />
							<Avatar className="relative h-36 w-36 border-2 border-border shadow-xl">
								{preview?.url && (
									<AvatarImage src={preview.url} alt="Avatar preview" />
								)}
								<AvatarFallback className="text-4xl bg-muted">
									{initials}
								</AvatarFallback>
							</Avatar>
						</div>

						{preview?.file && (
							<div className="text-center space-y-1">
								<p className="text-sm font-medium truncate max-w-[200px]">
									{preview.file.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{(preview.file.size / (1024 * 1024)).toFixed(2)} MB
								</p>
							</div>
						)}

						<p className="text-xs text-muted-foreground">
							Drop a new image here to replace
						</p>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => handlePreviewOpenChange(false)}
							disabled={isUploading}
						>
							Cancel
						</Button>
						<Button type="button" onClick={handleUpload} disabled={isUploading}>
							{isUploading ?
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Uploading…
								</>
							:	<>
									<Upload className="h-4 w-4 mr-2" />
									Upload
								</>
							}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={handleDeleteOpenChange}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Profile Picture</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove your profile picture? Your
							initials will be shown instead.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => handleDeleteOpenChange(false)}
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
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Removing…
								</>
							:	"Remove"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
