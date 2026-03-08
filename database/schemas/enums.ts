import { pgEnum } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["men", "women", "unisex"]);

export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]);

export const discountTypeEnum = pgEnum("discount_type", [
	"percentage",
	"fixed",
]);

export const paymentMethodEnum = pgEnum("payment_method", ["card", "cod"]);

export const paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"paid",
	"failed",
	"refunded",
]);

export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
]);
