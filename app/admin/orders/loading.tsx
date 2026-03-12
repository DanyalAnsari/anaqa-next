import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
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
							<Skeleton className="h-16 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="pt-6">
					<Skeleton className="h-96 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
