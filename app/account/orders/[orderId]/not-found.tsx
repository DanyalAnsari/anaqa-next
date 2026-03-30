// app/account/orders/[orderId]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function OrderNotFound() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
				<AlertCircle className="h-8 w-8 text-destructive" />
			</div>
			<h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
			<p className="text-muted-foreground mb-6 max-w-sm">
				This order doesn&apos;t exist or you don&apos;t have permission to view
				it.
			</p>
			<Button asChild className="gap-2">
				<Link href="/account/orders">
					<ArrowLeft className="h-4 w-4" />
					Back to Orders
				</Link>
			</Button>
		</div>
	);
}
