"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface SignOutButtonProps {
	variant?: "dropdown" | "mobile" | "button";
	onSuccess?: () => void;
}

export function SignOutButton({
	variant = "button",
	onSuccess,
}: SignOutButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		setIsLoading(true);
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success("Signed out successfully");
						onSuccess?.();
						router.push("/");
						router.refresh();
					},
					onError: (ctx) => {
						toast.error(ctx.error.message ?? "Signing out failed");
					},
				},
			});
		} catch {
			toast.error("Signing out failed");
		} finally {
			setIsLoading(false);
		}
	};

	if (variant === "dropdown") {
		return (
			<DropdownMenuItem
				onClick={handleSignOut}
				disabled={isLoading}
				className="cursor-pointer text-destructive focus:text-destructive"
			>
				{isLoading ?
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				:	<LogOut className="mr-2 h-4 w-4" />}
				{isLoading ? "Signing out…" : "Sign Out"}
			</DropdownMenuItem>
		);
	}

	if (variant === "mobile") {
		return (
			<button
				onClick={handleSignOut}
				disabled={isLoading}
				className="text-lg font-medium py-2 text-muted-foreground hover:text-foreground transition-colors text-left"
			>
				{isLoading ? "Signing out…" : "Sign Out"}
			</button>
		);
	}

	return (
		<Button
			variant="ghost"
			onClick={handleSignOut}
			disabled={isLoading}
			className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
		>
			{isLoading ?
				<Loader2 className="h-4 w-4 mr-3 animate-spin" />
			:	<LogOut className="h-4 w-4 mr-3" />}
			{isLoading ? "Signing out…" : "Sign Out"}
		</Button>
	);
}
