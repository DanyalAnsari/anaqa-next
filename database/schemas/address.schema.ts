import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { relations, sql } from "drizzle-orm";

export const address = pgTable(
	"address",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		label: text("label").notNull(),
		name: text("name").notNull(),
		fullName: text("full_name").notNull(),
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
		// At most one default address per user — enforced at DB level
		uniqueIndex("address_one_default_per_user_uq")
			.on(t.userId)
			.where(sql`is_default = true`),
	],
);

export const addressRelations = relations(address, ({ one }) => ({
	user: one(user, { fields: [address.userId], references: [user.id] }),
}));
