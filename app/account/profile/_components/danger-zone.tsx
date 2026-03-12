// app/account/profile/_components/danger-zone.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DangerZone() {
	const [isDeleting, setIsDeleting] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const [open, setOpen] = useState(false);

	const handleDelete = async () => {
		if (confirmText !== "DELETE") return;

		setIsDeleting(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsDeleting(false);
		setOpen(false);
		toast.info("Account deletion coming soon!");
	};

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
			<div className="flex items-start gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
					<AlertTriangle className="h-5 w-5 text-destructive" />
				</div>
				<div className="space-y-1">
					<p className="font-semibold text-sm">Delete Account</p>
					<p className="text-sm text-muted-foreground">
						Permanently delete your account and all associated data. This action
						cannot be undone.
					</p>
				</div>
			</div>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger asChild>
					<Button variant="destructive" size="sm" className="shrink-0 gap-2">
						<Trash2 className="h-4 w-4" />
						Delete Account
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-destructive" />
							Delete Account
						</AlertDialogTitle>
						<AlertDialogDescription className="space-y-3">
							<p>
								This action <strong>cannot be undone</strong>. This will
								permanently delete your account and remove all your data from
								our servers, including:
							</p>
							<ul className="list-disc list-inside space-y-1 text-sm">
								<li>Your profile and settings</li>
								<li>Order history and receipts</li>
								<li>Saved addresses and payment methods</li>
								<li>Reviews and wishlist items</li>
							</ul>
						</AlertDialogDescription>
					</AlertDialogHeader>

					<div className="space-y-2 py-2">
						<Label htmlFor="confirm" className="text-sm">
							Type <span className="font-mono font-semibold">DELETE</span> to
							confirm
						</Label>
						<Input
							id="confirm"
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
							placeholder="DELETE"
							className="font-mono"
						/>
					</div>

					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setOpen(false);
								setConfirmText("");
							}}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting || confirmText !== "DELETE"}
						>
							{isDeleting ?
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Deleting…
								</>
							:	"Delete Account"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
