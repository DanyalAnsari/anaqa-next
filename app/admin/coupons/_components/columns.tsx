"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CouponItem } from "../_lib/data";

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "SAR",
		minimumFractionDigits: 0,
	}).format(amount);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

export const columns: ColumnDef<CouponItem>[] = [
	{
		accessorKey: "code",
		header: "Code",
		cell: ({ row }) => (
			<code className="font-mono font-semibold bg-secondary px-2 py-1 rounded text-sm">
				{row.original.code}
			</code>
		),
	},
	{
		accessorKey: "discountValue",
		header: "Discount",
		cell: ({ row }) => (
			<span className="font-medium">
				{row.original.discountType === "percentage" ?
					`${row.original.discountValue}%`
				:	formatCurrency(row.original.discountValue)}
			</span>
		),
	},
	{
		accessorKey: "usedCount",
		header: "Usage",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{row.original.usedCount} / {row.original.usageLimit}
			</span>
		),
	},
	{
		accessorKey: "validUntil",
		header: "Expires",
		cell: ({ row }) => {
			const expired = new Date(row.original.validUntil) < new Date();
			return (
				<span
					className={expired ? "text-destructive" : "text-muted-foreground"}
				>
					{formatDate(row.original.validUntil)}
				</span>
			);
		},
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => {
			const expired = new Date(row.original.validUntil) < new Date();
			if (expired) return <Badge variant="destructive">Expired</Badge>;
			return (
				<Badge variant={row.original.isActive ? "default" : "secondary"}>
					{row.original.isActive ? "Active" : "Inactive"}
				</Badge>
			);
		},
	},
];
