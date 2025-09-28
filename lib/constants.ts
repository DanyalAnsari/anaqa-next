import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
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
