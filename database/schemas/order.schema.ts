import {
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";
import { paymentMethodEnum, paymentStatusEnum, orderStatusEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// Shop Order
//
// Named shop_order to avoid collision with SQL reserved word ORDER.
// All pricing, shipping address, and coupon fields are intentional snapshots.
//
// CHECK constraints (total >= 0, subtotal >= 0) are in migration SQL.
// ─────────────────────────────────────────────────────────────────��───────────

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

		// Coupon snapshot
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

// ─────────────────────────────────────────────────────────────────────────────
// Order Item
//
// All fields are snapshots — immutable after order creation.
// productId is nullable — product can be deleted, order history preserved.
// sizeLabel (was variantName) — stores "M", "XL", etc.
// imageUrl is a FULL resolved URL snapshot — correct, not an ImageKit filePath.
//
// CHECK constraint on quantity > 0 is in migration SQL.
// ─────────────────────────────────────────────────────────────────────────────

export const orderItem = pgTable(
	"order_item",
	{
		id: text("id").primaryKey(),
		orderId: text("order_id")
			.notNull()
			.references(() => shopOrder.id, { onDelete: "cascade" }),
		productId: text("product_id").references(() => product.id, {
			onDelete: "set null",
		}),
		variantSku: text("variant_sku").notNull(),
		title: text("title").notNull(),
		sizeLabel: text("size_label").notNull(), // "M", "XL" — snapshot
		imageUrl: text("image_url"), // full URL snapshot
		quantity: integer("quantity").notNull(),
		unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
		totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
	},
	(t) => [index("order_item_order_idx").on(t.orderId)],
);

// ─────────────────────────────────────────────────────────────────────────────
// Order Status History
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
