import {
	boolean,
	index,
	integer,
	numeric,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { discountTypeEnum } from "./enums";

// ─────────────────────────────────────────────────────────────────────────────
// Coupon
//
// maximumDiscount is NULLABLE:
//   NULL = no cap (natural meaning)
//   value = cap amount for percentage coupons
//
// CHECK constraint (valid_until > valid_from) is in migration SQL.
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
		minimumPurchase: numeric("minimum_purchase", {
			precision: 10,
			scale: 2,
		}),
		maximumDiscount: numeric("maximum_discount", {
			precision: 10,
			scale: 2,
		}),
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
		index("coupon_active_dates_idx").on(t.isActive, t.validFrom, t.validUntil),
	],
);

// ─────────────────────────────────────────────────────────────────────────────
// Coupon Usage
//
// No unique constraint on (couponId, userId) — supports perUserLimit > 1.
// Enforce per-user count in application code.
// ─────────────────────────────────────────────────────────────────────────────

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
	(t) => [
		index("coupon_usage_coupon_user_idx").on(t.couponId, t.userId),
		index("coupon_usage_user_idx").on(t.userId),
	],
);
