import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";
import { relations } from "drizzle-orm";

export const wishlist = pgTable(
	"wishlist",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.productId] })],
);

export const wishlistRelations = relations(wishlist, ({ one }) => ({
	user: one(user, { fields: [wishlist.userId], references: [user.id] }),
	product: one(product, {
		fields: [wishlist.productId],
		references: [product.id],
	}),
}));
