import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Package,
	Truck,
	MapPin,
	CreditCard,
	ArrowLeft,
	ChevronRight,
	MessageSquare,
	Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "../_components/order-status-badge";
import { db } from "@/database";
import { orderItem, orderStatusHistory, shopOrder } from "@/database/schemas";

interface OrderDetailPageProps {
	params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({
	params,
}: OrderDetailPageProps) {
	const { orderId } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) return null;

	// Fetch order with ownership check
	const [order] = await db
		.select()
		.from(shopOrder)
		.where(
			and(eq(shopOrder.id, orderId), eq(shopOrder.userId, session.user.id)),
		)
		.limit(1);

	if (!order) {
		notFound();
	}

	// Fetch order items
	const items = await db
		.select()
		.from(orderItem)
		.where(eq(orderItem.orderId, orderId));

	// Fetch status history
	const statusHistory = await db
		.select()
		.from(orderStatusHistory)
		.where(eq(orderStatusHistory.orderId, orderId))
		.orderBy(asc(orderStatusHistory.occurredAt));

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Breadcrumb + Header */}
			<div className="space-y-4">
				<nav className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link
						href="/account/orders"
						className="hover:text-foreground transition-colors"
					>
						Orders
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-foreground font-medium">
						{order.orderNumber}
					</span>
				</nav>

				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
						<OrderStatusBadge status={order.status} />
					</div>
					<Button variant="outline" size="sm" asChild className="gap-2">
						<Link href="/contact">
							<MessageSquare className="h-4 w-4" />
							Need Help?
						</Link>
					</Button>
				</div>
			</div>

			{/* Info Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<Package className="h-4 w-4" />
							<span className="text-xs font-medium uppercase tracking-wider">
								Order
							</span>
						</div>
						<p className="font-mono font-semibold text-sm">
							{order.orderNumber}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{new Date(order.createdAt).toLocaleDateString("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</p>
					</CardContent>
				</Card>

				<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<Truck className="h-4 w-4" />
							<span className="text-xs font-medium uppercase tracking-wider">
								Shipping
							</span>
						</div>
						<p className="font-semibold text-sm capitalize">
							{order.shippingMethod}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{order.status === "shipped" ?
								"On its way"
							: order.status === "delivered" ?
								"Delivered"
							:	"Processing"}
						</p>
					</CardContent>
				</Card>

				<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<CreditCard className="h-4 w-4" />
							<span className="text-xs font-medium uppercase tracking-wider">
								Payment
							</span>
						</div>
						<p className="font-semibold text-sm">
							{order.paymentMethod === "cod" ?
								"Cash on Delivery"
							:	"Credit Card"}
						</p>
						<p className="text-xs text-muted-foreground mt-1 capitalize">
							{order.paymentStatus}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Items + Timeline */}
				<div className="lg:col-span-2 space-y-8">
					{/* Order Items */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-3 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-lg font-medium">
								Items ({items.length})
							</CardTitle>
						</CardHeader>
						<CardContent className="p-0">
							<div className="divide-y divide-border/50">
								{items.map((item) => (
									<div
										key={item.id}
										className="flex gap-4 p-4 hover:bg-accent/20 transition-colors"
									>
										<div className="w-16 h-20 bg-secondary/30 rounded-lg overflow-hidden shrink-0">
											{item.imageUrl ?
												<Image
													src={item.imageUrl}
													alt={item.title}
													width={64}
													height={80}
													className="w-full h-full object-cover"
												/>
											:	<div className="w-full h-full flex items-center justify-center">
													<Package className="h-6 w-6 text-muted-foreground/20" />
												</div>
											}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-sm">{item.title}</p>
											<p className="text-xs text-muted-foreground mt-0.5">
												Size: {item.sizeLabel} · SKU: {item.variantSku}
											</p>
											<p className="text-xs text-muted-foreground">
												Qty: {item.quantity} ×{" "}
												{formatPrice(Number(item.unitPrice))}
											</p>
										</div>
										<div className="text-right shrink-0">
											<p className="font-semibold text-sm">
												{formatPrice(Number(item.totalPrice))}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Status Timeline */}
					{statusHistory.length > 0 && (
						<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
							<CardHeader className="pb-3 border-b border-border/10 bg-muted/30">
								<CardTitle className="text-lg font-medium flex items-center gap-2">
									<Clock className="h-5 w-5 text-primary" />
									Order Timeline
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4">
								<div className="relative">
									<div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
									<div className="space-y-6">
										{statusHistory.map((entry, idx) => (
											<div
												key={entry.id}
												className="relative flex gap-4 items-start"
											>
												<div
													className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
														idx === statusHistory.length - 1 ?
															"border-primary bg-primary/10"
														:	"border-border bg-background"
													}`}
												>
													<div
														className={`h-2 w-2 rounded-full ${
															idx === statusHistory.length - 1 ?
																"bg-primary"
															:	"bg-muted-foreground/50"
														}`}
													/>
												</div>
												<div className="flex-1 min-w-0 pb-1">
													<div className="flex items-center gap-2">
														<OrderStatusBadge
															status={entry.status}
															showIcon={false}
														/>
														<span className="text-xs text-muted-foreground">
															{new Date(entry.occurredAt).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	hour: "2-digit",
																	minute: "2-digit",
																},
															)}
														</span>
													</div>
													{entry.note && (
														<p className="text-sm text-muted-foreground mt-1">
															{entry.note}
														</p>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Customer Note */}
					{order.customerNote && (
						<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
							<CardHeader className="pb-3 border-b border-border/10 bg-muted/30">
								<CardTitle className="text-lg font-medium flex items-center gap-2">
									<MessageSquare className="h-5 w-5 text-primary" />
									Order Notes
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4">
								<p className="text-sm text-muted-foreground leading-relaxed">
									{order.customerNote}
								</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar — Summary + Address */}
				<div className="space-y-6">
					{/* Order Summary */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-3 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-lg font-medium">
								Order Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4">
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subtotal</span>
									<span>{formatPrice(Number(order.subtotal))}</span>
								</div>
								{Number(order.discount) > 0 && (
									<div className="flex justify-between text-green-600">
										<span className="flex items-center gap-1">
											Discount
											{order.couponCode && (
												<code className="text-xs bg-green-500/10 px-1.5 py-0.5 rounded">
													{order.couponCode}
												</code>
											)}
										</span>
										<span>-{formatPrice(Number(order.discount))}</span>
									</div>
								)}
								<div className="flex justify-between">
									<span className="text-muted-foreground">Shipping</span>
									<span>
										{Number(order.shipping) === 0 ?
											"Free"
										:	formatPrice(Number(order.shipping))}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">VAT</span>
									<span>{formatPrice(Number(order.tax))}</span>
								</div>
								<Separator />
								<div className="flex justify-between font-semibold text-base pt-1">
									<span>Total</span>
									<span>{formatPrice(Number(order.total))}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Shipping Address */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-3 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-lg font-medium flex items-center gap-2">
								<MapPin className="h-5 w-5 text-primary" />
								Shipping Address
							</CardTitle>
						</CardHeader>
						<CardContent className="p-4">
							<div className="text-sm space-y-1">
								<p className="font-semibold">{order.shippingFullName}</p>
								<p className="text-muted-foreground">{order.shippingStreet}</p>
								<p className="text-muted-foreground">
									{order.shippingCity}, {order.shippingState}{" "}
									{order.shippingPostalCode}
								</p>
								<p className="text-muted-foreground">{order.shippingCountry}</p>
								<p className="text-muted-foreground pt-1">
									{order.shippingPhone}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Back Button */}
					<Button variant="ghost" className="w-full gap-2" asChild>
						<Link href="/account/orders">
							<ArrowLeft className="h-4 w-4" />
							Back to Orders
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
