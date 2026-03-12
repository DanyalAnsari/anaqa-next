import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ArrowRight, Eye, ShoppingBag } from "lucide-react";

const statusVariants: Record<
	string,
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
	string,
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
		currency: "SAR",
	}).format(amount);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

interface Order {
	id: string;
	orderNumber: string;
	status: string;
	paymentStatus: string;
	total: number;
	itemsCount: number;
	createdAt: Date;
}

export function CustomerOrders({
	orders,
	customerId,
}: {
	orders: Order[];
	customerId: string;
}) {
	if (orders.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
						<ShoppingBag className="h-8 w-8 opacity-50" />
						<p>No orders yet</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-lg">
					Recent Orders ({orders.length})
				</CardTitle>
				<Button asChild variant="ghost" size="sm">
					<Link href={`/admin/orders?userId=${customerId}`}>
						View all <ArrowRight className="ml-1 h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Payment</TableHead>
								<TableHead>Items</TableHead>
								<TableHead className="text-right">Total</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>
										<Link
											href={`/admin/orders/${order.id}`}
											className="font-medium hover:underline"
										>
											{order.orderNumber}
										</Link>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{formatDate(order.createdAt)}
									</TableCell>
									<TableCell>
										<Badge
											variant={statusVariants[order.status]}
											className="capitalize"
										>
											{order.status}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											variant={paymentVariants[order.paymentStatus]}
											className="capitalize"
										>
											{order.paymentStatus}
										</Badge>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{order.itemsCount}
									</TableCell>
									<TableCell className="text-right font-medium">
										{formatCurrency(order.total)}
									</TableCell>
									<TableCell>
										<Button
											asChild
											variant="ghost"
											size="icon"
											className="h-8 w-8"
										>
											<Link href={`/admin/orders/${order.id}`}>
												<Eye className="h-4 w-4" />
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
