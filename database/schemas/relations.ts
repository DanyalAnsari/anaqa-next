/**
 * ALL Drizzle relations in one file.
 *
 * Why: Relations cause circular imports when co-located with tables.
 * This file imports every table (one-directional) and defines
 * every relation — zero circular dependencies.
 */

import { relations } from "drizzle-orm";

// Tables
import { user, session, account } from "./auth.schema";
import { address } from "./address.schema";
import {
	category,
	collection,
	product,
	productImage,
	productVariant,
} from "./product.schema";
import { cart, cartItem } from "./cart.schema";
import { shopOrder, orderItem, orderStatusHistory } from "./order.schema";
import { coupon, couponUsage } from "./coupon.schema";
import { review } from "./review.schema";
import { wishlist } from "./wishlist.schema";
import { waitlist } from "./waitlist.schema";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ one, many }) => ({
	addresses: many(address),
	cart: one(cart, { fields: [user.id], references: [cart.userId] }),
	orders: many(shopOrder),
	reviews: many(review),
	wishlistItems: many(wishlist),
	couponUsages: many(couponUsage),
	sessions: many(session),
	accounts: many(account),
	waitlistEntries: many(waitlist),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ─── Address ────────────────────────────────────────────────────────────────

export const addressRelations = relations(address, ({ one }) => ({
	user: one(user, { fields: [address.userId], references: [user.id] }),
}));

// ─── Product ────────────────────────────────────────────────────────────────

export const categoryRelations = relations(category, ({ one, many }) => ({
	parent: one(category, {
		fields: [category.parentCategoryId],
		references: [category.id],
		relationName: "subcategories",
	}),
	subcategories: many(category, { relationName: "subcategories" }),
	products: many(product),
}));

export const collectionRelations = relations(collection, ({ many }) => ({
	products: many(product),
}));

export const productRelations = relations(product, ({ one, many }) => ({
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id],
	}),
	collection: one(collection, {
		fields: [product.collectionId],
		references: [collection.id],
	}),
	images: many(productImage),
	variants: many(productVariant),
	reviews: many(review),
	wishlistEntries: many(wishlist),
	cartItems: many(cartItem),
	orderItems: many(orderItem),
	waitlistEntries: many(waitlist),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
	product: one(product, {
		fields: [productImage.productId],
		references: [product.id],
	}),
}));

export const productVariantRelations = relations(productVariant, ({ one }) => ({
	product: one(product, {
		fields: [productVariant.productId],
		references: [product.id],
	}),
}));

// ─── Cart ───────────────────────────────────────────────────────────────────

export const cartRelations = relations(cart, ({ one, many }) => ({
	user: one(user, { fields: [cart.userId], references: [user.id] }),
	items: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, { fields: [cartItem.cartId], references: [cart.id] }),
	product: one(product, {
		fields: [cartItem.productId],
		references: [product.id],
	}),
}));

// ─── Order ──────────────────────────────────────────────────────────────────

export const shopOrderRelations = relations(shopOrder, ({ one, many }) => ({
	user: one(user, { fields: [shopOrder.userId], references: [user.id] }),
	items: many(orderItem),
	statusHistory: many(orderStatusHistory),
	reviews: many(review),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
	order: one(shopOrder, {
		fields: [orderItem.orderId],
		references: [shopOrder.id],
	}),
	product: one(product, {
		fields: [orderItem.productId],
		references: [product.id],
	}),
}));

export const orderStatusHistoryRelations = relations(
	orderStatusHistory,
	({ one }) => ({
		order: one(shopOrder, {
			fields: [orderStatusHistory.orderId],
			references: [shopOrder.id],
		}),
	}),
);

// ─── Coupon ─────────────────────────────────────────────────────────────────

export const couponRelations = relations(coupon, ({ many }) => ({
	usages: many(couponUsage),
}));

export const couponUsageRelations = relations(couponUsage, ({ one }) => ({
	coupon: one(coupon, {
		fields: [couponUsage.couponId],
		references: [coupon.id],
	}),
	user: one(user, { fields: [couponUsage.userId], references: [user.id] }),
}));

// ─── Review ─────────────────────────────────────────────────────────────────

export const reviewRelations = relations(review, ({ one }) => ({
	user: one(user, { fields: [review.userId], references: [user.id] }),
	product: one(product, {
		fields: [review.productId],
		references: [product.id],
	}),
	order: one(shopOrder, {
		fields: [review.orderId],
		references: [shopOrder.id],
	}),
}));

// ─── Wishlist ───────────────────────────────────────────────────────────────

export const wishlistRelations = relations(wishlist, ({ one }) => ({
	user: one(user, { fields: [wishlist.userId], references: [user.id] }),
	product: one(product, {
		fields: [wishlist.productId],
		references: [product.id],
	}),
}));

// ─── Waitlist ───────────────────────────────────────────────────────────────

export const waitlistRelations = relations(waitlist, ({ one }) => ({
	user: one(user, { fields: [waitlist.userId], references: [user.id] }),
	product: one(product, {
		fields: [waitlist.productId],
		references: [product.id],
	}),
}));
