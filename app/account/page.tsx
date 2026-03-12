import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ArrowRight,
	CheckCircle,
	AlertCircle,
	Mail,
	Calendar,
	Phone,
	Shield,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { QuickLinks } from "./_components/quick-links";
import { RecentOrders } from "./_components/recent-orders";
import { RecentReviews } from "./_components/recent-reviews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AccountOverviewPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const user = session?.user;
	const isVerified = user?.emailVerified;

	if (!user) {
		return null;
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header Section */}
			<div className="flex items-start justify-between flex-wrap gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Welcome back, {user.name ?? "there"}!
					</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences.
					</p>
				</div>
				{isVerified ?
					<Badge
						variant="secondary"
						className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 border-green-500/20"
					>
						<CheckCircle className="h-3.5 w-3.5" />
						Verified Account
					</Badge>
				:	<Badge
						variant="destructive"
						className="flex items-center gap-1.5 px-3 py-1.5"
					>
						<AlertCircle className="h-3.5 w-3.5" />
						Email Not Verified
					</Badge>
				}
			</div>

			{/* Email Verification Alert */}
			{!isVerified && (
				<Alert
					variant="destructive"
					className="border-destructive/50 bg-destructive/5"
				>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Verify your email</AlertTitle>
					<AlertDescription className="mt-2 space-y-2">
						<p>Please verify your email address to access all features.</p>
						<Button variant="outline" size="sm" asChild className="mt-2">
							<Link href="/auth/verify-email">Verify Now</Link>
						</Button>
					</AlertDescription>
				</Alert>
			)}

			<Tabs defaultValue="overview" className="space-y-6">
				<TabsList className="bg-secondary/50">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="activity">Activity</TabsTrigger>
				</TabsList>

				<TabsContent
					value="overview"
					className="space-y-8 focus-visible:outline-none focus-visible:ring-0"
				>
					{/* Quick Links */}
					<QuickLinks />

					{/* Account Information Card */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
						<CardHeader className="pb-4">
							<CardTitle className="text-lg font-medium">
								Account Information
							</CardTitle>
							<CardDescription>
								Your account details and settings
							</CardDescription>
						</CardHeader>
						<CardContent>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Mail className="h-4 w-4 text-primary" />
									</div>
									<div className="space-y-1">
										<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Email
										</dt>
										<dd className="text-sm font-semibold">{user.email}</dd>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Calendar className="h-4 w-4 text-primary" />
									</div>
									<div className="space-y-1">
										<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Member Since
										</dt>
										<dd className="text-sm font-semibold">
											{user.createdAt ?
												new Date(user.createdAt).toLocaleDateString("en-US", {
													month: "long",
													year: "numeric",
												})
											:	"—"}
										</dd>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Shield className="h-4 w-4 text-primary" />
									</div>
									<div className="space-y-1">
										<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Account Type
										</dt>
										<dd className="text-sm font-semibold capitalize">
											<Badge variant="outline" className="font-medium">
												{user.role || "Customer"}
											</Badge>
										</dd>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Phone className="h-4 w-4 text-primary" />
									</div>
									<div className="space-y-1">
										<dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
											Phone
										</dt>
										<dd className="text-sm font-semibold">
											{user.phone || (
												<span className="text-muted-foreground font-normal">
													Not set
												</span>
											)}
										</dd>
									</div>
								</div>
							</dl>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value="activity"
					className="space-y-8 focus-visible:outline-none focus-visible:ring-0"
				>
					{/* Recent Orders */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
						<CardHeader className="pb-4">
							<div className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-medium">
										Recent Orders
									</CardTitle>
									<CardDescription>Your latest order activity</CardDescription>
								</div>
								<Button variant="ghost" size="sm" asChild>
									<Link href="/account/orders">
										View All <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<RecentOrders userId={user.id} />
						</CardContent>
					</Card>

					{/* Recent Reviews */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm">
						<CardHeader className="pb-4">
							<div className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-medium">
										My Reviews
									</CardTitle>
									<CardDescription>
										Your product reviews and ratings
									</CardDescription>
								</div>
								<Button variant="ghost" size="sm" asChild>
									<Link href="/account/reviews">
										View All <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<RecentReviews userId={user.id} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
