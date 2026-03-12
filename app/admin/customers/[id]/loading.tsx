import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetailLoading() {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10 rounded-md" />
				<div>
					<Skeleton className="h-7 w-40 mb-1" />
					<Skeleton className="h-4 w-48" />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					{/* Profile */}
					<Card>
						<CardContent className="pt-6">
							<div className="flex items-start gap-6">
								<Skeleton className="h-20 w-20 rounded-full" />
								<div className="space-y-3 flex-1">
									<Skeleton className="h-6 w-48" />
									<Skeleton className="h-4 w-64" />
									<Skeleton className="h-4 w-40" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Stats */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div>
											<Skeleton className="h-6 w-12 mb-1" />
											<Skeleton className="h-3 w-16" />
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Orders */}
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-32" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-48 w-full" />
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div>
					<Card>
						<CardHeader>
							<Skeleton className="h-5 w-20" />
						</CardHeader>
						<CardContent className="space-y-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<Skeleton key={i} className="h-10 w-full" />
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
