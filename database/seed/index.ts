import "dotenv/config";
import { sql, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import * as schema from "@/database/schemas";

import {
	seedUserDefs,
	seedCategories,
	seedCollections,
	seedProducts,
	seedProductImages,
	seedProductVariants,
	seedCoupons,
	seedNewsletters,
	seedOrderItems,
	seedOrderStatusHistory,
	seedCartItems,
	seedWaitlist,
	reviewAggregates,
	buildAddresses,
	buildOrders,
	buildCouponUsages,
	buildReviews,
	buildWishlist,
	buildCarts,
	TEST_CREDENTIALS,
	type UserKey,
	type UserIdMap,
} from "./data";

// ─────────────────────────────────────────────────────────────────────────────
// Standalone DB Connection (not the Next.js singleton)
// ─────────────────────────────────────────────────────────────────────────────

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error("❌  DATABASE_URL is not set");
	process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool, { schema });

// ─────────────────────────────────────────────────────────────────────────────
// Standalone Auth Instance (no nextCookies, no email sending)
//
// This is separate from your Next.js auth instance.
// Only used for user creation — password hashing handled internally.
// ─────────────────────────────────────────────────────────────────────────────

const seedAuth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema }),
	plugins: [admin()],
	emailAndPassword: {
		enabled: true,
		// No email verification, no password reset — seeding only
	},
	user: {
		additionalFields: {
			phone: { type: "string", required: false },
			avatarFileId: { type: "string", required: false },
			avatarFilePath: { type: "string", required: false },
			orderUpdates: { type: "boolean", required: false, defaultValue: true },
		},
	},
});

