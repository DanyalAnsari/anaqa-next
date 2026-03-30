import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database";
import { shopOrder, orderItem } from "@/database/schemas";
import { eq, and } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CopyOrderNumber } from "./_components/copy-order-number";

interface OrderConfirmationProps {
	params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({
	params,
}: OrderConfirmationProps) {
	const { orderId } = await params;

	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) return notFound();

	const [order] = await db
		.select()
		.from(shopOrder)
		.where(
			and(eq(shopOrder.id, orderId), eq(shopOrder.userId, session.user.id)),
		)
		.limit(1);

	if (!order) return notFound();

	const items = await db
		.select()
		.from(orderItem)
		.where(eq(orderItem.orderId, orderId));

	return (
		<div className="animate-in fade-in duration-500">
			<div className="container-narrow py-12 md:py-16">
				{/* Success Header */}
				<div className="text-center mb-12">
					<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
						<CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
					</div>
					<h1 className="text-3xl font-medium mb-2">Order Confirmed!</h1>
					<p className="text-muted-foreground">
						Thank you for your order. We&apos;ll send you a confirmation email
						shortly.
					</p>
				</div>

				{/* Order Number */}
				<div className="bg-secondary/50 rounded-lg p-6 mb-8 text-center">
					<p className="text-sm text-muted-foreground mb-1">Order Number</p>
					<CopyOrderNumber orderNumber={order.orderNumber} />
					<p className="text-sm text-muted-foreground mt-2">
						Placed on{" "}
						{new Date(order.createdAt).toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
				</div>

				{/* What's Next */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<div className="flex items-start gap-3 p-4 bg-card border rounded-lg">
						<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="font-medium text-sm">Confirmation Email</p>
							<p className="text-xs text-muted-foreground">
								Check your inbox for order details
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 p-4 bg-card border rounded-lg">
						<Package className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="font-medium text-sm">Order Processing</p>
							<p className="text-xs text-muted-foreground">
								We&apos;re preparing your items
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3 p-4 bg-card border rounded-lg">
						<Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="font-medium text-sm">Shipping</p>
							<p className="text-xs text-muted-foreground">
								Tracking info coming soon
							</p>
						</div>
					</div>
				</div>

				<Separator className="my-8" />

				{/* Order Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					{/* Items */}
					<div>
						<h2 className="text-lg font-medium mb-4">Items Ordered</h2>
						<div className="space-y-3">
							{items.map((item) => (
								<div
									key={item.id}
									className="flex gap-3 p-3 bg-secondary/30 rounded-lg"
								>
									<div className="w-14 h-[72px] bg-secondary rounded overflow-hidden shrink-0">
										{item.imageUrl && (
											<Image
												src={item.imageUrl}
												alt={item.title}
												width={56}
												height={72}
												className="w-full h-full object-cover"
											/>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-medium text-sm">{item.title}</p>
										<p className="text-xs text-muted-foreground">
											Size: {item.sizeLabel}
										</p>
										<p className="text-xs text-muted-foreground">
											Qty: {item.quantity}
										</p>
									</div>
									<p className="text-sm font-medium">
										{formatPrice(Number(item.totalPrice))}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Summary */}
					<div>
						<h2 className="text-lg font-medium mb-4">Order Summary</h2>
						<div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(Number(order.subtotal))}</span>
							</div>
							{Number(order.discount) > 0 && (
								<div className="flex justify-between text-green-600">
									<span>Discount</span>
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
							<Separator className="my-2" />
							<div className="flex justify-between font-semibold text-base">
								<span>Total</span>
								<span>{formatPrice(Number(order.total))}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Shipping Address */}
				<div className="mb-8">
					<h2 className="text-lg font-medium mb-4">Shipping Address</h2>
					<div className="bg-secondary/30 rounded-lg p-4 text-sm">
						<p className="font-medium">{order.shippingFullName}</p>
						<p className="text-muted-foreground">{order.shippingStreet}</p>
						<p className="text-muted-foreground">
							{order.shippingCity}, {order.shippingState}{" "}
							{order.shippingPostalCode}
						</p>
						<p className="text-muted-foreground">{order.shippingCountry}</p>
						<p className="text-muted-foreground mt-1">{order.shippingPhone}</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button asChild>
						<Link href="/account/orders">
							View All Orders
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/shop">Continue Shopping</Link>
					</Button>
				</div>

				<p className="text-center text-sm text-muted-foreground mt-8">
					Have questions about your order?{" "}
					<Link href="/contact" className="underline hover:text-foreground">
						Contact us
					</Link>
				</p>
			</div>
		</div>
	);
}
