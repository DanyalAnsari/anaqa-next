// app/account/addresses/_components/address-card.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	MoreVertical,
	Pencil,
	Trash2,
	Star,
	Loader2,
	MapPin,
	Phone,
	User,
	Home,
	Building2,
	Briefcase,
	CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteAddress, setDefaultAddress } from "../actions";
import type { InferSelectModel } from "drizzle-orm";
import type { address } from "@/lib/db/schema";

type Address = InferSelectModel<typeof address>;

interface AddressCardProps {
	address: Address;
	onEdit: (address: Address) => void;
}

const labelIcons: Record<string, React.ElementType> = {
	home: Home,
	office: Building2,
	work: Briefcase,
};

export function AddressCard({ address: addr, onEdit }: AddressCardProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, startDeleteTransition] = useTransition();
	const [isSettingDefault, startDefaultTransition] = useTransition();

	const LabelIcon = labelIcons[addr.label.toLowerCase()] || MapPin;

	const handleDelete = () => {
		startDeleteTransition(async () => {
			const result = await deleteAddress(addr.id);
			if (result.success) {
				toast.success("Address deleted");
				setShowDeleteDialog(false);
			} else {
				toast.error(result.error);
			}
		});
	};

	const handleSetDefault = () => {
		startDefaultTransition(async () => {
			const result = await setDefaultAddress(addr.id);
			if (result.success) {
				toast.success("Default address updated");
			} else {
				toast.error(result.error);
			}
		});
	};

	const isBusy = isDeleting || isSettingDefault;

	return (
		<>
			<Card
				className={cn(
					"relative group transition-all duration-200",
					"border-border/50 bg-background/50 backdrop-blur-sm",
					"hover:border-primary/30 hover:shadow-sm",
					addr.isDefault && "border-primary/40 ring-1 ring-primary/10",
				)}
			>
				<CardContent className="p-5">
					{/* Top Row — Label + Badge + Actions */}
					<div className="flex items-start justify-between mb-4">
						<div className="flex items-center gap-2.5">
							<div
								className={cn(
									"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
									addr.isDefault ?
										"bg-primary/15 text-primary"
									:	"bg-secondary text-muted-foreground",
								)}
							>
								<LabelIcon className="h-4 w-4" />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<h3 className="font-semibold text-sm capitalize">
										{addr.label}
									</h3>
									{addr.isDefault && (
										<Badge
											variant="secondary"
											className="text-xs gap-1 bg-primary/10 text-primary border-primary/20"
										>
											<CheckCircle className="h-3 w-3" />
											Default
										</Badge>
									)}
								</div>
								<p className="text-xs text-muted-foreground mt-0.5">
									{addr.fullName}
								</p>
							</div>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
									disabled={isBusy}
								>
									{isBusy ?
										<Loader2 className="h-4 w-4 animate-spin" />
									:	<MoreVertical className="h-4 w-4" />}
									<span className="sr-only">Address actions</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-44">
								<DropdownMenuItem
									onClick={() => onEdit(addr)}
									className="cursor-pointer"
								>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								{!addr.isDefault && (
									<DropdownMenuItem
										onClick={handleSetDefault}
										disabled={isSettingDefault}
										className="cursor-pointer"
									>
										{isSettingDefault ?
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										:	<Star className="mr-2 h-4 w-4" />}
										Set as Default
									</DropdownMenuItem>
								)}
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

					{/* Address Details */}
					<div className="space-y-2 text-sm">
						<div className="flex items-start gap-2 text-muted-foreground">
							<MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
							<div>
								<p>{addr.street}</p>
								<p>
									{addr.city}, {addr.state} {addr.postalCode}
								</p>
								<p>{addr.country}</p>
							</div>
						</div>

						<div className="flex items-center gap-2 text-muted-foreground">
							<Phone className="h-3.5 w-3.5 shrink-0" />
							<p>{addr.phone}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Delete Confirmation */}
			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setShowDeleteDialog(false);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Address</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete the{" "}
							<span className="font-medium text-foreground capitalize">
								"{addr.label}"
							</span>{" "}
							address for{" "}
							<span className="font-medium text-foreground">
								{addr.fullName}
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
