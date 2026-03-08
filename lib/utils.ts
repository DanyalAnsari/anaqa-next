import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
