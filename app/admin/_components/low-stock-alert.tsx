import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface LowStockProduct {
	id: string;
	name: string;
	slug: string;
	totalStock: number;
}

interface LowStockAlertProps {
	products: LowStockProduct[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
	if (products.length === 0) return null;

	return (
		<Card className="border-orange-200 dark:border-orange-900">
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-medium flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-orange-500" />
					Low Stock Alert
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{products.map((product) => (
						<div key={product.id} className="flex items-center justify-between">
							<Link
								href={`/admin/products/${product.id}`}
								className="text-sm hover:underline truncate max-w-[200px]"
							>
								{product.name}
							</Link>
							<Badge
								variant={product.totalStock === 0 ? "destructive" : "secondary"}
							>
								{product.totalStock === 0 ?
									"Out of stock"
								:	`${product.totalStock} left`}
							</Badge>
						</div>
					))}
				</div>
				<Button asChild variant="ghost" size="sm" className="w-full mt-4">
					<Link href="/admin/products?stock=low">
						View all low stock
						<ArrowRight className="h-4 w-4 ml-1" />
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
