"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Clock, ShoppingBag } from "lucide-react";
import { UserActions } from "./user-actions";
import type { Customer } from "../_lib/data";

function getInitials(name: string, email: string) {
	if (name) {
		const parts = name.split(" ");
		return parts.length >= 2 ?
				`${parts[0][0]}${parts[1][0]}`.toUpperCase()
			:	name.substring(0, 2).toUpperCase();
	}
	return email.substring(0, 2).toUpperCase();
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "SAR",
		minimumFractionDigits: 0,
	}).format(amount);
}

export const columns: ColumnDef<Customer>[] = [
	{
		accessorKey: "name",
		header: "Customer",
		cell: ({ row }) => {
			const customer = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-9 w-9">
						<AvatarImage
							src={customer.image ?? undefined}
							alt={customer.name}
						/>
						<AvatarFallback className="text-xs">
							{getInitials(customer.name, customer.email)}
						</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<div className="flex items-center gap-1.5">
							<p className="font-medium truncate">
								{customer.name || "Unnamed"}
							</p>
							{customer.emailVerified && (
								<ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
							)}
						</div>
						<p className="text-xs text-muted-foreground truncate">
							{customer.email}
						</p>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "phone",
		header: "Phone",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.original.phone || "—"}</span>
		),
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => (
			<Badge
				variant={row.original.role === "admin" ? "default" : "outline"}
				className="capitalize"
			>
				{row.original.role}
			</Badge>
		),
	},
	{
		accessorKey: "ordersCount",
		header: "Orders",
		cell: ({ row }) => (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<ShoppingBag className="h-3.5 w-3.5" />
				<span>{row.original.ordersCount}</span>
			</div>
		),
	},
	{
		accessorKey: "totalSpent",
		header: "Total Spent",
		cell: ({ row }) => (
			<span className="font-medium">
				{formatCurrency(row.original.totalSpent)}
			</span>
		),
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => (
			<div className="flex items-center gap-1.5 text-muted-foreground">
				<Clock className="h-3.5 w-3.5" />
				<span>{formatDate(row.original.createdAt)}</span>
			</div>
		),
	},
	{
		accessorKey: "banned",
		header: "Status",
		cell: ({ row }) => {
			const customer = row.original;
			if (customer.banned) {
				return <Badge variant="destructive">Banned</Badge>;
			}
			return <Badge variant="default">Active</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <UserActions customer={row.original} />,
	},
];
