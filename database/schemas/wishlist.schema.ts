import {
	pgTable,
	primaryKey,
	text,
	timestamp,
	index,
} from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { product } from "./product.schema";

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
	(t) => [
		primaryKey({ columns: [t.userId, t.productId] }),
		index("wishlist_product_idx").on(t.productId),
	],
);
