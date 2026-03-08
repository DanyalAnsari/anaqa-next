import {
	boolean,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { relations } from "drizzle-orm";

export const discountTypeEnum = pgEnum("discount_type", [
	"percentage",
	"fixed",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Coupon Usage
//
// Tracks per-user redemptions so perUserLimit can be enforced.
//
// No unique constraint on (couponId, userId) — that would silently prevent
// perUserLimit > 1 coupons from working. Use a plain index for query performance
// and enforce the per-user count in application code:
//   SELECT COUNT(*) FROM coupon_usage WHERE coupon_id = $1 AND user_id = $2
// ─────────────────────────────────────────────────────────────────────────────

export const coupon = pgTable(
	"coupon",
	{
		id: text("id").primaryKey(),
		code: text("code").notNull().unique(),
		description: text("description"),
		discountType: discountTypeEnum("discount_type").notNull(),
		discountValue: numeric("discount_value", {
			precision: 10,
			scale: 2,
		}).notNull(),
		minimumPurchase: numeric("minimum_purchase", { precision: 10, scale: 2 })
			.notNull()
			.default("0"),
		// Caps the currency amount for percentage coupons — ignored for fixed type
		maximumDiscount: numeric("maximum_discount", { precision: 10, scale: 2 })
			.notNull()
			.default("0"),
		usageLimit: integer("usage_limit").notNull(),
		usedCount: integer("used_count").notNull().default(0),
		perUserLimit: integer("per_user_limit").notNull().default(1),
		validFrom: timestamp("valid_from").notNull(),
		validUntil: timestamp("valid_until").notNull(),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		// code already has a unique btree index via .unique() — no redundant index needed
		index("coupon_active_dates_idx").on(t.isActive, t.validFrom, t.validUntil),
	],
);

export const couponUsage = pgTable(
	"coupon_usage",
	{
		id: text("id").primaryKey(),
		couponId: text("coupon_id")
			.notNull()
			.references(() => coupon.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		usedAt: timestamp("used_at").notNull().defaultNow(),
	},
	(t) => [index("coupon_usage_coupon_user_idx").on(t.couponId, t.userId)],
);

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
