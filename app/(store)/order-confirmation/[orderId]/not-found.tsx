import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function OrderConfirmationNotFound() {
	return (
		<div className="container-narrow py-16 text-center">
			<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
				<AlertCircle className="h-8 w-8 text-destructive" />
			</div>
			<h1 className="text-2xl font-medium mb-2">Order Not Found</h1>
			<p className="text-muted-foreground mb-6">
				We couldn&apos;t find this order.
			</p>
			<Button asChild>
				<Link href="/account/orders">View My Orders</Link>
			</Button>
		</div>
	);
}
