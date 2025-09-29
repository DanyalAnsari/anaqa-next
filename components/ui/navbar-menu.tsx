import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { cva } from "class-variance-authority";

interface Props extends BaseComponentProps {
  variant?: "mobile" | "desktop";
  tabIndex?: number;
}

const navLink = cva("nav-link", {
  variants: {
    variant: {
      desktop: "flex flex-col items-center gap-1 font-medium hover:text-primary normal-case underline-offset-6 hover:underline",
      mobile: "",
    },
  },
  defaultVariants: {
    variant: "desktop",
  },
});

const NavbarMenu = ({ className, variant = "desktop", tabIndex }: Props) => {
  return (
    <ul
      {...(tabIndex !== undefined && { tabIndex })}
      className={cn("menu", className)}
    >
      {NAV_ITEMS.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className={navLink({ variant })}>
            {label}
            {variant === "desktop" && (
              <span className="w-1/2 h-[1.5px] bg-primary hidden" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavbarMenu;
