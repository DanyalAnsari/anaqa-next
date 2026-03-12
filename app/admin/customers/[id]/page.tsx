import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getCustomerDetail } from "../_lib/data";
import { CustomerInfo } from "./_components/customer-info";
import { CustomerOrders } from "./_components/customer-orders";
import { CustomerActions } from "./_components/customer-actions";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
	const { id } = await params;
	const customer = await getCustomerDetail(id);

	if (!customer) {
		notFound();
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/customers">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-semibold">Customer Details</h1>
					<p className="text-muted-foreground text-sm">{customer.email}</p>
				</div>
			</div>

			{/* Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					<CustomerInfo customer={customer} />
					<CustomerOrders
						orders={customer.recentOrders}
						customerId={customer.id}
					/>
				</div>

				{/* Sidebar */}
				<div>
					<CustomerActions customer={customer} />
				</div>
			</div>
		</div>
	);
}
