import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { getOrderById, VALID_TRANSITIONS } from "../_lib/data";
import { OrderTimeline } from "../_components/order-timeline";
import { UpdateStatusForm } from "../_components/update-status-form";

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

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "SAR",
	}).format(amount);
}

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
	const { id } = await params;
	const order = await getOrderById(id);
	if (!order) notFound();

	const transitions = VALID_TRANSITIONS[order.status] ?? [];

	return (
		<div className="max-w-5xl space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/orders">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div className="flex items-center gap-3">
					<h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
					<Badge variant={statusVariants[order.status]} className="capitalize">
						{order.status}
					</Badge>
					{order.paymentMethod === "cod" && (
						<Badge variant="outline">COD</Badge>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					{/* Items */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								Items ({order.items.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{order.items.map((item) => (
									<div key={item.id} className="flex gap-4">
										<div className="h-16 w-16 bg-secondary rounded-md overflow-hidden shrink-0">
											{item.imageUrl ?
												<img
													src={item.imageUrl}
													alt={item.title}
													className="w-full h-full object-cover"
												/>
											:	<div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
													N/A
												</div>
											}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium text-sm truncate">
												{item.title}
											</p>
											<p className="text-xs text-muted-foreground">
												Size: {item.sizeLabel}
											</p>
											<p className="text-xs text-muted-foreground">
												{formatCurrency(item.unitPrice)} × {item.quantity}
											</p>
										</div>
										<div className="text-right">
											<p className="font-medium text-sm">
												{formatCurrency(item.totalPrice)}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<Separator />
						<CardFooter className="flex flex-col items-end gap-2 pt-6">
							{[
								["Subtotal", order.subtotal],
								["Shipping", order.shipping],
								["Discount", -order.discount],
								["Tax", order.tax],
							].map(([label, amount]) => (
								<div
									key={label as string}
									className="flex justify-between w-full max-w-xs text-sm"
								>
									<span className="text-muted-foreground">
										{label as string}
									</span>
									<span>{formatCurrency(amount as number)}</span>
								</div>
							))}
							<Separator className="w-full max-w-xs my-1" />
							<div className="flex justify-between w-full max-w-xs text-base font-medium">
								<span>Total</span>
								<span>{formatCurrency(order.total)}</span>
							</div>
						</CardFooter>
					</Card>

					{/* Timeline */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Status Timeline</CardTitle>
						</CardHeader>
						<CardContent>
							<OrderTimeline entries={order.statusHistory} />
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					{/* Customer */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Customer</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{order.customer ?
								<div>
									<p className="font-medium">{order.customer.name}</p>
									<p className="text-sm text-muted-foreground">
										{order.customer.email}
									</p>
									{order.customer.phone && (
										<p className="text-sm text-muted-foreground">
											{order.customer.phone}
										</p>
									)}
								</div>
							:	<p className="text-sm text-muted-foreground">Unknown customer</p>
							}

							<Separator />

							<div>
								<h3 className="text-sm font-medium mb-2">Shipping Address</h3>
								<div className="text-sm text-muted-foreground space-y-0.5">
									<p className="text-foreground">{order.shippingFullName}</p>
									<p>{order.shippingStreet}</p>
									<p>
										{order.shippingCity}, {order.shippingState}{" "}
										{order.shippingPostalCode}
									</p>
									<p>{order.shippingCountry}</p>
									<p className="mt-1">{order.shippingPhone}</p>
								</div>
							</div>

							<Separator />

							<div>
								<h3 className="text-sm font-medium mb-2">Payment</h3>
								<p className="text-sm text-muted-foreground capitalize">
									Method: {order.paymentMethod}
								</p>
								<p className="text-sm text-muted-foreground capitalize">
									Status: {order.paymentStatus}
								</p>
							</div>

							{order.customerNote && (
								<>
									<Separator />
									<div>
										<h3 className="text-sm font-medium mb-1">Customer Note</h3>
										<p className="text-sm bg-secondary/30 p-2 rounded border text-muted-foreground">
											{order.customerNote}
										</p>
									</div>
								</>
							)}

							{order.couponCode && (
								<>
									<Separator />
									<div>
										<h3 className="text-sm font-medium mb-1">Coupon</h3>
										<Badge variant="outline">{order.couponCode}</Badge>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Update Status */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Update Status</CardTitle>
						</CardHeader>
						<CardContent>
							<UpdateStatusForm
								orderId={order.id}
								currentStatus={order.status}
								transitions={transitions}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
