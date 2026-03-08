import { createId } from "@paralleldrive/cuid2";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type UserKey = "admin" | "fatima" | "amira" | "layla";
export type UserIdMap = Record<UserKey, string>;

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

// ─────────────────────────────────────────────────────────────────────────────
// Pre-generated IDs (non-user entities only)
//
// User IDs come from auth.api.signUpEmail at runtime.
// Everything else gets stable IDs here so cross-references work.
// ─────────────────────────────────────────────────────────────────────────────

export const ID = {
	category: {
		abayas: createId(),
		hijabs: createId(),
		dresses: createId(),
		outerwear: createId(),
		bottoms: createId(),
		accessories: createId(),
	},
	collection: {
		eid: createId(),
		summer: createId(),
		newArrivals: createId(),
	},
	product: {
		silkAbaya: createId(),
		crepeAbaya: createId(),
		cottonHijab: createId(),
		jerseyHijab: createId(),
		maxiDress: createId(),
		chiffonDress: createId(),
		blazer: createId(),
		midiSkirt: createId(),
		linenTrousers: createId(),
		underscarfSet: createId(),
	},
	coupon: {
		welcome10: createId(),
		save20: createId(),
		eid25: createId(),
	},
	cart: {
		fatima: createId(),
	},
	order: {
		order1: createId(),
		order2: createId(),
		order3: createId(),
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Users (for auth.api.signUpEmail)
//
// key: used to look up the returned ID after creation
// The rest maps to signUpEmail body + subsequent DB update fields
// ─────────────────────────────────────────────────────────────────────────────

export const seedUserDefs = [
	{
		key: "admin" as UserKey,
		name: "Sarah Admin",
		email: "admin@anaqa.com",
		password: "Admin@12345",
		// Fields applied via direct DB update after signup:
		role: "admin",
		emailVerified: true,
		phone: "+966-50-000-0001",
		orderUpdates: true,
	},
	{
		key: "fatima" as UserKey,
		name: "Fatima Ahmed",
		email: "fatima@example.com",
		password: "Password@123",
		role: "user",
		emailVerified: true,
		phone: "+966-50-000-0002",
		orderUpdates: true,
	},
	{
		key: "amira" as UserKey,
		name: "Amira Hassan",
		email: "amira@example.com",
		password: "Password@123",
		role: "user",
		emailVerified: true,
		phone: "+966-50-000-0003",
		orderUpdates: true,
	},
	{
		key: "layla" as UserKey,
		name: "Layla Mahmoud",
		email: "layla@example.com",
		password: "Password@123",
		role: "user",
		emailVerified: false,
		phone: null,
		orderUpdates: false,
	},
];

export const TEST_CREDENTIALS = seedUserDefs.map((u) => ({
	role: u.role,
	email: u.email,
	password: u.password,
}));

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeVariants(
	productId: string,
	skuPrefix: string,
	sizes: Size[],
	stock = 20,
) {
	return sizes.map((size) => ({
		id: createId(),
		productId,
		size,
		stock,
		sku: `${skuPrefix}-${size}`,
	}));
}

function makeImages(
	productId: string,
	images: Array<{ folder: string; name: string; alt: string }>,
) {
	return images.map((img, i) => ({
		id: createId(),
		productId,
		fileId: `seed_${img.name}`,
		filePath: `/${img.folder}/${img.name}.jpg`,
		altText: img.alt,
		position: i,
	}));
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Data (no user ID dependencies)
// ─────────────────────────────────────────────────────────────────────────────

// ── Categories ──────────────────────────────────────────────────────────────

export const seedCategories = [
	{
		id: ID.category.abayas,
		name: "Abayas",
		slug: "abayas",
		description: "Traditional and modern abayas for every occasion.",
		parentCategoryId: null,
		level: 0,
		sortOrder: 1,
		isActive: true,
	},
	{
		id: ID.category.hijabs,
		name: "Hijabs",
		slug: "hijabs",
		description: "Premium hijabs in cotton, chiffon, jersey and more.",
		parentCategoryId: null,
		level: 0,
		sortOrder: 2,
		isActive: true,
	},
	{
		id: ID.category.dresses,
		name: "Dresses",
		slug: "dresses",
		description: "Modest dresses from casual day-wear to formal evening looks.",
		parentCategoryId: null,
		level: 0,
		sortOrder: 3,
		isActive: true,
	},
	{
		id: ID.category.outerwear,
		name: "Outerwear",
		slug: "outerwear",
		description: "Blazers, coats and jackets designed with modesty in mind.",
		parentCategoryId: null,
		level: 0,
		sortOrder: 4,
		isActive: true,
	},
	{
		id: ID.category.bottoms,
		name: "Bottoms",
		slug: "bottoms",
		description: "Wide-leg trousers, midi skirts and more.",
		parentCategoryId: null,
		level: 0,
		sortOrder: 5,
		isActive: true,
	},
	{
		id: ID.category.accessories,
		name: "Accessories",
		slug: "accessories",
		description: "Underscarves, pins, belts and finishing touches.",
		parentCategoryId: null,
		level: 0,
		sortOrder: 6,
		isActive: true,
	},
];

// ── Collections ─────────────────────────────────────────────────────────────

export const seedCollections = [
	{
		id: ID.collection.eid,
		name: "Eid Collection",
		slug: "eid-collection",
		description:
			"Celebrate Eid in style with our curated selection of luxurious abayas, elegant dresses and statement hijabs.",
		imageFileId: "seed_coll_eid",
		imageFilePath: "/collections/eid-collection.jpg",
		isActive: true,
		isFeatured: true,
	},
	{
		id: ID.collection.summer,
		name: "Summer Essentials",
		slug: "summer-essentials",
		description: "Lightweight, breathable pieces perfect for warm weather.",
		imageFileId: "seed_coll_summer",
		imageFilePath: "/collections/summer-essentials.jpg",
		isActive: true,
		isFeatured: true,
	},
	{
		id: ID.collection.newArrivals,
		name: "New Arrivals",
		slug: "new-arrivals",
		description:
			"The latest additions to our store. Fresh styles dropping every week.",
		imageFileId: "seed_coll_new_arrivals",
		imageFilePath: "/collections/new-arrivals.jpg",
		isActive: true,
		isFeatured: false,
	},
];

// ── Products ────────────────────────────────────────────────────────────────

export const seedProducts = [
	{
		id: ID.product.silkAbaya,
		name: "Silk Blend Abaya",
		slug: "silk-blend-abaya",
		description:
			"Luxuriously crafted from a premium silk blend, this abaya drapes beautifully and moves with grace. Features delicate hand-stitched details along the sleeves and a subtle shimmer.",
		shortDescription: "Premium silk blend abaya with hand-stitched details.",
		price: "289.00",
		comparePrice: "349.00",
		categoryId: ID.category.abayas,
		collectionId: ID.collection.eid,
		tags: ["silk", "formal", "luxury", "bestseller"],
		gender: "women" as const,
		totalStock: 100,
		isActive: true,
		isFeatured: true,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 340,
	},
	{
		id: ID.product.crepeAbaya,
		name: "Open-Front Crepe Abaya",
		slug: "open-front-crepe-abaya",
		description:
			"A versatile open-front abaya in smooth crepe fabric. The relaxed silhouette and clean cut make it ideal for everyday wear.",
		shortDescription: "Everyday crepe abaya with a relaxed open-front cut.",
		price: "195.00",
		comparePrice: null,
		categoryId: ID.category.abayas,
		collectionId: ID.collection.newArrivals,
		tags: ["crepe", "everyday", "open-front"],
		gender: "women" as const,
		totalStock: 90,
		isActive: true,
		isFeatured: false,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 180,
	},
	{
		id: ID.product.cottonHijab,
		name: "Everyday Cotton Hijab",
		slug: "everyday-cotton-hijab",
		description:
			"Our bestselling cotton hijab is a wardrobe essential. Made from breathable, premium cotton that is soft against the skin.",
		shortDescription: "Breathable premium cotton hijab – a wardrobe essential.",
		price: "35.00",
		comparePrice: null,
		categoryId: ID.category.hijabs,
		collectionId: ID.collection.summer,
		tags: ["cotton", "everyday", "basics", "breathable"],
		gender: "women" as const,
		totalStock: 120,
		isActive: true,
		isFeatured: true,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 950,
	},
	{
		id: ID.product.jerseyHijab,
		name: "Premium Jersey Hijab",
		slug: "premium-jersey-hijab",
		description:
			"A stretchy, no-slip jersey hijab that stays in place without pins.",
		shortDescription: "No-pin jersey hijab with all-day hold.",
		price: "28.00",
		comparePrice: null,
		categoryId: ID.category.hijabs,
		collectionId: ID.collection.summer,
		tags: ["jersey", "no-pin", "stretch"],
		gender: "women" as const,
		totalStock: 105,
		isActive: true,
		isFeatured: false,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 640,
	},
	{
		id: ID.product.maxiDress,
		name: "Flowy Maxi Dress",
		slug: "flowy-maxi-dress",
		description:
			"A lightweight maxi dress with a flowing silhouette perfect for warm days.",
		shortDescription:
			"Lightweight maxi dress with a flowing, modest silhouette.",
		price: "175.00",
		comparePrice: "220.00",
		categoryId: ID.category.dresses,
		collectionId: ID.collection.summer,
		tags: ["maxi", "summer", "flowy", "casual"],
		gender: "women" as const,
		totalStock: 60,
		isActive: true,
		isFeatured: true,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 210,
	},
	{
		id: ID.product.chiffonDress,
		name: "Chiffon Evening Dress",
		slug: "chiffon-evening-dress",
		description:
			"Sophisticated and floor-length, this chiffon evening dress features delicate layering and subtle embellishments.",
		shortDescription: "Floor-length chiffon dress for formal evenings.",
		price: "325.00",
		comparePrice: "420.00",
		categoryId: ID.category.dresses,
		collectionId: ID.collection.eid,
		tags: ["chiffon", "formal", "evening", "luxury"],
		gender: "women" as const,
		totalStock: 40,
		isActive: true,
		isFeatured: true,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 130,
	},
	{
		id: ID.product.blazer,
		name: "Tailored Modest Blazer",
		slug: "tailored-modest-blazer",
		description:
			"A perfectly tailored blazer designed with modesty in mind. Features a longer length and elegant button details.",
		shortDescription:
			"Longer-length tailored blazer for a polished modest look.",
		price: "195.00",
		comparePrice: null,
		categoryId: ID.category.outerwear,
		collectionId: ID.collection.newArrivals,
		tags: ["professional", "workwear", "tailored", "office"],
		gender: "women" as const,
		totalStock: 50,
		isActive: true,
		isFeatured: false,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 185,
	},
	{
		id: ID.product.midiSkirt,
		name: "Pleated Midi Skirt",
		slug: "pleated-midi-skirt",
		description:
			"A timeless pleated midi skirt that adds elegant movement to your look.",
		shortDescription:
			"Timeless pleated midi skirt with permanent press pleats.",
		price: "79.00",
		comparePrice: null,
		categoryId: ID.category.bottoms,
		collectionId: ID.collection.newArrivals,
		tags: ["pleated", "midi", "elegant", "versatile"],
		gender: "women" as const,
		totalStock: 90,
		isActive: true,
		isFeatured: false,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 145,
	},
	{
		id: ID.product.linenTrousers,
		name: "Wide-Leg Linen Trousers",
		slug: "wide-leg-linen-trousers",
		description:
			"Breathable wide-leg linen trousers that are cool in summer and easy to dress up or down.",
		shortDescription: "Breezy high-waist wide-leg trousers in pure linen.",
		price: "95.00",
		comparePrice: null,
		categoryId: ID.category.bottoms,
		collectionId: ID.collection.summer,
		tags: ["linen", "wide-leg", "summer", "casual"],
		gender: "women" as const,
		totalStock: 100,
		isActive: true,
		isFeatured: false,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 98,
	},
	{
		id: ID.product.underscarfSet,
		name: "Modal Underscarf Set",
		slug: "modal-underscarf-set",
		description:
			"A three-piece set of soft modal underscarves in neutral, dark, and pastel tones.",
		shortDescription:
			"Three-piece modal underscarf set – neutral, dark, pastel.",
		price: "42.00",
		comparePrice: null,
		categoryId: ID.category.accessories,
		collectionId: ID.collection.newArrivals,
		tags: ["underscarves", "modal", "basics", "set"],
		gender: "women" as const,
		totalStock: 90,
		isActive: true,
		isFeatured: false,
		averageRating: "0.00",
		reviewCount: 0,
		soldCount: 420,
	},
];

// ── Product Images ──────────────────────────────────────────────────────────

export const seedProductImages = [
	...makeImages(ID.product.silkAbaya, [
		{
			folder: "products",
			name: "silk-abaya-1",
			alt: "Silk Blend Abaya - front",
		},
		{
			folder: "products",
			name: "silk-abaya-2",
			alt: "Silk Blend Abaya - detail",
		},
	]),
	...makeImages(ID.product.crepeAbaya, [
		{
			folder: "products",
			name: "crepe-abaya-1",
			alt: "Open-Front Crepe Abaya",
		},
	]),
	...makeImages(ID.product.cottonHijab, [
		{
			folder: "products",
			name: "cotton-hijab-1",
			alt: "Everyday Cotton Hijab - worn",
		},
		{
			folder: "products",
			name: "cotton-hijab-2",
			alt: "Everyday Cotton Hijab - folded",
		},
	]),
	...makeImages(ID.product.jerseyHijab, [
		{ folder: "products", name: "jersey-hijab-1", alt: "Premium Jersey Hijab" },
	]),
	...makeImages(ID.product.maxiDress, [
		{ folder: "products", name: "maxi-dress-1", alt: "Flowy Maxi Dress" },
	]),
	...makeImages(ID.product.chiffonDress, [
		{
			folder: "products",
			name: "chiffon-dress-1",
			alt: "Chiffon Evening Dress",
		},
	]),
	...makeImages(ID.product.blazer, [
		{ folder: "products", name: "blazer-1", alt: "Tailored Modest Blazer" },
	]),
	...makeImages(ID.product.midiSkirt, [
		{ folder: "products", name: "midi-skirt-1", alt: "Pleated Midi Skirt" },
	]),
	...makeImages(ID.product.linenTrousers, [
		{
			folder: "products",
			name: "linen-trousers-1",
			alt: "Wide-Leg Linen Trousers",
		},
	]),
	...makeImages(ID.product.underscarfSet, [
		{ folder: "products", name: "underscarf-1", alt: "Modal Underscarf Set" },
	]),
];

// ── Product Variants ────────────────────────────────────────────────────────

export const seedProductVariants = [
	...makeVariants(
		ID.product.silkAbaya,
		"SILKABY",
		["XS", "S", "M", "L", "XL"],
		20,
	),
	...makeVariants(
		ID.product.crepeAbaya,
		"CRPABY",
		["XS", "S", "M", "L", "XL", "XXL"],
		15,
	),
	...makeVariants(ID.product.cottonHijab, "CTNHIJ", ["S", "M", "L"], 40),
	...makeVariants(ID.product.jerseyHijab, "JRSHIJ", ["S", "M", "L"], 35),
	...makeVariants(
		ID.product.maxiDress,
		"FLWDRS",
		["XS", "S", "M", "L", "XL"],
		12,
	),
	...makeVariants(
		ID.product.chiffonDress,
		"CHFDRS",
		["XS", "S", "M", "L", "XL"],
		8,
	),
	...makeVariants(ID.product.blazer, "TLDBLZ", ["XS", "S", "M", "L", "XL"], 10),
	...makeVariants(
		ID.product.midiSkirt,
		"PLTSKR",
		["XS", "S", "M", "L", "XL"],
		18,
	),
	...makeVariants(
		ID.product.linenTrousers,
		"WDLTRN",
		["XS", "S", "M", "L", "XL"],
		20,
	),
	...makeVariants(ID.product.underscarfSet, "MDLUND", ["S", "M", "L"], 30),
];

// ── Coupons ─────────────────────────────────────────────────────────────────

export const seedCoupons = [
	{
		id: ID.coupon.welcome10,
		code: "WELCOME10",
		description: "10% off your first order",
		discountType: "percentage" as const,
		discountValue: "10.00",
		minimumPurchase: null,
		maximumDiscount: "50.00",
		usageLimit: 500,
		usedCount: 0,
		perUserLimit: 1,
		validFrom: new Date("2024-01-01T00:00:00Z"),
		validUntil: new Date("2026-12-31T23:59:59Z"),
		isActive: true,
	},
	{
		id: ID.coupon.save20,
		code: "SAVE20",
		description: "SAR 20 off orders over SAR 150",
		discountType: "fixed" as const,
		discountValue: "20.00",
		minimumPurchase: "150.00",
		maximumDiscount: null,
		usageLimit: 200,
		usedCount: 0,
		perUserLimit: 2,
		validFrom: new Date("2024-03-01T00:00:00Z"),
		validUntil: new Date("2025-12-31T23:59:59Z"),
		isActive: true,
	},
	{
		id: ID.coupon.eid25,
		code: "EID25",
		description: "25% off Eid special – capped at SAR 100",
		discountType: "percentage" as const,
		discountValue: "25.00",
		minimumPurchase: "200.00",
		maximumDiscount: "100.00",
		usageLimit: 300,
		usedCount: 0,
		perUserLimit: 1,
		validFrom: new Date("2024-04-01T00:00:00Z"),
		validUntil: new Date("2024-04-30T23:59:59Z"),
		isActive: false,
	},
];

// ── Newsletter ──────────────────────────────────────────────────────────────

export const seedNewsletters = [
	{
		id: createId(),
		email: "newsletter1@example.com",
		isActive: true,
		subscribedAt: new Date("2024-01-10"),
	},
	{
		id: createId(),
		email: "newsletter2@example.com",
		isActive: true,
		subscribedAt: new Date("2024-02-15"),
	},
	{
		id: createId(),
		email: "newsletter3@example.com",
		isActive: true,
		subscribedAt: new Date("2024-03-01"),
	},
	{
		id: createId(),
		email: "unsub@example.com",
		isActive: false,
		subscribedAt: new Date("2024-01-20"),
		unsubscribedAt: new Date("2024-04-01"),
	},
];

// ─────────────────────────────────────────────────────────────────────────────
// User-Dependent Data (builder functions — receive runtime user IDs)
// ─────────────────────────────────────────────────────────────────────────────

export function buildAddresses(u: UserIdMap) {
	return [
		{
			id: createId(),
			userId: u.fatima,
			label: "Home",
			fullName: "Fatima Ahmed",
			phone: "+966-50-000-0002",
			street: "123 Elegance Street, Apt 4B",
			city: "Riyadh",
			state: "Riyadh Region",
			postalCode: "11111",
			country: "SA",
			isDefault: true,
		},
		{
			id: createId(),
			userId: u.fatima,
			label: "Office",
			fullName: "Fatima Ahmed",
			phone: "+966-50-000-0002",
			street: "456 Business Tower, Floor 3",
			city: "Jeddah",
			state: "Makkah Region",
			postalCode: "22222",
			country: "SA",
			isDefault: false,
		},
		{
			id: createId(),
			userId: u.amira,
			label: "Home",
			fullName: "Amira Hassan",
			phone: "+966-50-000-0003",
			street: "789 Modest Lane",
			city: "Dammam",
			state: "Eastern Province",
			postalCode: "33333",
			country: "SA",
			isDefault: true,
		},
	];
}

export function buildOrders(u: UserIdMap) {
	return [
		{
			id: ID.order.order1,
			orderNumber: "ANQ-2024-0001",
			userId: u.fatima,
			subtotal: "359.00",
			shipping: "0.00",
			discount: "0.00",
			tax: "53.85",
			total: "412.85",
			shippingFullName: "Fatima Ahmed",
			shippingPhone: "+966-50-000-0002",
			shippingStreet: "123 Elegance Street, Apt 4B",
			shippingCity: "Riyadh",
			shippingState: "Riyadh Region",
			shippingPostalCode: "11111",
			shippingCountry: "SA",
			shippingMethod: "standard",
			paymentMethod: "card" as const,
			paymentStatus: "paid" as const,
			stripePaymentIntentId: "pi_seed_001",
			paidAt: new Date("2024-02-15T10:35:00Z"),
			status: "delivered" as const,
			couponCode: null,
			couponDiscountType: null,
			couponDiscountValue: null,
			customerNote: null,
			adminNote: null,
			createdAt: new Date("2024-02-15T10:30:00Z"),
		},
		{
			id: ID.order.order2,
			orderNumber: "ANQ-2024-0002",
			userId: u.fatima,
			subtotal: "325.00",
			shipping: "0.00",
			discount: "0.00",
			tax: "48.75",
			total: "373.75",
			shippingFullName: "Fatima Ahmed",
			shippingPhone: "+966-50-000-0002",
			shippingStreet: "123 Elegance Street, Apt 4B",
			shippingCity: "Riyadh",
			shippingState: "Riyadh Region",
			shippingPostalCode: "11111",
			shippingCountry: "SA",
			shippingMethod: "standard",
			paymentMethod: "cod" as const,
			paymentStatus: "pending" as const,
			stripePaymentIntentId: null,
			paidAt: null,
			status: "shipped" as const,
			couponCode: null,
			couponDiscountType: null,
			couponDiscountValue: null,
			customerNote: null,
			adminNote: null,
			createdAt: new Date("2024-03-10T15:45:00Z"),
		},
		{
			id: ID.order.order3,
			orderNumber: "ANQ-2024-0003",
			userId: u.amira,
			subtotal: "353.00",
			shipping: "0.00",
			discount: "20.00",
			tax: "49.95",
			total: "382.95",
			shippingFullName: "Amira Hassan",
			shippingPhone: "+966-50-000-0003",
			shippingStreet: "789 Modest Lane",
			shippingCity: "Dammam",
			shippingState: "Eastern Province",
			shippingPostalCode: "33333",
			shippingCountry: "SA",
			shippingMethod: "standard",
			paymentMethod: "card" as const,
			paymentStatus: "paid" as const,
			stripePaymentIntentId: "pi_seed_003",
			paidAt: new Date("2024-03-18T11:22:00Z"),
			status: "processing" as const,
			couponCode: "SAVE20",
			couponDiscountType: "fixed",
			couponDiscountValue: "20.00",
			customerNote: "Please gift wrap if possible",
			adminNote: null,
			createdAt: new Date("2024-03-18T11:20:00Z"),
		},
	];
}

export const seedOrderItems = [
	{
		id: createId(),
		orderId: ID.order.order1,
		productId: ID.product.silkAbaya,
		variantSku: "SILKABY-M",
		title: "Silk Blend Abaya",
		sizeLabel: "M",
		imageUrl: "/products/silk-abaya-1.jpg",
		quantity: 1,
		unitPrice: "289.00",
		totalPrice: "289.00",
	},
	{
		id: createId(),
		orderId: ID.order.order1,
		productId: ID.product.cottonHijab,
		variantSku: "CTNHIJ-M",
		title: "Everyday Cotton Hijab",
		sizeLabel: "M",
		imageUrl: "/products/cotton-hijab-1.jpg",
		quantity: 2,
		unitPrice: "35.00",
		totalPrice: "70.00",
	},
	{
		id: createId(),
		orderId: ID.order.order2,
		productId: ID.product.chiffonDress,
		variantSku: "CHFDRS-L",
		title: "Chiffon Evening Dress",
		sizeLabel: "L",
		imageUrl: "/products/chiffon-dress-1.jpg",
		quantity: 1,
		unitPrice: "325.00",
		totalPrice: "325.00",
	},
	{
		id: createId(),
		orderId: ID.order.order3,
		productId: ID.product.chiffonDress,
		variantSku: "CHFDRS-S",
		title: "Chiffon Evening Dress",
		sizeLabel: "S",
		imageUrl: "/products/chiffon-dress-1.jpg",
		quantity: 1,
		unitPrice: "325.00",
		totalPrice: "325.00",
	},
	{
		id: createId(),
		orderId: ID.order.order3,
		productId: ID.product.jerseyHijab,
		variantSku: "JRSHIJ-M",
		title: "Premium Jersey Hijab",
		sizeLabel: "M",
		imageUrl: "/products/jersey-hijab-1.jpg",
		quantity: 1,
		unitPrice: "28.00",
		totalPrice: "28.00",
	},
];

export const seedOrderStatusHistory = [
	// Order 1 — delivered
	{
		id: createId(),
		orderId: ID.order.order1,
		status: "pending" as const,
		note: null,
		occurredAt: new Date("2024-02-15T10:30:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order1,
		status: "confirmed" as const,
		note: null,
		occurredAt: new Date("2024-02-15T11:00:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order1,
		status: "processing" as const,
		note: null,
		occurredAt: new Date("2024-02-16T08:00:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order1,
		status: "shipped" as const,
		note: null,
		occurredAt: new Date("2024-02-17T09:00:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order1,
		status: "delivered" as const,
		note: null,
		occurredAt: new Date("2024-02-20T14:00:00Z"),
	},
	// Order 2 — shipped
	{
		id: createId(),
		orderId: ID.order.order2,
		status: "pending" as const,
		note: null,
		occurredAt: new Date("2024-03-10T15:45:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order2,
		status: "confirmed" as const,
		note: null,
		occurredAt: new Date("2024-03-10T16:00:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order2,
		status: "shipped" as const,
		note: null,
		occurredAt: new Date("2024-03-12T09:00:00Z"),
	},
	// Order 3 — processing
	{
		id: createId(),
		orderId: ID.order.order3,
		status: "pending" as const,
		note: null,
		occurredAt: new Date("2024-03-18T11:20:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order3,
		status: "confirmed" as const,
		note: null,
		occurredAt: new Date("2024-03-18T11:30:00Z"),
	},
	{
		id: createId(),
		orderId: ID.order.order3,
		status: "processing" as const,
		note: "Customer requested gift wrap",
		occurredAt: new Date("2024-03-19T08:00:00Z"),
	},
];

export function buildCouponUsages(u: UserIdMap) {
	return [
		{
			id: createId(),
			couponId: ID.coupon.save20,
			userId: u.amira,
			usedAt: new Date("2024-03-18T11:20:00Z"),
		},
	];
}

export function buildReviews(u: UserIdMap) {
	return [
		{
			id: createId(),
			userId: u.fatima,
			productId: ID.product.silkAbaya,
			orderId: ID.order.order1,
			rating: 5,
			title: "Absolutely stunning quality",
			comment:
				"The silk blend is incredibly luxurious and the hand-stitching is perfectly done. Will definitely order again.",
			isVerifiedPurchase: true,
			isApproved: true,
		},
		{
			id: createId(),
			userId: u.fatima,
			productId: ID.product.cottonHijab,
			orderId: ID.order.order1,
			rating: 5,
			title: "My daily go-to",
			comment:
				"Soft, breathable and stays in place all day. I've bought three colours already and they all wash beautifully.",
			isVerifiedPurchase: true,
			isApproved: true,
		},
		{
			id: createId(),
			userId: u.amira,
			productId: ID.product.chiffonDress,
			orderId: ID.order.order3,
			rating: 4,
			title: "Elegant but runs slightly large",
			comment:
				"Beautiful dress and the chiffon is lovely. Would suggest sizing down one size.",
			isVerifiedPurchase: true,
			isApproved: true,
		},
	];
}

export const reviewAggregates: Record<
	string,
	{ averageRating: string; reviewCount: number }
> = {
	[ID.product.silkAbaya]: { averageRating: "5.00", reviewCount: 1 },
	[ID.product.cottonHijab]: { averageRating: "5.00", reviewCount: 1 },
	[ID.product.chiffonDress]: { averageRating: "4.00", reviewCount: 1 },
};

export function buildWishlist(u: UserIdMap) {
	return [
		{ userId: u.fatima, productId: ID.product.chiffonDress },
		{ userId: u.fatima, productId: ID.product.blazer },
		{ userId: u.amira, productId: ID.product.silkAbaya },
	];
}

export function buildCarts(u: UserIdMap) {
	return [{ id: ID.cart.fatima, userId: u.fatima, couponCode: null }];
}

export const seedCartItems = [
	{
		id: createId(),
		cartId: ID.cart.fatima,
		productId: ID.product.cottonHijab,
		size: "M" as const,
		quantity: 2,
		price: "35.00",
	},
	{
		id: createId(),
		cartId: ID.cart.fatima,
		productId: ID.product.blazer,
		size: "L" as const,
		quantity: 1,
		price: "195.00",
	},
];

export const seedWaitlist = [
	{
		id: createId(),
		email: "waiting1@example.com",
		userId: null,
		productId: ID.product.silkAbaya,
		variantSize: "XXL" as const,
		notified: false,
		notifiedAt: null,
	},
	{
		id: createId(),
		email: "waiting2@example.com",
		userId: null,
		productId: ID.product.chiffonDress,
		variantSize: "XS" as const,
		notified: false,
		notifiedAt: null,
	},
	{
		id: createId(),
		email: "waiting3@example.com",
		userId: null,
		productId: ID.product.silkAbaya,
		variantSize: "XXL" as const,
		notified: true,
		notifiedAt: new Date("2024-04-01T10:00:00Z"),
	},
];
