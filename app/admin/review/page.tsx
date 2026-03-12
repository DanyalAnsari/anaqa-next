import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { getReviews, getReviewStats } from "./_lib/data";
import { ReviewsTable } from "./_components/reviews-table";

interface PageProps {
	searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;

	const [data, stats] = await Promise.all([
		getReviews({ status: params.status as any, page }),
		getReviewStats(),
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Reviews</h1>
				<p className="text-muted-foreground text-sm">
					Moderate customer reviews.
				</p>
			</div>

			<div className="grid grid-cols-3 gap-4">
				{[
					{
						label: "Total",
						value: stats.total,
						icon: MessageSquare,
						color: "text-blue-600",
						bg: "bg-blue-100 dark:bg-blue-900/30",
					},
					{
						label: "Pending",
						value: stats.pending,
						icon: Clock,
						color: "text-yellow-600",
						bg: "bg-yellow-100 dark:bg-yellow-900/30",
					},
					{
						label: "Approved",
						value: stats.approved,
						icon: CheckCircle2,
						color: "text-green-600",
						bg: "bg-green-100 dark:bg-green-900/30",
					},
				].map((s) => (
					<Card key={s.label}>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div
									className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center`}
								>
									<s.icon className={`h-5 w-5 ${s.color}`} />
								</div>
								<div>
									<p className="text-2xl font-semibold">{s.value}</p>
									<p className="text-xs text-muted-foreground">{s.label}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<ReviewsTable {...data} />
		</div>
	);
}
