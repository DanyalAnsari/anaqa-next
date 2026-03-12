import { Card, CardContent } from "@/components/ui/card";
import { getCustomers, getCustomerStats } from "./_lib/data";
import { CustomersTable } from "./_components/customers-table";
import { StatsCards } from "./_components/stats-cards";

interface PageProps {
	searchParams: Promise<{
		search?: string;
		status?: "all" | "active" | "banned";
		role?: "all" | "customer" | "admin";
		page?: string;
	}>;
}

export default async function CustomersPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;

	const [customersData, stats] = await Promise.all([
		getCustomers({
			search: params.search,
			status: params.status,
			role: params.role,
			page,
		}),
		getCustomerStats(),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Customers</h1>
				<p className="text-muted-foreground text-sm">
					Manage customer accounts and access.
				</p>
			</div>

			<StatsCards stats={stats} />

			<Card>
				<CardContent className="pt-6">
					<CustomersTable {...customersData} />
				</CardContent>
			</Card>
		</div>
	);
}
