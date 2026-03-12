/**
 * Barrel export — import this in drizzle.config.ts and db client.
 *
 * Usage in drizzle.config.ts:
 *   schema: "./src/db/schema/index.ts"
 *
 * Usage in db client:
 *   import * as schema from "@/db/schema";
 *   const db = drizzle(pool, { schema });
 */

export * from "./enums";
export * from "./auth.schema";
export * from "./address.schema";
export * from "./product.schema";
export * from "./cart.schema";
export * from "./order.schema";
export * from "./coupon.schema";
export * from "./review.schema";
export * from "./wishlist.schema";
export * from "./waitlist.schema";
export * from "./newsletter.schema";
export * from "./relations";
