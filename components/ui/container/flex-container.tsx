import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const flexVariants = cva("flex", {
	variants: {
		direction: {
			row: "flex-row",
			"row-reverse": "flex-row-reverse",
			column: "flex-col",
			"column-reverse": "flex-col-reverse",
		},
		align: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
			baseline: "items-baseline",
		},
		justify: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
			evenly: "justify-evenly",
		},
		wrap: {
			nowrap: "flex-nowrap",
			wrap: "flex-wrap",
			"wrap-reverse": "flex-wrap-reverse",
		},
	},
	defaultVariants: {
		direction: "row",
		align: "center",
		justify: "center",
		wrap: "nowrap",
	},
});

export interface FlexContainerProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof flexVariants> {}

export const FlexContainer = ({
	className,
	direction,
	align,
	justify,
	wrap,
	children,
	...props
}: FlexContainerProps) => {
	return (
		<div
			className={cn(
				flexVariants({ direction, align, justify, wrap }),
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};
