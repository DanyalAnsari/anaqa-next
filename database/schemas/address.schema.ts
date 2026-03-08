import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth.schema";

// ─────────────────────────────────────────────────────────────────────────────
// Address
//
// A user may have multiple saved addresses (home, work, etc.).
// The partial unique index on (userId) WHERE is_default = true enforces a
// single default address at the database level.
// ─────────────────────────────────────────────────────────────────────────────

export const address = pgTable(
	"address",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		label: text("label").notNull(), // "Home", "Work", etc.
		fullName: text("full_name").notNull(), // Recipient name
		phone: text("phone").notNull(),
		street: text("street").notNull(),
		city: text("city").notNull(),
		state: text("state").notNull(),
		postalCode: text("postal_code").notNull(),
		country: text("country").notNull().default("SA"),
		isDefault: boolean("is_default").notNull().default(false),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(t) => [
		index("address_user_idx").on(t.userId),
		uniqueIndex("address_one_default_per_user_uq")
			.on(t.userId)
			.where(sql`is_default = true`),
	],
);
