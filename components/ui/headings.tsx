import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-bold text-primary", {
  variants: {
    level: {
      h1: "text-4xl lg:text-6xl",
      h2: "text-4xl",
      h3: "text-2xl lg:text-3xl",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = ({
  className,
  level,
  as, // Optional prop to override the HTML element
  children,
  ...props
}: HeadingProps) => {
  const Comp = as || level || "h1";
  
  return (
    <Comp
      className={cn(headingVariants({ level }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

// Convenience exports for each heading level
export const H1 = (props: Omit<HeadingProps, "level" | "as">) => (
  <Heading level="h1" {...props} />
);

export const H2 = (props: Omit<HeadingProps, "level" | "as">) => (
  <Heading level="h2" {...props} />
);

export const H3 = (props: Omit<HeadingProps, "level" | "as">) => (
  <Heading level="h3" {...props} />
);

export const H4 = (props: Omit<HeadingProps, "level" | "as">) => (
  <Heading level="h4" {...props} />
);

export const H5 = (props: Omit<HeadingProps, "level" | "as">) => (
  <Heading level="h5" {...props} />
);

export const H6 = (props: Omit<HeadingProps, "level" | "as">) => (
  <Heading level="h6" {...props} />
);