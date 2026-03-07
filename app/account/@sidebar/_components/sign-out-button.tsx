"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		setIsLoading(true);
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success("Signed out successfully");
						router.push("/");
						router.refresh();
					},
					onError: (ctx) => {
						toast.error(ctx.error.message ?? "Signing out failed");
						setIsLoading(false);
					},
				},
			});
		} catch (error) {
			toast.error("Signing out failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant="ghost"
			className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
			onClick={handleSignOut}
			disabled={isLoading}
		>
			<LogOut className="h-4 w-4 mr-3" />
			{isLoading ? "Signing out..." : "Sign Out"}
		</Button>
	);
}
