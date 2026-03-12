import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
	return (
		<div className="max-w-5xl space-y-6">
			<Skeleton className="h-8 w-64" />
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-20" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-48" />
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-32" />
						</CardContent>
					</Card>
				</div>
				<div className="space-y-6">
					<Card>
						<CardContent className="pt-6">
							<Skeleton className="h-48" />
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<Skeleton className="h-40" />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
