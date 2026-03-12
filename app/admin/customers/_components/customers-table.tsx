"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
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
import { ChevronLeft, ChevronRight, Search, Users, X } from "lucide-react";
import { columns } from "./columns";
import type { Customer } from "../_lib/data";

interface CustomersTableProps {
	customers: Customer[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export function CustomersTable({
	customers,
	total,
	page,
	pageSize,
	totalPages,
}: CustomersTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const table = useReactTable({
		data: customers,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	function updateParams(updates: Record<string, string | undefined>) {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(updates).forEach(([key, value]) => {
			if (value === undefined || value === "" || value === "all") {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});
		if (!("page" in updates)) params.delete("page");
		startTransition(() => router.push(`?${params.toString()}`));
	}

	function clearFilters() {
		startTransition(() => router.push("/admin/customers"));
	}

	const search = searchParams.get("search") ?? "";
	const status = searchParams.get("status") ?? "all";
	const role = searchParams.get("role") ?? "all";
	const hasFilters = search || status !== "all" || role !== "all";

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by email..."
						defaultValue={search}
						onChange={(e) => {
							const value = e.target.value;
							const timeout = setTimeout(
								() => updateParams({ search: value }),
								400,
							);
							return () => clearTimeout(timeout);
						}}
						className="pl-9"
					/>
				</div>
				<Select
					value={status}
					onValueChange={(v) => updateParams({ status: v })}
				>
					<SelectTrigger className="w-full sm:w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="banned">Banned</SelectItem>
					</SelectContent>
				</Select>
				<Select value={role} onValueChange={(v) => updateParams({ role: v })}>
					<SelectTrigger className="w-full sm:w-36">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						<SelectItem value="customer">Customer</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
					</SelectContent>
				</Select>
				{hasFilters && (
					<Button variant="ghost" size="icon" onClick={clearFilters}>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Table */}
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
									colSpan={columns.length}
									className="h-32 text-center"
								>
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<Users className="h-8 w-8 opacity-50" />
										<p>No customers found</p>
										{hasFilters && (
											<Button variant="link" size="sm" onClick={clearFilters}>
												Clear filters
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{total > 0 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						Showing {(page - 1) * pageSize + 1}-
						{Math.min(page * pageSize, total)} of {total}
					</p>
					{totalPages > 1 && (
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
					)}
				</div>
			)}
		</div>
	);
}
