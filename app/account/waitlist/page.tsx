import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingBag, Clock, CheckCircle, Package } from "lucide-react";
import { WaitlistRemoveButton } from "./_components/waitlist-remove-button";
import { db } from "@/database";
import { product, productImage, productVariant, waitlist } from "@/database/schemas";

export default async function WaitlistPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) return null;

	const items = await db
		.select({
			id: waitlist.id,
			email: waitlist.email,
			productId: waitlist.productId,
			variantSize: waitlist.variantSize,
			notified: waitlist.notified,
			notifiedAt: waitlist.notifiedAt,
			createdAt: waitlist.createdAt,
			productName: product.name,
			productSlug: product.slug,
			productPrice: product.price,
			productIsActive: product.isActive,
		})
		.from(waitlist)
		.innerJoin(product, eq(waitlist.productId, product.id))
		.where(eq(waitlist.userId, session.user.id))
		.orderBy(asc(waitlist.createdAt));

	// Fetch primary images
	const productPrimaryImages = await db
		.select({
			productId: productImage.productId,
			filePath: productImage.filePath,
			altText: productImage.altText,
		})
		.from(productImage)
		.where(eq(productImage.position, 0));

	const imageMap = new Map(
		productPrimaryImages.map((img) => [img.productId, img]),
	);

	// Fetch current stock for variants the user is waiting on
	const variantStocks = await db
		.select({
			productId: productVariant.productId,
			size: productVariant.size,
			stock: productVariant.stock,
		})
		.from(productVariant);

	const stockMap = new Map(
		variantStocks.map((v) => [`${v.productId}-${v.size}`, v.stock]),
	);

	const waitlistItems = items.map((item) => {
		const image = imageMap.get(item.productId);
		const currentStock =
			stockMap.get(`${item.productId}-${item.variantSize}`) ?? 0;
		const imageUrl =
			image?.filePath ?
				image.filePath.startsWith("http") ?
					image.filePath
				:	`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/${image.filePath}`
			:	null;

		return {
			...item,
			productPrice: Number(item.productPrice),
			imageUrl,
			imageAlt: image?.altText ?? item.productName,
			currentStock,
			isBackInStock: currentStock > 0,
		};
	});

	const activeWaitlists = waitlistItems.filter((i) => !i.notified);
	const notifiedWaitlists = waitlistItems.filter((i) => i.notified);

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">My Waitlist</h1>
				<p className="text-muted-foreground mt-1">
					Get notified when your favorite out-of-stock items become available.
				</p>
			</div>

			{waitlistItems.length === 0 ?
				<div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-secondary/20">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
						<Bell className="h-8 w-8 text-primary" />
					</div>
					<h2 className="text-xl font-semibold mb-2">No Waitlist Items</h2>
					<p className="text-muted-foreground mb-6 max-w-sm">
						When you join a waitlist for an out-of-stock product, it will appear
						here.
					</p>
					<Button asChild className="gap-2">
						<Link href="/shop">
							<ShoppingBag className="h-4 w-4" />
							Browse Products
						</Link>
					</Button>
				</div>
			:	<div className="space-y-8">
					{/* Active Waitlists */}
					{activeWaitlists.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<h2 className="text-lg font-medium">Waiting</h2>
									<Badge variant="secondary" className="text-xs">
										{activeWaitlists.length}
									</Badge>
								</div>
							</div>

							<div className="space-y-3">
								{activeWaitlists.map((item) => (
									<WaitlistItemCard key={item.id} item={item} />
								))}
							</div>
						</div>
					)}

					{/* Notified Waitlists */}
					{notifiedWaitlists.length > 0 && (
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<h2 className="text-lg font-medium text-muted-foreground">
									Notified
								</h2>
								<Badge
									variant="outline"
									className="text-xs text-muted-foreground"
								>
									{notifiedWaitlists.length}
								</Badge>
							</div>

							<div className="space-y-3">
								{notifiedWaitlists.map((item) => (
									<WaitlistItemCard key={item.id} item={item} />
								))}
							</div>
						</div>
					)}
				</div>
			}
		</div>
	);
}

interface WaitlistItemData {
	id: string;
	productId: string;
	productName: string;
	productSlug: string;
	productPrice: number;
	productIsActive: boolean;
	variantSize: string;
	notified: boolean;
	notifiedAt: Date | null;
	createdAt: Date;
	imageUrl: string | null;
	imageAlt: string;
	currentStock: number;
	isBackInStock: boolean;
}

function WaitlistItemCard({ item }: { item: WaitlistItemData }) {
	return (
		<Card
			className={cn(
				"transition-all duration-200",
				"border-border/50 bg-background/50 backdrop-blur-sm",
				"hover:border-primary/30 hover:shadow-sm",
				item.notified && "opacity-60",
			)}
		>
			<CardContent className="p-4">
				<div className="flex gap-4">
					{/* Image */}
					<Link href={`/products/${item.productSlug}`} className="shrink-0">
						<div className="w-16 h-20 bg-secondary/30 rounded-lg overflow-hidden">
							{item.imageUrl ?
								<Image
									src={item.imageUrl}
									alt={item.imageAlt}
									width={64}
									height={80}
									className="w-full h-full object-cover"
								/>
							:	<div className="w-full h-full flex items-center justify-center">
									<Package className="h-6 w-6 text-muted-foreground/20" />
								</div>
							}
						</div>
					</Link>

					{/* Details */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-2">
							<div className="min-w-0">
								<Link
									href={`/products/${item.productSlug}`}
									className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
								>
									{item.productName}
								</Link>
								<div className="flex items-center gap-2 mt-1">
									<Badge variant="outline" className="text-xs">
										Size: {item.variantSize}
									</Badge>
									{item.isBackInStock ?
										<Badge className="text-xs gap-1 bg-green-500/10 text-green-600 border-green-500/20">
											<CheckCircle className="h-3 w-3" />
											Back in Stock
										</Badge>
									:	<Badge variant="secondary" className="text-xs gap-1">
											<Clock className="h-3 w-3" />
											Waiting
										</Badge>
									}
								</div>
							</div>

							<WaitlistRemoveButton waitlistId={item.id} />
						</div>

						<div className="flex items-center justify-between mt-3">
							<p className="text-xs text-muted-foreground">
								{item.notified ?
									`Notified ${item.notifiedAt ? new Date(item.notifiedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}`
								:	`Joined ${new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
								}
							</p>

							{item.isBackInStock && (
								<Button asChild size="sm" className="gap-1.5 h-8">
									<Link href={`/products/${item.productSlug}`}>
										<ShoppingBag className="h-3.5 w-3.5" />
										Shop Now
									</Link>
								</Button>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
