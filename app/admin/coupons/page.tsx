import { Card, CardContent } from "@/components/ui/card";
import { getCoupons } from "./_lib/data";
import { CouponsClient } from "./_components/coupon-client";

interface PageProps {
	searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function CouponsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;
	const data = await getCoupons({
		search: params.search,
		status: params.status as any,
		page,
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Coupons</h1>
				<p className="text-muted-foreground text-sm">
					Manage discount codes and promotions.
				</p>
			</div>
			<CouponsClient {...data} />
		</div>
	);
}
