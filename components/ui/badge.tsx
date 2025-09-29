import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const floatingBadgeVariants = cva(
	"absolute z-20 rounded-lg shadow-lg backdrop-blur-xs",
	{
		variants: {
			variant: {
				accent: "bg-accent text-accent-content",
				primary: "bg-primary text-primary-content",
				success: "bg-success text-success-content",
				warning: "bg-warning text-warning-content",
				error: "bg-error text-error-content",
				info: "bg-info text-info-content",
				neutral: "bg-neutral text-neutral-content",
			},
			size: {
				xs: "text-xs font-semibold px-2 py-1",
				small: "text-sm font-semibold px-4 py-2",
				medium: "text-base font-bold px-5 py-3",
				large: "text-lg font-bold px-6 py-4",
			},
			position: {
				"top-left": "top-2 left-2",
				"top-right": "top-2 right-2",
				"bottom-left": "bottom-2 left-2",
				"bottom-right": "bottom-2 right-2",
				"top-center": "top-2 left-1/2 transform -translate-x-1/2",
				"bottom-center": "bottom-2 left-1/2 transform -translate-x-1/2",
			},
		},
		defaultVariants: {
			variant: "accent",
			size: "small",
			position: "top-right",
		},
	}
);

export interface FloatingBadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof floatingBadgeVariants> {}

export const FloatingBadge = ({
	className,
	variant,
	size,
	position,
	children,
	...props
}: FloatingBadgeProps) => {
	return (
		<div
			className={cn(
				floatingBadgeVariants({ variant, size, position }),
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

const statusBadgeVariants = cva(
  "badge px-4 py-2 font-medium border",
  {
    variants: {
      type: {
        info: "bg-info/20 text-info border-info/50",
        neutral: "bg-neutral/20 text-neutral border-neutral/50",
        success: "bg-success/20 text-success border-success/50",
        primary: "bg-primary/20 text-primary border-primary/50",
        secondary: "bg-secondary/20 text-secondary border-secondary/50",
        accent: "bg-accent/20 text-accent border-accent/50",
        warning: "bg-warning/20 text-warning border-warning/50",
        error: "bg-error/20 text-error border-error/50",
      },
      size: {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
      },
      variant: {
        solid: "",
        outline: "bg-transparent border-2",
        subtle: "border-0",
      },
    },
    compoundVariants: [
      // Solid variants (default - already defined in type classes)
      // Outline variants
      {
        type: "info",
        variant: "outline",
        class: "bg-transparent text-info border-info",
      },
      {
        type: "success",
        variant: "outline",
        class: "bg-transparent text-success border-success",
      },
      {
        type: "warning",
        variant: "outline",
        class: "bg-transparent text-warning border-warning",
      },
      {
        type: "error",
        variant: "outline",
        class: "bg-transparent text-error border-error",
      },
      {
        type: "primary",
        variant: "outline",
        class: "bg-transparent text-primary border-primary",
      },
      // Subtle variants (no border)
      {
        type: "info",
        variant: "subtle",
        class: "bg-info/10 text-info border-0",
      },
      {
        type: "success",
        variant: "subtle",
        class: "bg-success/10 text-success border-0",
      },
      {
        type: "warning",
        variant: "subtle",
        class: "bg-warning/10 text-warning border-0",
      },
      {
        type: "error",
        variant: "subtle",
        class: "bg-error/10 text-error border-0",
      },
    ],
    defaultVariants: {
      type: "info",
      size: "sm",
      variant: "solid",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

export const StatusBadge = ({
  className,
  type,
  size,
  variant,
  children,
  ...props
}: StatusBadgeProps) => {
  return (
    <span
      className={cn(statusBadgeVariants({ type, size, variant }), className)}
      {...props}
    >
      {children}
    </span>
  );
};