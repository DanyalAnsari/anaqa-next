import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textBodyVariants = cva("text-neutral", {
	variants: {
		variant: {
			large: "text-lg leading-relaxed",
			regular: "text-base",
			small: "text-sm",
			caption: "text-xs font-medium",
			label: "text-sm font-medium text-primary",
			badge: "text-sm font-semibold uppercase tracking-wider",
		},
	},
	defaultVariants: {
		variant: "regular",
	},
});

export interface TextBodyProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof textBodyVariants> {}

const Text = ({ className, variant, children, ...props }: TextBodyProps) => {
	return (
		<p className={cn(textBodyVariants({ variant }), className)} {...props}>
			{children}
		</p>
	);
};

export default Text;
