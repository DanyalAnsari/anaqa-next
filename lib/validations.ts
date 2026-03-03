import { z } from "zod";

// ============================================
// Common Schemas
// ============================================

const PASSWORD_REGEX = {
	uppercase: /[A-Z]/,
	lowercase: /[a-z]/,
	number: /[0-9]/,
	special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
};

export const emailSchema = z
	.email("Invalid email address")
	.max(255, "Email must not exceed 255 characters");

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.max(128, "Password is too long")
	.refine(
		(val) => PASSWORD_REGEX.uppercase.test(val),
		"Password must contain at least one uppercase letter",
	)
	.refine(
		(val) => PASSWORD_REGEX.lowercase.test(val),
		"Password must contain at least one lowercase letter",
	)
	.refine(
		(val) => PASSWORD_REGEX.number.test(val),
		"Password must contain at least one number",
	)
	.refine(
		(val) => PASSWORD_REGEX.special.test(val),
		"Password must contain at least one special character",
	);

export const phoneSchema = z
	.string()
	.min(1, "Phone number is required")
	.regex(/^[\d\s\-+()]+$/, "Invalid phone number format");

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, "Name is required")
			.max(100, "Name must not exceed 100 characters")
			.trim(),
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: passwordSchema,
		confirmNewPassword: z.string(),
	})
	.refine((data) => data.newPassword !== data.currentPassword, {
		message: "New password must be different from current password",
		path: ["newPassword"],
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"],
	});

export const resendVerificationSchema = z.object({
	email: emailSchema,
});

export const updateProfileSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(100, "First name is too long"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(100, "Last name is too long"),
	phone: phoneSchema.optional().or(z.literal("")),
});

// ============================================
// Address Schemas
// ============================================

export const addressSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name is required")
		.max(100, "Name is too long"),
	phone: phoneSchema,
	line1: z
		.string()
		.min(1, "Address line 1 is required")
		.max(200, "Address is too long"),
	line2: z.string().max(200, "Address is too long").optional(),
	city: z.string().min(1, "City is required").max(100, "City name is too long"),
	region: z
		.string()
		.min(1, "State/Region is required")
		.max(100, "Region name is too long"),
	postalCode: z
		.string()
		.min(1, "Postal code is required")
		.max(20, "Postal code is too long"),
	country: z
		.string()
		.min(1, "Country is required")
		.max(100, "Country name is too long"),
	isDefault: z.boolean().optional(),
});

// ============================================
// Product Schemas
// ============================================

export const productImageSchema = z.object({
	url: z.string().url("Invalid image URL"),
	alt: z.string().min(1, "Alt text is required"),
	position: z.number().int().min(0),
});

export const productVariantSchema = z.object({
	sku: z.string().min(1, "SKU is required"),
	size: z.string().optional(),
	color: z.string().optional(),
	colorHex: z
		.string()
		.regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color hex")
		.optional(),
	price: z.number().positive("Price must be positive"),
	compareAtPrice: z.number().positive().optional(),
	stock: z.number().int().min(0, "Stock cannot be negative"),
	isAvailable: z.boolean(),
});

export const createProductSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title is too long"),
	subtitle: z.string().max(200).optional(),
	description: z
		.string()
		.min(1, "Description is required")
		.max(5000, "Description is too long"),
	category: z.string().min(1, "Category is required"),
	subcategory: z.string().optional(),
	collections: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	currency: z.enum(["USD", "EUR", "GBP", "AED"]).optional(),
	images: z.array(productImageSchema).min(1, "At least one image is required"),
	variants: z
		.array(productVariantSchema)
		.min(1, "At least one variant is required"),
	isActive: z.boolean().optional(),
	isFeatured: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// ============================================
// Cart Schemas
// ============================================

export const addToCartSchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	variantId: z.string().min(1, "Variant ID is required"),
	quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
	quantity: z.number().int().min(0, "Quantity cannot be negative"),
});

// ============================================
// Checkout Schemas
// ============================================

export const shippingInfoSchema = addressSchema;

export const paymentMethodSchema = z.enum([
	"card",
	"paypal",
	"apple_pay",
	"google_pay",
]);

export const checkoutSchema = z.object({
	shippingAddress: addressSchema,
	useSameForBilling: z.boolean(),
	billingAddress: addressSchema.optional(),
	paymentMethod: paymentMethodSchema,
	notes: z.string().max(500).optional(),
	acceptTerms: z.literal(true, {
		error: "You must accept the terms and conditions",
	}),
});

// ============================================
// Waitlist Schema
// ============================================

export const waitlistSchema = z.object({
	productId: z.string().min(1),
	variantId: z.string().min(1),
	email: emailSchema,
});

// ============================================
// Newsletter Schema
// ============================================

export const newsletterSchema = z.object({
	email: emailSchema,
});

// ============================================
// Contact Form Schema
// ============================================

export const contactFormSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: emailSchema,
	subject: z.string().min(1, "Subject is required"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

// ============================================
// Search Schema
// ============================================

export const searchSchema = z.object({
	query: z.string().min(1, "Search query is required"),
});

// ============================================
// Type Exports
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CreateProductInputSchema = z.infer<typeof createProductSchema>;
export type UpdateProductInputSchema = z.infer<typeof updateProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
