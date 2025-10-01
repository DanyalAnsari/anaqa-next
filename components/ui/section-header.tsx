import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { H1, H2, H3 } from "./headings";
import Text from "./text";

const sectionHeaderVariants = cva("text-center", {
	variants: {
		variant: {
			main: "mb-12 md:mb-16",
			sub: "mb-12",
			subSuccess: "mb-12",
			small: "mb-8",
		},
	},
	defaultVariants: {
		variant: "main",
	},
});

const dividerVariants = cva("h-1 rounded-full", {
	variants: {
		variant: {
			main: "w-12 bg-secondary",
			sub: "w-8 bg-accent",
			subSuccess: "w-8 bg-success",
			small: "w-12 bg-secondary",
		},
	},
	defaultVariants: {
		variant: "main",
	},
});

const labelVariants = cva("", {
	variants: {
		variant: {
			main: "text-secondary",
			sub: "text-accent",
			subSuccess: "text-success",
			small: "text-secondary",
		},
	},
	defaultVariants: {
		variant: "main",
	},
});

const descriptionVariants = cva("", {
	variants: {
		variant: {
			main: "max-w-xl mx-auto",
			sub: "",
			subSuccess: "",
			small: "",
		},
	},
	defaultVariants: {
		variant: "main",
	},
});

export interface SectionHeaderProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof sectionHeaderVariants> {
	label?: string;
	icon?: ReactNode;
	heading?: string;
	description?: string;
	headingLevel?: "h1" | "h2" | "h3";
}

export const SectionHeader = ({
	className,
	variant = "main",
	label = "",
	icon,
	heading = "",
	description = "",
	headingLevel = "h2",
	...props
}: SectionHeaderProps) => {
	// Determine heading component based on variant and headingLevel prop
	const renderHeading = () => {
		const headingProps = {
			className: cn(
				variant === "main" ? "mb-4" : variant === "small" ? "mb-2" : "mb-3"
			),
		};

		switch (headingLevel) {
			case "h1":
				return <H1 {...headingProps}>{heading}</H1>;
			case "h2":
				return <H2 {...headingProps}>{heading}</H2>;
			case "h3":
				return <H3 {...headingProps}>{heading}</H3>;
			default:
				return <H2 {...headingProps}>{heading}</H2>;
		}
	};

	// Determine text body variant based on section header variant
	const getTextVariant = (): "large" | "regular" => {
		return variant === "main" ? "large" : "regular";
	};

	return (
		<div
			className={cn(sectionHeaderVariants({ variant }), className)}
			{...props}
		>
			{label && (
				<div className="flex items-center justify-center gap-3 mb-4">
					<div className={cn(dividerVariants({ variant }))} />
					{icon || (
						<Text variant="badge" className={cn(labelVariants({ variant }))}>
							{label}
						</Text>
					)}
					<div className={cn(dividerVariants({ variant }))} />
				</div>
			)}

			{heading && renderHeading()}

			{description && (
				<Text
					variant={getTextVariant()}
					className={cn(descriptionVariants({ variant }))}
				>
					{description}
				</Text>
			)}
		</div>
	);
};
