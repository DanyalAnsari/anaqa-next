import type { CSSProperties } from "react";

/*
 * Anāqa Email Theme
 *
 * Hex approximations of the OKLCH design system.
 * Email clients don't support OKLCH or CSS variables,
 * so we use hardcoded hex values that match the brand.
 */

// ─── Colors ─────────────────────────────────────────────────────────────────

export const colors = {
	// Core
	background: "#F0EBE3", // Body bg — warm sand
	surface: "#FFFFFF", // Container bg — clean white
	foreground: "#3D3832", // Primary text — warm charcoal
	mutedForeground: "#918981", // Secondary text — warm gray
	border: "#E0DBD2", // Dividers & borders

	// Tints
	cream: "#F5F0E8", // Highlight bg — warm cream
	sand: "#EAE5DC", // Secondary bg — warm sand

	// Primary (charcoal)
	primary: "#3D3832",
	primaryForeground: "#F5F0E8",

	// Destructive
	destructive: "#BE4538",

	// Alert boxes
	warning: {
		bg: "#FEF9EE",
		border: "#E8C97A",
		text: "#7A6420",
	},
	danger: {
		bg: "#FEF2F0",
		border: "#E8A99A",
		text: "#8B2E1E",
	},
	success: {
		bg: "#F0F5EE",
		border: "#A8C9A0",
		text: "#3D6B35",
	},
} as const;

// ─── Fonts ──────────────────────────────────────────────────────────────────

export const fonts = {
	heading: "Georgia, 'Times New Roman', Times, serif",
	body: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

// ─── Reusable Styles ────────────────────────────────────────────────────────

export const heading = (size: number = 24): CSSProperties => ({
	fontFamily: fonts.heading,
	fontSize: `${size}px`,
	fontWeight: "400",
	color: colors.foreground,
	margin: "0 0 20px",
	lineHeight: `${Math.round(size * 1.35)}px`,
	letterSpacing: "-0.01em",
});

export const paragraph: CSSProperties = {
	fontSize: "15px",
	lineHeight: "26px",
	color: colors.foreground,
	margin: "0 0 16px",
};

export const muted: CSSProperties = {
	fontSize: "13px",
	lineHeight: "22px",
	color: colors.mutedForeground,
	margin: "0 0 8px",
};

export const primaryButton: CSSProperties = {
	backgroundColor: colors.primary,
	color: colors.primaryForeground,
	padding: "14px 32px",
	borderRadius: "4px",
	fontSize: "13px",
	fontWeight: "500",
	textDecoration: "none",
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	display: "inline-block",
};

export const destructiveButton: CSSProperties = {
	...primaryButton,
	backgroundColor: colors.destructive,
	color: "#FFFFFF",
};

export const linkStyle: CSSProperties = {
	fontSize: "13px",
	color: colors.foreground,
	wordBreak: "break-all",
	textDecoration: "underline",
};

export const alertBox = (
	variant: "warning" | "danger" | "success",
): CSSProperties => ({
	backgroundColor: colors[variant].bg,
	border: `1px solid ${colors[variant].border}`,
	borderRadius: "4px",
	padding: "16px 20px",
	margin: "24px 0 0",
});

export const alertText = (
	variant: "warning" | "danger" | "success",
): CSSProperties => ({
	fontSize: "14px",
	lineHeight: "22px",
	color: colors[variant].text,
	margin: "0",
});

export const productCard: CSSProperties = {
	backgroundColor: colors.cream,
	padding: "20px 24px",
	borderRadius: "4px",
	margin: "24px 0",
	border: `1px solid ${colors.border}`,
};
