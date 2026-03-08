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
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// Review
//
// One review per user per product (unique constraint).
// rating range (1–5) cannot be expressed in Drizzle — add this to your migration:
//   ALTER TABLE review
//   ADD CONSTRAINT review_rating_range CHECK (rating BETWEEN 1 AND 5);
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
