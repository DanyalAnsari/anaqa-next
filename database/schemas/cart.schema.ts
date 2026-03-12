import {
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";
import { sizeEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// Cart  (one active cart per user)
//
// couponCode stores ONLY the code reference — not a snapshot of discount terms.
// Always re-validate against the live coupon row at checkout.
//
// Stale cart cleanup — run a scheduled job:
//   DELETE FROM cart WHERE updated_at < NOW() - INTERVAL '30 days'
// ─────────────────────────────────────────────────────────────────────────────

export const cart = pgTable("cart", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),
	couponCode: text("coupon_code"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// Cart Item
//
// Uses sizeEnum (not text) — matches productVariant.size.
// price is NOT NULL — always captured at add-to-cart time.
//   Re-validate at checkout; the product price may have changed.
//
// CHECK constraint on quantity > 0 is in migration SQL.
// ─────────────────────────────────────────────────────────────────────────────

export const cartItem = pgTable(
	"cart_item",
	{
		id: text("id").primaryKey(),
		cartId: text("cart_id")
			.notNull()
			.references(() => cart.id, { onDelete: "cascade" }),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		size: sizeEnum("size").notNull(),
		quantity: integer("quantity").notNull(),
		price: numeric("price", { precision: 12, scale: 2 }).notNull(),
	},
	(t) => [
		index("cart_item_cart_idx").on(t.cartId),
		uniqueIndex("cart_item_cart_product_size_uq").on(
			t.cartId,
			t.productId,
			t.size,
		),
	],
);
