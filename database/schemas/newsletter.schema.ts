import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const newsletter = pgTable("newsletter", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	isActive: boolean("is_active").notNull().default(true),
	subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
	unsubscribedAt: timestamp("unsubscribed_at"),
});
