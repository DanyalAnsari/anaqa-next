import {
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";
import { relations } from "drizzle-orm";
import { review } from "./review.schema";

export const paymentMethodEnum = pgEnum("payment_method", ["card", "cod"]);
export const paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"paid",
	"failed",
	"refunded",
]);
export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Shop Order
//
// Named shop_order to avoid collision with the SQL reserved word ORDER.
//
// All pricing fields, the shipping address, and coupon fields are intentional
// snapshots — they must reflect values at the moment of purchase, never current
// state. This is correct and expected denormalization.
//
// orderItem.totalPrice is also a snapshot (quantity × unitPrice at checkout).
// Treat it as immutable after order creation.
// ─────────────────────────────────────────────────────────────────────────────

export const shopOrder = pgTable(
	"shop_order",
	{
		id: text("id").primaryKey(),
		orderNumber: text("order_number").notNull().unique(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id),

		// Pricing snapshot
		subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
		shipping: numeric("shipping", { precision: 12, scale: 2 }).notNull(),
		discount: numeric("discount", { precision: 12, scale: 2 })
			.notNull()
			.default("0"),
		tax: numeric("tax", { precision: 12, scale: 2 }).notNull().default("0"),
		total: numeric("total", { precision: 12, scale: 2 }).notNull(),

		// Shipping address snapshot
		shippingFullName: text("shipping_full_name").notNull(),
		shippingPhone: text("shipping_phone").notNull(),
		shippingStreet: text("shipping_street").notNull(),
		shippingCity: text("shipping_city").notNull(),
		shippingState: text("shipping_state").notNull(),
		shippingPostalCode: text("shipping_postal_code").notNull(),
		shippingCountry: text("shipping_country").notNull(),
		shippingMethod: text("shipping_method").notNull().default("standard"),

		// Payment
		paymentMethod: paymentMethodEnum("payment_method").notNull(),
		paymentStatus: paymentStatusEnum("payment_status")
			.notNull()
			.default("pending"),
		stripePaymentIntentId: text("stripe_payment_intent_id"),
		paidAt: timestamp("paid_at"),

		// Status
		status: orderStatusEnum("status").notNull().default("pending"),

		// Coupon snapshot — correct here because coupon terms can change after order
		couponCode: text("coupon_code"),
		couponDiscountType: text("coupon_discount_type"),
		couponDiscountValue: numeric("coupon_discount_value", {
			precision: 10,
			scale: 2,
		}),

		// Notes
		customerNote: text("customer_note"),
		adminNote: text("admin_note"),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		index("shop_order_user_created_idx").on(t.userId, t.createdAt),
		index("shop_order_status_created_idx").on(t.status, t.createdAt),
		index("shop_order_payment_status_idx").on(t.paymentStatus, t.createdAt),
		index("shop_order_stripe_intent_idx").on(t.stripePaymentIntentId),
	],
);

export const orderItem = pgTable(
	"order_item",
	{
		id: text("id").primaryKey(),
		orderId: text("order_id")
			.notNull()
			.references(() => shopOrder.id, { onDelete: "cascade" }),
		// Nullable — product can be deleted but the order record must be preserved
		productId: text("product_id").references(() => product.id, {
			onDelete: "set null",
		}),
		variantSku: text("variant_sku").notNull(), // snapshot — survives product deletion
		title: text("title").notNull(), // snapshot
		variantName: text("variant_name").notNull(), // snapshot
		imageUrl: text("image_url"), // snapshot
		quantity: integer("quantity").notNull(),
		unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(), // snapshot
		totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(), // snapshot: quantity × unitPrice — immutable
	},
	(t) => [index("order_item_order_idx").on(t.orderId)],
);

// ─────────────────────────────────────────────────────────────────────────────
// Order Status History
//
// `occurredAt` avoids shadowing the Postgres built-in type name `timestamp`.
// ─────────────────────────────────────────────────────────────────────────────

export const orderStatusHistory = pgTable(
	"order_status_history",
	{
		id: text("id").primaryKey(),
		orderId: text("order_id")
			.notNull()
			.references(() => shopOrder.id, { onDelete: "cascade" }),
		status: orderStatusEnum("status").notNull(),
		note: text("note"),
		occurredAt: timestamp("occurred_at").notNull().defaultNow(),
	},
	(t) => [index("order_status_history_order_idx").on(t.orderId)],
);

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
