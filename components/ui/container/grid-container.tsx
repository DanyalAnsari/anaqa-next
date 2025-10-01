import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Generic grid variants
const gridVariants = cva("grid", {
	variants: {
		columns: {
			1: "grid-cols-1",
			2: "grid-cols-2",
			3: "grid-cols-3",
			4: "grid-cols-4",
		},
		gap: {
			none: "gap-0",
			sm: "gap-2",
			md: "gap-6",
			lg: "gap-10",
			xl: "gap-12",
		},
		layout: {
			default: "",
			list: "max-w-4xl",
			"feature-grid": "md:grid-cols-3",
			responsive: "md:grid-cols-2 lg:grid-cols-4",
		},
	},
	compoundVariants: [
		{
			layout: "list",
			gap: "md",
			class: "grid-cols-1",
		},
		{
			layout: "feature-grid",
			gap: "lg",
			class: "grid-cols-1",
		},
	],
	defaultVariants: {
		columns: 1,
		gap: "md",
		layout: "default",
	},
});

export interface GridContainerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof gridVariants> {}

const GridContainer = ({
	className,
	columns,
	gap,
	layout,
	children,
	...props
}: GridContainerProps) => {
	return (
		<div
			className={cn(gridVariants({ columns, gap, layout }), className)}
			{...props}
		>
			{children}
		</div>
	);
};

export default GridContainer;