// ─────────────────────────────────────────────────────────────────────────────
// Seed Runner
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
	console.log("⏳  Connecting to PostgreSQL…");
	await pool.query("SELECT 1");
	console.log("✅  Connected\n");

	// ── 1. Clear ─────────────────────────────────────────────────────────────

	console.log("🗑   Truncating all tables…");
	await db.execute(sql`
    TRUNCATE TABLE
      "user", session, account, verification,
      address, category, collection,
      product, product_image, product_variant,
      cart, cart_item,
      shop_order, order_item, order_status_history,
      coupon, coupon_usage,
      review, wishlist, waitlist, newsletter
    CASCADE
  `);
	console.log("✅  All tables truncated\n");

	// ── 2. Users (via better-auth API) ───────────────────────────────────────

	console.log("👤  Creating users via auth.api.signUpEmail…");

	const userIdMap: Record<string, string> = {};

	for (const def of seedUserDefs) {
		const result = await seedAuth.api.signUpEmail({
			body: {
				name: def.name,
				email: def.email,
				password: def.password,
			},
		});

		if (!result?.user?.id) {
			throw new Error(`Failed to create user: ${def.email}`);
		}

		userIdMap[def.key] = result.user.id;
		console.log(`   ✓ ${def.email} (${def.key}) → ${result.user.id}`);
	}

	const users = userIdMap as UserIdMap;
	console.log(`✅  ${seedUserDefs.length} users created\n`);

	// ── 3. Update user fields (role, emailVerified, phone, etc.) ─────────────

	console.log("🔧  Updating user fields (role, emailVerified, phone)…");
	for (const def of seedUserDefs) {
		await db
			.update(schema.user)
			.set({
				role: def.role,
				emailVerified: def.emailVerified,
				phone: def.phone,
				orderUpdates: def.orderUpdates,
			})
			.where(eq(schema.user.id, users[def.key]));
	}
	console.log("✅  User fields updated\n");

	// ── 4. Clean up seed sessions ────────────────────────────────────────────
	// signUpEmail creates sessions — we don't need them for seed data

	console.log("🧹  Cleaning up seed sessions…");
	await db
		.delete(schema.session)
		.where(inArray(schema.session.userId, Object.values(users)));
	console.log("✅  Sessions cleared\n");

	// ── 5. Addresses ─────────────────────────────────────────────────────────

	console.log("📍  Inserting addresses…");
	const addresses = buildAddresses(users);
	await db.insert(schema.address).values(addresses);
	console.log(`✅  ${addresses.length} addresses inserted`);

	// ── 6. Categories ────────────────────────────────────────────────────────

	console.log("🗂   Inserting categories…");
	await db.insert(schema.category).values(seedCategories);
	console.log(`✅  ${seedCategories.length} categories inserted`);

	// ── 7. Collections ──────────────────────────────────────────────────────

	console.log("📦  Inserting collections…");
	await db.insert(schema.collection).values(seedCollections);
	console.log(`✅  ${seedCollections.length} collections inserted`);

	// ── 8. Products ──────────────────────────────────────────────────────────

	console.log("👗  Inserting products…");
	await db.insert(schema.product).values(seedProducts);
	console.log(`✅  ${seedProducts.length} products inserted`);

	// ── 9. Product Images ────────────────────────────────────────────────────

	console.log("🖼   Inserting product images…");
	await db.insert(schema.productImage).values(seedProductImages);
	console.log(`✅  ${seedProductImages.length} product images inserted`);

	// ── 10. Product Variants ──────────────────────────────────────────────────

	console.log("📐  Inserting product variants…");
	await db.insert(schema.productVariant).values(seedProductVariants);
	console.log(`✅  ${seedProductVariants.length} product variants inserted`);

	// ── 11. Coupons ──────────────────────────────────────────────────────────

	console.log("🏷   Inserting coupons…");
	await db.insert(schema.coupon).values(seedCoupons);
	console.log(`✅  ${seedCoupons.length} coupons inserted`);

	// ── 12. Newsletter ──────────────────────────────────────────────────────

	console.log("📰  Inserting newsletter subscribers…");
	await db.insert(schema.newsletter).values(seedNewsletters);
	console.log(`✅  ${seedNewsletters.length} newsletter entries inserted`);

	// ── 13. Orders ──────────────────────────────────────────────────────────

	console.log("📦  Inserting orders…");
	const orders = buildOrders(users);
	await db.insert(schema.shopOrder).values(orders);
	console.log(`✅  ${orders.length} orders inserted`);

	// ── 14. Order Items ─────────────────────────────────────────────────────

	console.log("📋  Inserting order items…");
	await db.insert(schema.orderItem).values(seedOrderItems);
	console.log(`✅  ${seedOrderItems.length} order items inserted`);

	// ── 15. Order Status History ────────────────────────────────────────────

	console.log("📊  Inserting order status history…");
	await db.insert(schema.orderStatusHistory).values(seedOrderStatusHistory);
	console.log(
		`✅  ${seedOrderStatusHistory.length} status history entries inserted`,
	);

	// ── 16. Coupon Usage ────────────────────────────────────────────────────

	console.log("🎟   Inserting coupon usage…");
	const couponUsages = buildCouponUsages(users);
	await db.insert(schema.couponUsage).values(couponUsages);
	await db
		.update(schema.coupon)
		.set({ usedCount: 1 })
		.where(eq(schema.coupon.code, "SAVE20"));
	console.log(`✅  ${couponUsages.length} coupon usages inserted`);

	// ── 17. Reviews ─────────────────────────────────────────────────────────

	console.log("⭐  Inserting reviews…");
	const reviews = buildReviews(users);
	await db.insert(schema.review).values(reviews);
	console.log(`✅  ${reviews.length} reviews inserted`);

	// Update cached aggregates
	console.log("📊  Updating product rating aggregates…");
	for (const [productId, agg] of Object.entries(reviewAggregates)) {
		await db
			.update(schema.product)
			.set({
				averageRating: agg.averageRating,
				reviewCount: agg.reviewCount,
			})
			.where(eq(schema.product.id, productId));
	}
	console.log("✅  Product ratings updated");

	// ── 18. Wishlist ────────────────────────────────────────────────────────

	console.log("❤️   Inserting wishlist entries…");
	const wishlistEntries = buildWishlist(users);
	await db.insert(schema.wishlist).values(wishlistEntries);
	console.log(`✅  ${wishlistEntries.length} wishlist entries inserted`);

	// ── 19. Cart ────────────────────────────────────────────────────────────

	console.log("🛒  Inserting cart…");
	const carts = buildCarts(users);
	await db.insert(schema.cart).values(carts);
	await db.insert(schema.cartItem).values(seedCartItems);
	console.log(
		`✅  ${carts.length} cart + ${seedCartItems.length} cart items inserted`,
	);

	// ── 20. Waitlist ────────────────────────────────────────────────────────

	console.log("⏰  Inserting waitlist entries…");
	await db.insert(schema.waitlist).values(seedWaitlist);
	console.log(`✅  ${seedWaitlist.length} waitlist entries inserted`);

	// ── Summary ──────────────────────────────────────────────────────────────

	console.log("\n🎉  Database seeded successfully!\n");
	console.log("─── Summary ─────────────────────────────────────────────");
	console.log(`   Users:              ${seedUserDefs.length}`);
	console.log(`   Addresses:          ${addresses.length}`);
	console.log(`   Categories:         ${seedCategories.length}`);
	console.log(`   Collections:        ${seedCollections.length}`);
	console.log(`   Products:           ${seedProducts.length}`);
	console.log(`   Product Images:     ${seedProductImages.length}`);
	console.log(`   Product Variants:   ${seedProductVariants.length}`);
	console.log(`   Coupons:            ${seedCoupons.length}`);
	console.log(`   Newsletter:         ${seedNewsletters.length}`);
	console.log(`   Orders:             ${orders.length}`);
	console.log(`   Order Items:        ${seedOrderItems.length}`);
	console.log(`   Status History:     ${seedOrderStatusHistory.length}`);
	console.log(`   Coupon Usages:      ${couponUsages.length}`);
	console.log(`   Reviews:            ${reviews.length}`);
	console.log(`   Wishlist:           ${wishlistEntries.length}`);
	console.log(`   Carts:              ${carts.length}`);
	console.log(`   Cart Items:         ${seedCartItems.length}`);
	console.log(`   Waitlist:           ${seedWaitlist.length}`);
	console.log("─────────────────────────────────────────────────────────\n");

	console.log("🔑  Test credentials:");
	console.log("   ROLE      │ EMAIL                        │ PASSWORD");
	console.log("   ──────────┼──────────────────────────────┼─────────────────");
	for (const c of TEST_CREDENTIALS) {
		console.log(`   ${c.role.padEnd(9)}│ ${c.email.padEnd(29)}│ ${c.password}`);
	}

	console.log("\n📎  User IDs:");
	for (const [key, id] of Object.entries(users)) {
		console.log(`   ${key.padEnd(10)}→ ${id}`);
	}
	console.log("");
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

seed()
	.catch((err) => {
		console.error("❌  Seed failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await pool.end();
		console.log("🔌  Disconnected from PostgreSQL");
	});
