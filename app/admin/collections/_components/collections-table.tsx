"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { MoreHorizontal, Edit, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { columns } from "./columns";
import { CollectionFormDialog } from "./collection-form-dialog";
import {
	deleteCollection,
	toggleCollectionActive,
} from "../_actions/collections";
import type { CollectionItem } from "../_lib/data";

export function CollectionsTable({
	collections,
}: {
	collections: CollectionItem[];
}) {
	const router = useRouter();
	const [editItem, setEditItem] = useState<CollectionItem | null>(null);
	const [deleteItem, setDeleteItem] = useState<CollectionItem | null>(null);
	const [loading, setLoading] = useState(false);

	const table = useReactTable({
		data: collections,
		columns: [
			...columns,
			{
				id: "actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setEditItem(row.original)}>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={async () => {
									const result = await toggleCollectionActive(
										row.original.id,
										!row.original.isActive,
									);
									if (result.success) {
										toast.success(
											row.original.isActive ? "Deactivated" : "Activated",
										);
										router.refresh();
									} else toast.error(result.error);
								}}
							>
								{row.original.isActive ? "Deactivate" : "Activate"}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setDeleteItem(row.original)}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		getCoreRowModel: getCoreRowModel(),
	});

	async function handleDelete() {
		if (!deleteItem) return;
		setLoading(true);
		const result = await deleteCollection(deleteItem.id);
		if (result.success) {
			toast.success("Collection deleted");
			setDeleteItem(null);
			router.refresh();
		} else toast.error(result.error);
		setLoading(false);
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((hg) => (
							<TableRow key={hg.id}>
								{hg.headers.map((h) => (
									<TableHead key={h.id}>
										{h.isPlaceholder ? null : (
											flexRender(h.column.columnDef.header, h.getContext())
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ?
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						:	<TableRow>
								<TableCell
									colSpan={columns.length + 1}
									className="h-32 text-center"
								>
									<ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
									<p className="text-muted-foreground">No collections yet</p>
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>

			{editItem && (
				<CollectionFormDialog
					open={!!editItem}
					onOpenChange={(o) => !o && setEditItem(null)}
					collection={editItem}
				/>
			)}

			<AlertDialog
				open={!!deleteItem}
				onOpenChange={(o) => !o && setDeleteItem(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Collection</AlertDialogTitle>
						<AlertDialogDescription>
							Delete <strong>{deleteItem?.name}</strong>? Products will be
							unlinked.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteItem(null)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={loading}
						>
							{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
