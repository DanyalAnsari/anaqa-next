"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Search, Eye, ShoppingBag, ArrowRight, Package, X } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "./order-status-badge";

type OrderStatus =
	| "pending"
	| "confirmed"
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";

interface OrderItem {
	orderId: string;
	title: string;
	sizeLabel: string;
	imageUrl: string | null;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
}

interface Order {
	id: string;
	orderNumber: string;
	status: OrderStatus;
	paymentStatus: string;
	paymentMethod: string;
	subtotal: number;
	shipping: number;
	discount: number;
	tax: number;
	total: number;
	createdAt: Date;
	items: OrderItem[];
}

const ORDER_STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
	{ value: "all", label: "All Statuses" },
	{ value: "pending", label: "Pending" },
	{ value: "confirmed", label: "Confirmed" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

interface OrdersClientProps {
	orders: Order[];
}

export function OrdersClient({ orders }: OrdersClientProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const q = searchQuery.toLowerCase();
			const matchesSearch =
				!q ||
				order.orderNumber.toLowerCase().includes(q) ||
				order.items.some((item) => item.title.toLowerCase().includes(q));

			const matchesStatus =
				statusFilter === "all" || order.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [orders, searchQuery, statusFilter]);

	const hasFilters = searchQuery !== "" || statusFilter !== "all";

	const clearFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
	};

	if (orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-secondary/20">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
					<ShoppingBag className="h-8 w-8 text-primary" />
				</div>
				<h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
				<p className="text-muted-foreground mb-6 max-w-sm">
					When you place an order, it will appear here.
				</p>
				<Button asChild className="gap-2">
					<Link href="/shop">
						Start Shopping
						<ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by order number or product..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-background/50"
					/>
					{searchQuery && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
							onClick={() => setSearchQuery("")}
						>
							<X className="h-3.5 w-3.5" />
						</Button>
					)}
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-48 bg-background/50">
						<SelectValue placeholder="All statuses" />
					</SelectTrigger>
					<SelectContent>
						{ORDER_STATUS_OPTIONS.map((status) => (
							<SelectItem key={status.value} value={status.value}>
								{status.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Results Info */}
			{hasFilters && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-muted-foreground">
						{filteredOrders.length} of {orders.length} orders
					</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="text-xs gap-1"
					>
						<X className="h-3 w-3" />
						Clear filters
					</Button>
				</div>
			)}

			{filteredOrders.length === 0 ?
				<div className="text-center py-12 border border-dashed rounded-xl">
					<Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
					<p className="text-muted-foreground text-sm">
						No orders match your search.
					</p>
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="mt-2"
					>
						Clear filters
					</Button>
				</div>
			:	<>
					{/* Desktop Table */}
					<div className="hidden md:block">
						<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow className="bg-muted/30 hover:bg-muted/30">
										<TableHead className="font-semibold">Order</TableHead>
										<TableHead className="font-semibold">Date</TableHead>
										<TableHead className="font-semibold">Status</TableHead>
										<TableHead className="font-semibold">Items</TableHead>
										<TableHead className="text-right font-semibold">
											Total
										</TableHead>
										<TableHead className="w-16"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredOrders.map((order) => (
										<TableRow key={order.id} className="group cursor-pointer">
											<TableCell>
												<Link
													href={`/account/orders/${order.id}`}
													className="font-semibold text-sm hover:text-primary transition-colors"
												>
													{order.orderNumber}
												</Link>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{new Date(order.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</TableCell>
											<TableCell>
												<OrderStatusBadge status={order.status} />
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{order.items.length}{" "}
												{order.items.length === 1 ? "item" : "items"}
											</TableCell>
											<TableCell className="text-right font-semibold text-sm">
												{formatPrice(order.total)}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													asChild
													className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<Link href={`/account/orders/${order.id}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Card>
					</div>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-3">
						{filteredOrders.map((order) => (
							<Link
								key={order.id}
								href={`/account/orders/${order.id}`}
								className="block"
							>
								<Card
									className={cn(
										"transition-all duration-200",
										"border-border/50 bg-background/50 backdrop-blur-sm",
										"hover:border-primary/30 hover:shadow-sm",
										"active:scale-[0.99]",
									)}
								>
									<CardContent className="p-4">
										<div className="flex items-start justify-between mb-3">
											<div>
												<p className="font-semibold text-sm">
													{order.orderNumber}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{new Date(order.createdAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
												</p>
											</div>
											<OrderStatusBadge status={order.status} />
										</div>

										<div className="flex items-center gap-3">
											{order.items[0]?.imageUrl ?
												<div className="w-12 h-14 bg-secondary/30 rounded-lg overflow-hidden shrink-0">
													<Image
														src={order.items[0].imageUrl}
														alt={order.items[0].title}
														width={48}
														height={56}
														className="w-full h-full object-cover"
													/>
												</div>
											:	<div className="w-12 h-14 bg-secondary/30 rounded-lg flex items-center justify-center shrink-0">
													<Package className="h-5 w-5 text-muted-foreground/30" />
												</div>
											}
											<div className="flex-1 min-w-0">
												<p className="text-sm truncate">
													{order.items[0]?.title ?? "Unknown Product"}
												</p>
												{order.items.length > 1 && (
													<p className="text-xs text-muted-foreground">
														+{order.items.length - 1} more{" "}
														{order.items.length - 1 === 1 ? "item" : "items"}
													</p>
												)}
											</div>
											<p className="font-semibold text-sm shrink-0">
												{formatPrice(order.total)}
											</p>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</>
			}
		</div>
	);
}
