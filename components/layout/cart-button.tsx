"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";
import { openCartDrawer } from "@/app/(store)/cart/_components/cart-drawer";

interface CartButtonProps {
	itemCount: number;
}

export function CartButton({ itemCount }: CartButtonProps) {
	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label="Shopping bag"
			className="relative"
			onClick={() => openCartDrawer()}
		>
			<ShoppingBag className="h-5 w-5" />
			{itemCount > 0 && (
				<Badge
					variant="default"
					className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
				>
					{itemCount > 99 ? "99+" : itemCount}
				</Badge>
			)}
		</Button>
	);
}
