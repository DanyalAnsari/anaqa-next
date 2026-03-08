// ─────────────────────────────────────────────────────────────────────────────
// Newsletter
//
// Single source of truth for subscription state — authenticated and guest alike.
// Do NOT mirror this onto user as a boolean. Derive subscription status via:
//   SELECT EXISTS (
//     SELECT 1 FROM newsletter WHERE email = $email AND is_active = true
//   )
// The unique constraint on email already creates a btree index in Postgres —
// no additional index is needed.
// ─────────────────────────────────────────────────────────────────────────────

import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const newsletter = pgTable("newsletter", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	isActive: boolean("is_active").notNull().default(true),
	subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
	unsubscribedAt: timestamp("unsubscribed_at"),
});
