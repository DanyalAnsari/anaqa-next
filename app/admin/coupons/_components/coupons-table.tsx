"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	ChevronLeft,
	ChevronRight,
	Search,
	MoreHorizontal,
	Edit,
	Trash2,
	Ticket,
	X,
	Loader2,
} from "lucide-react";
import { columns } from "./columns";
import { CouponFormDialog } from "./coupon-form-dialog";
import { deleteCoupon, toggleCouponActive } from "../_actions/coupons";
import type { CouponItem } from "../_lib/data";

interface Props {
	coupons: CouponItem[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export function CouponsTable({
	coupons,
	total,
	page,
	pageSize,
	totalPages,
}: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [editItem, setEditItem] = useState<CouponItem | null>(null);
	const [deleteItem, setDeleteItem] = useState<CouponItem | null>(null);
	const [loading, setLoading] = useState(false);

	function updateParams(updates: Record<string, string | undefined>) {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(updates).forEach(([k, v]) => {
			if (!v || v === "all") params.delete(k);
			else params.set(k, v);
		});
		if (!("page" in updates)) params.delete("page");
		startTransition(() => router.push(`?${params.toString()}`));
	}

	const search = searchParams.get("search") ?? "";
	const status = searchParams.get("status") ?? "all";
	const hasFilters = search || status !== "all";

	const table = useReactTable({
		data: coupons,
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
									const r = await toggleCouponActive(
										row.original.id,
										!row.original.isActive,
									);
									if (r.success) {
										toast.success(
											row.original.isActive ? "Deactivated" : "Activated",
										);
										router.refresh();
									} else toast.error(r.error);
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
		const r = await deleteCoupon(deleteItem.id);
		if (r.success) {
			toast.success("Coupon deleted");
			setDeleteItem(null);
			router.refresh();
		} else toast.error(r.error);
		setLoading(false);
	}

	return (
		<>
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search coupon code..."
							defaultValue={search}
							onChange={(e) => {
								const v = e.target.value;
								const t = setTimeout(() => updateParams({ search: v }), 400);
								return () => clearTimeout(t);
							}}
							className="pl-9"
						/>
					</div>
					<Select
						value={status}
						onValueChange={(v) => updateParams({ status: v })}
					>
						<SelectTrigger className="w-full sm:w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
							<SelectItem value="expired">Expired</SelectItem>
						</SelectContent>
					</Select>
					{hasFilters && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() =>
								startTransition(() => router.push("/admin/coupons"))
							}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

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
									<TableRow
										key={row.id}
										className={isPending ? "opacity-50" : ""}
									>
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
										<Ticket className="h-8 w-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
										<p className="text-muted-foreground">No coupons found</p>
									</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>
				</div>

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

			{editItem && (
				<CouponFormDialog
					open={!!editItem}
					onOpenChange={(o) => !o && setEditItem(null)}
					coupon={editItem}
				/>
			)}

			<AlertDialog
				open={!!deleteItem}
				onOpenChange={(o) => !o && setDeleteItem(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Coupon</AlertDialogTitle>
						<AlertDialogDescription>
							Delete coupon <strong>{deleteItem?.code}</strong>?
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
