import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createId } from "@paralleldrive/cuid2";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const SAR_FORMATTER = new Intl.NumberFormat("en-SA", {
	style: "currency",
	currency: "SAR",
	minimumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
	return SAR_FORMATTER.format(amount);
}

export const genId = () => createId();

export const getInitials = (name: string) => {
	let initials: string;
	if (!name.trim()) return "?";
	const fullName = name.split(" ");
	const firstName = fullName[0];
	const lastName = fullName[fullName.length - 1];
	initials = fullName.length > 1 ? `${firstName[0]}${lastName[0]}` : firstName[0];
	return initials.toUpperCase();
};
