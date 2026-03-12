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
import { MoreHorizontal, Edit, Eye, Package } from "lucide-react";
import type { ProductListItem } from "../_lib/data";

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "SAR",
	}).format(amount);
}

export const columns: ColumnDef<ProductListItem>[] = [
	{
		accessorKey: "name",
		header: "Product",
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-md border bg-secondary shrink-0 flex items-center justify-center overflow-hidden">
					{row.original.primaryImage ?
						<img
							src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:w-80,h-80,c-force/${row.original.primaryImage}`}
							alt=""
							className="w-full h-full object-cover"
						/>
					:	<Package className="h-4 w-4 text-muted-foreground" />}
				</div>
				<div className="min-w-0">
					<p className="font-medium truncate max-w-50">{row.original.name}</p>
					{row.original.isFeatured && (
						<Badge variant="outline" className="text-xs">
							Featured
						</Badge>
					)}
				</div>
			</div>
		),
	},
	{
		accessorKey: "categoryName",
		header: "Category",
		cell: ({ row }) => (
			<span className="text-muted-foreground capitalize">
				{row.original.categoryName}
			</span>
		),
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({ row }) => (
			<div>
				<p className="font-medium">{formatCurrency(row.original.price)}</p>
				{row.original.comparePrice && (
					<p className="text-xs text-muted-foreground line-through">
						{formatCurrency(row.original.comparePrice)}
					</p>
				)}
			</div>
		),
	},
	{
		accessorKey: "totalStock",
		header: "Stock",
		cell: ({ row }) => {
			const stock = row.original.totalStock;
			return (
				<span
					className={
						stock === 0 ? "text-red-500"
						: stock < 10 ?
							"text-yellow-600"
						:	"text-green-600"
					}
				>
					{stock} units
				</span>
			);
		},
	},
	{
		accessorKey: "soldCount",
		header: "Sold",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.original.soldCount}</span>
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
					<DropdownMenuItem asChild>
						<Link href={`/admin/products/${row.original.id}/edit`}>
							<Edit className="h-4 w-4 mr-2" />
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/products/${row.original.slug}`} target="_blank">
							<Eye className="h-4 w-4 mr-2" />
							View in Store
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
