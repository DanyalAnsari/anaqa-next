"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil } from "lucide-react";
import type { Order } from "../_lib/data";

const statusVariants: Record<
	Order["status"],
	"default" | "secondary" | "destructive" | "outline"
> = {
	pending: "secondary",
	confirmed: "outline",
	processing: "outline",
	shipped: "default",
	delivered: "default",
	cancelled: "destructive",
};

const paymentVariants: Record<
	Order["paymentStatus"],
	"default" | "secondary" | "destructive" | "outline"
> = {
	pending: "secondary",
	paid: "default",
	failed: "destructive",
	refunded: "outline",
};

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "orderNumber",
		header: "Order",
		cell: ({ row }) => (
			<Link
				href={`/admin/orders/${row.original.id}`}
				className="font-medium hover:underline"
			>
				{row.getValue("orderNumber")}
			</Link>
		),
	},
	{
		accessorKey: "customerName",
		header: "Customer",
		cell: ({ row }) => (
			<div>
				<p className="font-medium">{row.original.customerName}</p>
				<p className="text-xs text-muted-foreground">
					{row.original.customerEmail}
				</p>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Date",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{formatDate(row.getValue("createdAt"))}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge
				variant={statusVariants[row.original.status]}
				className="capitalize"
			>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "paymentStatus",
		header: "Payment",
		cell: ({ row }) => (
			<Badge
				variant={paymentVariants[row.original.paymentStatus]}
				className="capitalize"
			>
				{row.original.paymentStatus}
			</Badge>
		),
	},
	{
		accessorKey: "itemsCount",
		header: "Items",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{row.getValue("itemsCount")}
			</span>
		),
	},
	{
		accessorKey: "total",
		header: () => <div className="text-right">Total</div>,
		cell: ({ row }) => (
			<div className="text-right font-medium">
				{formatCurrency(row.getValue("total"))}
			</div>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link href={`/admin/orders/${row.original.id}`}>
							<Eye className="h-4 w-4 mr-2" />
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/admin/orders/${row.original.id}/edit`}>
							<Pencil className="h-4 w-4 mr-2" />
							Edit
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
