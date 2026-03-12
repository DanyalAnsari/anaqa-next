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
import { Badge } from "@/components/ui/badge";
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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
	Bell,
	Trash2,
	Clock,
	Loader2,
} from "lucide-react";
import { markNotified, deleteWaitlistEntry } from "../_actions/waitlist";
import type { WaitlistItem } from "../_lib/data";
import type { ColumnDef } from "@tanstack/react-table";

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

const columns: ColumnDef<WaitlistItem>[] = [
	{
		accessorKey: "email",
		header: "Customer",
		cell: ({ row }) => (
			<div>
				<p className="font-medium">{row.original.email}</p>
				{row.original.userName && (
					<p className="text-xs text-muted-foreground">
						{row.original.userName}
					</p>
				)}
			</div>
		),
	},
	{
		accessorKey: "productName",
		header: "Product",
		cell: ({ row }) => <span>{row.original.productName}</span>,
	},
	{
		accessorKey: "variantSize",
		header: "Size",
		cell: ({ row }) => (
			<Badge variant="outline">{row.original.variantSize}</Badge>
		),
	},
	{
		accessorKey: "notified",
		header: "Status",
		cell: ({ row }) =>
			row.original.notified ?
				<Badge variant="default">Notified</Badge>
			:	<Badge variant="secondary">Waiting</Badge>,
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{formatDate(row.original.createdAt)}
			</span>
		),
	},
];

interface Props {
	items: WaitlistItem[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export function WaitlistTable({
	items,
	total,
	page,
	pageSize,
	totalPages,
}: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [loading, setLoading] = useState<string | null>(null);

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
			const r = await action();
			if (r.success) {
				toast.success(msg);
				router.refresh();
			} else toast.error(r.error);
		} catch {
			toast.error("Action failed");
		} finally {
			setLoading(null);
		}
	}

	const table = useReactTable({
		data: items,
		columns: [
			...columns,
			{
				id: "actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								disabled={loading === row.original.id}
							>
								{loading === row.original.id ?
									<Loader2 className="h-4 w-4 animate-spin" />
								:	<MoreHorizontal className="h-4 w-4" />}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{!row.original.notified && (
								<DropdownMenuItem
									onClick={() =>
										handleAction(
											row.original.id,
											() => markNotified(row.original.id),
											"Marked as notified",
										)
									}
								>
									<Bell className="h-4 w-4 mr-2" />
									Mark Notified
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								onClick={() =>
									handleAction(
										row.original.id,
										() => deleteWaitlistEntry(row.original.id),
										"Entry deleted",
									)
								}
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

	return (
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
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="pending">Waiting</SelectItem>
						<SelectItem value="notified">Notified</SelectItem>
					</SelectContent>
				</Select>
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
									<Clock className="h-8 w-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
									<p className="text-muted-foreground">No waitlist entries</p>
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
	);
}
