import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ProductNotFound() {
	return (
		<div className="container-wide py-16">
			<div className="text-center">
				<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
					<AlertCircle className="h-8 w-8 text-destructive" />
				</div>
				<h1 className="text-2xl font-medium mb-2">Product Not Found</h1>
				<p className="text-muted-foreground mb-6">
					The product you&apos;re looking for doesn&apos;t exist or has been
					removed.
				</p>
				<Button asChild>
					<Link href="/shop">Continue Shopping</Link>
				</Button>
			</div>
		</div>
	);
}
