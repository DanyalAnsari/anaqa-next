"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { BellOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { removeFromWaitlist } from "../actions";

interface WaitlistRemoveButtonProps {
	waitlistId: string;
}

export function WaitlistRemoveButton({
	waitlistId,
}: WaitlistRemoveButtonProps) {
	const [isPending, startTransition] = useTransition();

	const handleRemove = () => {
		startTransition(async () => {
			const result = await removeFromWaitlist(waitlistId);
			if (result.success) {
				toast.success("Removed from waitlist");
			} else {
				toast.error(result.error);
			}
		});
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
			onClick={handleRemove}
			disabled={isPending}
		>
			{isPending ?
				<Loader2 className="h-4 w-4 animate-spin" />
			:	<BellOff className="h-4 w-4" />}
			<span className="sr-only">Remove from waitlist</span>
		</Button>
	);
}
