"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Package } from "lucide-react";
import type { CollectionItem } from "../_lib/data";

export const columns: ColumnDef<CollectionItem>[] = [
	{
		accessorKey: "name",
		header: "Collection",
		cell: ({ row }) => (
			<div className="flex items-center gap-3">
				<div className="w-12 h-12 rounded-md border bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
					{row.original.imageFilePath ?
						<img
							src={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:w-96,h-96,c-force/${row.original.imageFilePath}`}
							alt=""
							className="w-full h-full object-cover"
						/>
					:	<ImageIcon className="h-4 w-4 text-muted-foreground" />}
				</div>
				<div>
					<p className="font-medium">{row.original.name}</p>
					<p className="text-xs text-muted-foreground">/{row.original.slug}</p>
				</div>
			</div>
		),
	},
	{
		accessorKey: "productCount",
		header: "Products",
		cell: ({ row }) => (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<Package className="h-3.5 w-3.5" />
				{row.original.productCount}
			</div>
		),
	},
	{
		accessorKey: "isFeatured",
		header: "Featured",
		cell: ({ row }) =>
			row.original.isFeatured ?
				<Badge variant="outline">Featured</Badge>
			:	<span className="text-muted-foreground">—</span>,
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
