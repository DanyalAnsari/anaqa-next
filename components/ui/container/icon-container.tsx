import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const hoverIconContainerVariants = cva(
	"flex items-center justify-center flex-col rounded-2xl cursor-pointer transition-all duration-300 border",
	{
		variants: {
			hoverEffect: {
				"scale-105": "hover:scale-105",
				"scale-110": "hover:scale-110",
				"scale-95": "hover:scale-95",
				"rotate-12": "hover:rotate-12",
				"rotate-45": "hover:rotate-45",
				"shadow-lg": "hover:shadow-lg",
				"shadow-xl": "hover:shadow-xl",
				grayscale: "hover:grayscale-0", // assuming it starts with grayscale
				"brightness-110": "hover:brightness-110",
			},
			shadow: {
				none: "",
				sm: "hover:shadow-sm",
				md: "hover:shadow-md",
				lg: "hover:shadow-lg",
				xl: "hover:shadow-xl",
			},
		},
		defaultVariants: {
			hoverEffect: "scale-105",
			shadow: "lg",
		},
	}
);

export interface HoverIconContainerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof hoverIconContainerVariants> {}

export const HoverIconContainer = ({
	className,
	hoverEffect,
	shadow,
	children,
	...props
}: HoverIconContainerProps) => {
	return (
		<div
			className={cn(
				hoverIconContainerVariants({ hoverEffect, shadow }),
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

const iconBaseContainerVariants = cva(
	"flex items-center justify-center rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300 border",
	{
		variants: {
			hoverEffect: {
				"scale-105": "group-hover:scale-105",
				"scale-110": "group-hover:scale-110",
				"scale-95": "group-hover:scale-95",
				"rotate-12": "group-hover:rotate-12",
				"rotate-45": "group-hover:rotate-45",
				grayscale: "group-hover:grayscale-0",
				"brightness-110": "group-hover:brightness-110",
				none: "", // No hover effect
			},
			margin: {
				auto: "mx-auto",
				left: "ml-auto",
				right: "mr-auto",
				none: "mx-0",
				xsmall: "mx-1",
				small: "mx-2",
				medium: "mx-4",
				large: "mx-6",
			},
			size: {
				sm: "w-8 h-8",
				md: "w-12 h-12",
				lg: "w-16 h-16",
				xl: "w-20 h-20",
			},
		},
		defaultVariants: {
			hoverEffect: "scale-105",
			margin: "auto",
			size: "md",
		},
	}
);

export interface IconBaseContainerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof iconBaseContainerVariants> {}

export const IconBaseContainer = ({
	className,
	hoverEffect,
	margin,
	size,
	children,
	...props
}: IconBaseContainerProps) => {
	return (
		<div
			className={cn(
				iconBaseContainerVariants({ hoverEffect, margin, size }),
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};
