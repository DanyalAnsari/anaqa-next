"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyOrderNumber({ orderNumber }: { orderNumber: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(orderNumber);
			setCopied(true);
			toast.success("Order number copied!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy");
		}
	};

	return (
		<div className="flex items-center justify-center gap-2">
			<span className="text-2xl font-mono font-medium">{orderNumber}</span>
			<Button
				variant="ghost"
				size="icon"
				onClick={handleCopy}
				className="h-8 w-8"
			>
				{copied ?
					<Check className="h-4 w-4 text-green-600" />
				:	<Copy className="h-4 w-4" />}
			</Button>
		</div>
	);
}
