"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Search,
	MoreHorizontal,
	UserCheck,
	UserX,
	Trash2,
	ChevronLeft,
	ChevronRight,
	Mail,
	Loader2,
} from "lucide-react";
import {
	unsubscribeUser,
	resubscribeUser,
	deleteSubscriber,
} from "../_actions/settings";
import type { SubscriberItem } from "../_lib/data";

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

const baseColumns: ColumnDef<SubscriberItem>[] = [
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => (
			<span className="font-medium">{row.original.email}</span>
		),
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={row.original.isActive ? "default" : "secondary"}>
				{row.original.isActive ? "Active" : "Unsubscribed"}
			</Badge>
		),
	},
	{
		accessorKey: "subscribedAt",
		header: "Subscribed",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{formatDate(row.original.subscribedAt)}
			</span>
		),
	},
];

interface Props {
	subscribers: SubscriberItem[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export function SubscribersTable({
	subscribers,
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

	const search = searchParams.get("search") ?? "";
	const status = searchParams.get("status") ?? "all";

	const table = useReactTable({
		data: subscribers,
		columns: [
			...baseColumns,
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
							{row.original.isActive ?
								<DropdownMenuItem
									onClick={() =>
										handleAction(
											row.original.id,
											() => unsubscribeUser(row.original.id),
											"Unsubscribed",
										)
									}
								>
									<UserX className="h-4 w-4 mr-2" />
									Unsubscribe
								</DropdownMenuItem>
							:	<DropdownMenuItem
									onClick={() =>
										handleAction(
											row.original.id,
											() => resubscribeUser(row.original.id),
											"Resubscribed",
										)
									}
								>
									<UserCheck className="h-4 w-4 mr-2" />
									Resubscribe
								</DropdownMenuItem>
							}
							<DropdownMenuItem
								onClick={() =>
									handleAction(
										row.original.id,
										() => deleteSubscriber(row.original.id),
										"Deleted",
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
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search email..."
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
						<SelectItem value="all">All</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="unsubscribed">Unsubscribed</SelectItem>
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
									colSpan={baseColumns.length + 1}
									className="h-32 text-center"
								>
									<Mail className="h-8 w-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
									<p className="text-muted-foreground">No subscribers found</p>
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
