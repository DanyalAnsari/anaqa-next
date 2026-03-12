import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getProducts } from "./_lib/data";
import { ProductsTable } from "./_components/products-table";

interface PageProps {
	searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const data = await getProducts({
		search: params.search,
		status: params.status as any,
		page,
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold">Products</h1>
					<p className="text-muted-foreground text-sm">
						Manage your product catalog.
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/products/new">
						<Plus className="h-4 w-4 mr-2" />
						Add Product
					</Link>
				</Button>
			</div>
			<Card>
				<CardContent className="pt-6">
					<ProductsTable {...data} />
				</CardContent>
			</Card>
		</div>
	);
}
