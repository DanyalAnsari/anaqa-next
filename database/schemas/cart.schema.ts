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
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// Cart  (one active cart per user)
//
// couponCode stores ONLY the code reference — not a snapshot of discount terms.
// Always re-validate and re-compute discount against the live coupon row when
// loading the cart. Discount terms belong on the order snapshot, not here.
//
// The unique constraint on (cartId, productId, size) prevents duplicate line
// items — merge quantity instead of inserting a second row.
//
// Stale cart TTL — Postgres has no equivalent to Mongo's expireAfterSeconds.
// Run a scheduled job:
//   DELETE FROM cart WHERE updated_at < NOW() - INTERVAL '30 days'
// ─────────────────────────────────────────────────────────────────────────────

export const cart = pgTable("cart", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),
	couponCode: text("coupon_code"), // reference only — no snapshot values
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

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
		size: text("size"),
		quantity: integer("quantity").notNull(),
		// Price captured at add-to-cart time. Re-validate at checkout — do not
		// trust this value blindly; the product price may have changed.
		price: numeric("price", { precision: 12, scale: 2 }),
	},
	(t) => [
		index("cart_item_cart_idx").on(t.cartId),
		// Prevent duplicate size+product entries — merge quantity on conflict instead
		uniqueIndex("cart_item_cart_product_size_uq").on(
			t.cartId,
			t.productId,
			t.size,
		),
	],
);

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
