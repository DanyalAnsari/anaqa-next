import { db } from "@/database";
import {
	cart,
	cartItem,
	product,
	productImage,
	productVariant,
} from "@/database/schemas";
import { eq, and, desc } from "drizzle-orm";

export interface CartItemData {
	id: string;
	productId: string;
	size: string;
	quantity: number;
	price: number;
	productName: string;
	productSlug: string;
	productIsActive: boolean;
	currentStock: number;
	imageFilePath: string | null;
	imageAlt: string;
}

export async function getCartData(userId?: string) {
	if (!userId) {
		return {
			items: [] as CartItemData[],
			subtotal: 0,
			itemCount: 0,
			couponCode: null,
		};
	}

	const [userCart] = await db
		.select()
		.from(cart)
		.where(eq(cart.userId, userId))
		.limit(1);

	if (!userCart) {
		return {
			items: [] as CartItemData[],
			subtotal: 0,
			itemCount: 0,
			couponCode: null,
		};
	}

	const items = await db
		.select({
			id: cartItem.id,
			cartId: cartItem.cartId,
			productId: cartItem.productId,
			size: cartItem.size,
			quantity: cartItem.quantity,
			price: cartItem.price,
			productName: product.name,
			productSlug: product.slug,
			productIsActive: product.isActive,
		})
		.from(cartItem)
		.innerJoin(product, eq(cartItem.productId, product.id))
		.where(eq(cartItem.cartId, userCart.id));

	const productIds = items.map((i) => i.productId);

	// Fetch images
	const images =
		productIds.length > 0 ?
			await db
				.select({
					productId: productImage.productId,
					filePath: productImage.filePath,
					altText: productImage.altText,
				})
				.from(productImage)
				.where(eq(productImage.position, 0))
		:	[];

	// Fetch variant stock
	const variants =
		productIds.length > 0 ?
			await db
				.select({
					productId: productVariant.productId,
					size: productVariant.size,
					stock: productVariant.stock,
				})
				.from(productVariant)
		:	[];

	const imageMap = new Map(
		images
			.filter((i) => productIds.includes(i.productId))
			.map((i) => [i.productId, i]),
	);

	const variantMap = new Map(
		variants.map((v) => [`${v.productId}-${v.size}`, v.stock]),
	);

	const cartItems: CartItemData[] = items.map((item) => {
		const img = imageMap.get(item.productId);
		const currentStock = variantMap.get(`${item.productId}-${item.size}`) ?? 0;

		return {
			id: item.id,
			productId: item.productId,
			size: item.size,
			quantity: item.quantity,
			price: Number(item.price),
			productName: item.productName,
			productSlug: item.productSlug,
			productIsActive: item.productIsActive,
			currentStock,
			imageFilePath: img?.filePath ?? null,
			imageAlt: img?.altText ?? item.productName,
		};
	});

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

	return {
		items: cartItems,
		subtotal,
		itemCount,
		couponCode: userCart.couponCode,
	};
}

export async function getRecommendedProducts() {
	const recommended = await db
		.select({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			comparePrice: product.comparePrice,
			averageRating: product.averageRating,
			reviewCount: product.reviewCount,
			totalStock: product.totalStock,
		})
		.from(product)
		.where(and(eq(product.isActive, true), eq(product.isFeatured, true)))
		.orderBy(desc(product.soldCount))
		.limit(4);

	const images = await db
		.select({
			productId: productImage.productId,
			filePath: productImage.filePath,
			altText: productImage.altText,
		})
		.from(productImage)
		.where(eq(productImage.position, 0));

	const imageMap = new Map(images.map((i) => [i.productId, i]));

	return recommended.map((p) => {
		const img = imageMap.get(p.id);
		return {
			id: p.id,
			name: p.name,
			slug: p.slug,
			price: Number(p.price),
			comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
			averageRating: Number(p.averageRating),
			reviewCount: p.reviewCount,
			totalStock: p.totalStock,
			imageFilePath: img?.filePath ?? null,
			imageAlt: img?.altText ?? p.name,
		};
	});
}
