import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";
import { shopOrder } from "./order.schema";

// ─────────────────────────────────────────────────────────────────────────────
// Review
//
// One review per user per product (unique constraint).
// CHECK constraint: rating BETWEEN 1 AND 5 — in migration SQL.
// ─────────────────────────────────────────────────────────────────────────────

export const review = pgTable(
	"review",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		orderId: text("order_id").references(() => shopOrder.id, {
			onDelete: "set null",
		}),
		rating: integer("rating").notNull(),
		title: text("title").notNull(),
		comment: text("comment").notNull(),
		isVerifiedPurchase: boolean("is_verified_purchase")
			.notNull()
			.default(false),
		isApproved: boolean("is_approved").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		uniqueIndex("review_user_product_uq").on(t.userId, t.productId),
		index("review_product_created_idx").on(t.productId, t.createdAt),
	],
);
