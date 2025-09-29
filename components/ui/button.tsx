import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva("btn no-animation transition-all duration-300", {
	variants: {
		variant: {
			primary: "btn-primary  hover:bg-primary/90 shadow-lg hover:shadow-xl",
			secondary:
				"btn-outline border-secondary text-secondary hover:bg-secondary hover:text-secondary-content hover:border-secondary",
			outline: "btn-outline hover:btn-primary shadow-lg hover:shadow-xl",
			ghost: "btn-ghost",
			link: "btn btn-link text-secondary hover:text-primary normal-case underline-offset-4 hover:underline",
			destructive:
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
			success: "bg-success text-success-foreground hover:bg-success/90",
			// Specialized variants
			"number-r": "hover:bg-accent rounded-r-lg",
			"number-l": "hover:bg-accent rounded-l-lg",
			sizeBtn:
				"border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
			icon: "h-10 w-10 rounded-full hover:bg-accent",
		},
		size: {
			sm: "h-9 px-3 text-xs",
			md: "h-10 px-4 py-2",
			lg: "h-11 px-8 text-base",
			xl: "h-12 px-8 text-lg",
			icon: "h-10 w-10",
		},
		animated: {
			true: "opacity-0 group-hover:opacity-100 transform transition-all duration-300",
			false: "",
		},
	},
	compoundVariants: [
		// SizeBtn specific styles
		{
			variant: "sizeBtn",
			className: "w-12 h-12 font-semibold",
		},
		// Number variants specific styles
		{
			variant: ["number-r", "number-l"],
			className: "h-10 w-10 font-mono text-lg",
		},
		// Primary and outline should have specific sizes by default
		{
			variant: ["primary", "secondary", "outline"],
			size: "lg",
			className: "font-semibold",
		},
	],
	defaultVariants: {
		variant: "primary",
		size: "md",
		animated: false,
	},
});

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, animated, children, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, animated, className }))}
				ref={ref}
				{...props}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";

export default Button;
