import {
	Award,
	Clock,
	Facebook,
	Headphones,
	Instagram,
	Mail,
	MapPin,
	Phone,
	RefreshCw,
	RotateCcw,
	Shield,
	Truck,
	Twitter,
	Youtube,
} from "lucide-react";

export const NAV_ITEMS = [
	{ href: "/", label: "HOME" },
	{ href: "/products", label: "COLLECTION" },
	{ href: "/about", label: "ABOUT" },
	{ href: "/contact", label: "CONTACT US" },
] as LinkItemType[];

export const CONTACT_INFO_ITEMS = [
	{
		icon: Phone,
		label: "+91 1234567890",
	},
	{
		icon: Mail,
		label: "mh.danyalansari@gmail.com",
	},
	{
		icon: MapPin,
		label: "Gorakhpur, Uttar-Pradesh, India",
	},
] as InfoWithIconItems[];

export const QUICK_LINKS_NAV = [
	{ label: "Home", href: "/" },
	{ label: "About Us", href: "/about" },
	{ label: "Shop", href: "/collection" },
	{ label: "Contact", href: "/contact" },
] as LinkItemType[];

export const QUICK_LINKS_POLICIES = [
	{ label: "Privacy Policy", href: "/" },
	{ label: "Terms of Service", href: "/" },
	{ label: "Shipping Policy", href: "/" },
	{ label: "Return Policy", href: "/" },
] as LinkItemType[];

export const FOOTER_SOCIAL_ICONS = [
	{ icon: Facebook, label: "Facebook" },
	{ icon: Twitter, label: "Twitter" },
	{ icon: Instagram, label: "Instagram" },
	{ icon: Youtube, label: "YouTube" },
] as InfoWithIconItems[];

export const HERO_FEATURES_ITEMS = [
	{
		label: "Free Shipping",
		icon: Truck,
		type: "info",
	},
	{
		label: "Easy Returns",
		icon: RefreshCw,
		type: "success",
	},
	{
		label: "Secure Payment",
		icon: Shield,
		type: "secondary",
	},
] as HeroFeaturesItemsProp[];

export const HERO_SECONDARY_FEATURES_ITEMS = [
	{
		className: "bg-info/10 group-hover:bg-info/15 border-info/10",
		icon: Truck,
		color: "info",
		label: "Free Shipping",
		text: "Free shipping on orders over $100. Express delivery available nationwide.",
	},
	{
		label: "Easy Returns",
		icon: RefreshCw,
		color: "success",
		className: "bg-success/10 group-hover:bg-success/15 border-success/10",
		text: "30-day hassle-free returns. No questions asked policy for your peace of mind",
	},
	{
		className:
			"bg-secondary/10 group-hover:bg-secondary/15 border-secondary/10",
		icon: Shield,
		color: "secondary",
		label: "Secure Payment",
		text: "Your payment information is always safe and secure with bank-level encryption.",
	},
] as FeaturesItemsProp[];

export const POLICY_ITEMS = [
	{
		icon: RotateCcw,
		label: "Easy Exchange Policy",
		text: "Hassle-free exchanges within 30 days of purchase",
		badge: "30 Days",
		color: "accent",
	},
	{
		icon: Shield,
		label: "Quality Guarantee",
		text: "Premium quality products with manufacturer warranty",
		badge: "Certified",
		color: "success",
	},
	{
		icon: Headphones,
		label: "24/7 Customer Support",
		text: "Round-the-clock assistance for all your queries",
		badge: "Always On",
		color: "secondary",
	},
	{
		icon: Truck,
		label: "Free Shipping",
		text: "Complimentary shipping on orders above ₹999",
		badge: "₹999+",
		color: "primary",
	},
	{
		icon: Award,
		label: "Authentic Products",
		text: "100% genuine products from verified brands",
		badge: "Verified",
		color: "warning",
	},
	{
		icon: Clock,
		label: "Quick Delivery",
		text: "Fast and reliable delivery within 2-5 business days",
		badge: "2-5 Days",
		color: "error",
	},
] as FeaturesItemsProp[];

export const NEWSLETTER_ITEMS = [
	{
		label: "Early Access",
		text: "Be first to shop new collections",
		icon: "🚀",
	},
	{
		label: "Special Discounts",
		text: "Exclusive subscriber-only deals",
		icon: "💰",
	},
	{
		label: "Style Tips",
		text: "Weekly fashion insights & trends",
		icon: "✨",
	},
] as FeaturesItemsProp[];

export const SECTION_INFO = {
	policy: {
		label: "Why Choose Us",
		heading: "Our Service Commitment",
		text: "We're dedicated to providing exceptional service and ensuring your complete satisfaction with every purchase.",
	},
} as SectionHeadersType;
