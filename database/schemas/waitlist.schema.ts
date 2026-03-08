import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";
import { relations } from "drizzle-orm";

export const waitlist = pgTable(
	"waitlist",
	{
		id: text("id").primaryKey(),
		email: text("email").notNull(),
		userId: text("user_id").references(() => user.id, { onDelete: "set null" }), // nullable for guests
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		variantSize: text("variant_size").notNull(),
		notified: boolean("notified").notNull().default(false),
		notifiedAt: timestamp("notified_at"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [
		uniqueIndex("waitlist_email_product_size_uq").on(
			t.email,
			t.productId,
			t.variantSize,
		),
		index("waitlist_product_size_notified_idx").on(
			t.productId,
			t.variantSize,
			t.notified,
		),
	],
);

export const waitlistRelations = relations(waitlist, ({ one }) => ({
	user: one(user, { fields: [waitlist.userId], references: [user.id] }),
	product: one(product, {
		fields: [waitlist.productId],
		references: [product.id],
	}),
}));
