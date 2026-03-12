import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-32 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div>
									<Skeleton className="h-7 w-12 mb-1" />
									<Skeleton className="h-3 w-16" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardContent className="pt-6 space-y-4">
					<div className="flex gap-3">
						<Skeleton className="h-10 flex-1" />
						<Skeleton className="h-10 w-36" />
						<Skeleton className="h-10 w-36" />
					</div>
					<Skeleton className="h-96 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
