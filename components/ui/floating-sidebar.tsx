// components/ui/floating-sidebar.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";


interface FloatingSidebarProps {
	children: React.ReactNode;
	className?: string;
	mobileTitle?: string;
}

interface FloatingSidebarContextValue {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	isMobile: boolean;
}

const FloatingSidebarContext = React.createContext<
	FloatingSidebarContextValue | undefined
>(undefined);

export function useFloatingSidebar() {
	const context = React.useContext(FloatingSidebarContext);
	if (!context) {
		throw new Error(
			"useFloatingSidebar must be used within a FloatingSidebarProvider",
		);
	}
	return context;
}

export function FloatingSidebarProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isMobile, setIsMobile] = React.useState(false);

	React.useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<FloatingSidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
			{children}
		</FloatingSidebarContext.Provider>
	);
}

export function FloatingSidebar({
	children,
	className,
	mobileTitle = "Account Menu",
}: FloatingSidebarProps) {
	const { isOpen, setIsOpen, isMobile } = useFloatingSidebar();

	if (isMobile) {
		return (
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-background border-border hover:bg-accent md:hidden"
					>
						<Menu className="h-6 w-6" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-80 p-0">
					<SheetHeader className="sr-only">
						<SheetTitle>{mobileTitle}</SheetTitle>
					</SheetHeader>
					<ScrollArea className="h-full py-6 px-4">{children}</ScrollArea>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<aside
			className={cn(
				"sticky top-24 h-fit max-h-[calc(100vh-8rem)]",
				"rounded-xl border border-border bg-background/80 backdrop-blur-sm",
				"shadow-sm",
				"overflow-hidden",
				className,
			)}
		>
			<ScrollArea className="h-full max-h-[calc(100vh-8rem)]">
				<div className="p-4">{children}</div>
			</ScrollArea>
		</aside>
	);
}

export function FloatingSidebarHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("pb-4", className)}>{children}</div>;
}

export function FloatingSidebarContent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function FloatingSidebarFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("pt-4", className)}>{children}</div>;
}
