"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { FolderTree, Package } from "lucide-react";
import type { CategoryItem } from "../_lib/data";

export const columns: ColumnDef<CategoryItem>[] = [
	{
		accessorKey: "name",
		header: "Category",
		cell: ({ row }) => (
			<div
				className="flex items-center gap-2"
				style={{ paddingLeft: `${row.original.level * 24}px` }}
			>
				<FolderTree className="h-4 w-4 text-muted-foreground shrink-0" />
				<div>
					<p className="font-medium">{row.original.name}</p>
					<p className="text-xs text-muted-foreground">/{row.original.slug}</p>
				</div>
			</div>
		),
	},
	{
		accessorKey: "parentName",
		header: "Parent",
		cell: ({ row }) => (
			<span className="text-muted-foreground">
				{row.original.parentName || "—"}
			</span>
		),
	},
	{
		accessorKey: "productCount",
		header: "Products",
		cell: ({ row }) => (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<Package className="h-3.5 w-3.5" />
				<span>{row.original.productCount}</span>
			</div>
		),
	},
	{
		accessorKey: "sortOrder",
		header: "Order",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.original.sortOrder}</span>
		),
	},
	{
		accessorKey: "isActive",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={row.original.isActive ? "default" : "secondary"}>
				{row.original.isActive ? "Active" : "Inactive"}
			</Badge>
		),
	},
];
