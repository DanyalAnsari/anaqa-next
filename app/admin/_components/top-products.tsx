import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

interface TopProduct {
	id: string;
	name: string;
	slug: string;
	soldCount: number;
	price: string;
}

interface TopProductsProps {
	products: TopProduct[];
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "SAR",
	}).format(amount);
}

export function TopProducts({ products }: TopProductsProps) {
	if (products.length === 0) return null;

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base font-medium flex items-center gap-2">
					<TrendingUp className="h-4 w-4 text-green-500" />
					Top Selling Products
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{products.map((product, index) => (
						<div key={product.id} className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="text-sm text-muted-foreground w-4">
									{index + 1}.
								</span>
								<Link
									href={`/admin/products/${product.id}`}
									className="text-sm hover:underline truncate max-w-[180px]"
								>
									{product.name}
								</Link>
							</div>
							<div className="text-right">
								<p className="text-sm font-medium">{product.soldCount} sold</p>
								<p className="text-xs text-muted-foreground">
									{formatCurrency(Number(product.price))}
								</p>
							</div>
						</div>
					))}
				</div>
				<Button asChild variant="ghost" size="sm" className="w-full mt-4">
					<Link href="/admin/products?sort=sold">
						View all products
						<ArrowRight className="h-4 w-4 ml-1" />
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
