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
import {
	MoreHorizontal,
	Edit,
	Trash2,
	FolderTree,
	Loader2,
} from "lucide-react";
import { columns } from "./columns";
import { CategoryFormDialog } from "./category-form-dialog";
import { deleteCategory, toggleCategoryActive } from "../_actions/categories";
import type { CategoryItem, CategoryOption } from "../_lib/data";

interface Props {
	categories: CategoryItem[];
	parentOptions: CategoryOption[];
}

export function CategoriesTable({ categories, parentOptions }: Props) {
	const router = useRouter();
	const [editCat, setEditCat] = useState<CategoryItem | null>(null);
	const [deleteCat, setDeleteCat] = useState<CategoryItem | null>(null);
	const [loading, setLoading] = useState(false);

	const table = useReactTable({
		data: categories,
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
							<DropdownMenuItem onClick={() => setEditCat(row.original)}>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={async () => {
									const result = await toggleCategoryActive(
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
								onClick={() => setDeleteCat(row.original)}
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
		if (!deleteCat) return;
		setLoading(true);
		const result = await deleteCategory(deleteCat.id);
		if (result.success) {
			toast.success("Category deleted");
			setDeleteCat(null);
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
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<FolderTree className="h-8 w-8 opacity-50" />
										<p>No categories yet</p>
									</div>
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>

			{editCat && (
				<CategoryFormDialog
					open={!!editCat}
					onOpenChange={(o) => !o && setEditCat(null)}
					category={editCat}
					parentOptions={parentOptions}
				/>
			)}

			<AlertDialog
				open={!!deleteCat}
				onOpenChange={(o) => !o && setDeleteCat(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Category</AlertDialogTitle>
						<AlertDialogDescription>
							Delete <strong>{deleteCat?.name}</strong>? This will fail if
							products or subcategories exist.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteCat(null)}
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
