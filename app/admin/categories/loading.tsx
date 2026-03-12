import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-32 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>
			<div className="flex justify-end">
				<Skeleton className="h-10 w-36" />
			</div>
			<Card>
				<CardContent className="pt-6">
					<Skeleton className="h-64 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
