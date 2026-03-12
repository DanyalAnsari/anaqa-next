import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-32 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-10 w-10 rounded-full mb-4" />
							<Skeleton className="h-8 w-24 mb-2" />
							<Skeleton className="h-4 w-20" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Quick Actions */}
			<div>
				<Skeleton className="h-5 w-28 mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-20" />
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<Skeleton className="h-5 w-32" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>
				<div className="space-y-6">
					<Skeleton className="h-48" />
					<Skeleton className="h-48" />
				</div>
			</div>
		</div>
	);
}
