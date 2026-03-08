import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
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
		return null; // Or redirect to login
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header Section */}
			<div>
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
							className="flex items-center gap-1.5 px-3 py-1"
						>
							<CheckCircle className="h-3.5 w-3.5" />
							Verified Account
						</Badge>
					:	<Badge
							variant="destructive"
							className="flex items-center gap-1.5 px-3 py-1"
						>
							<AlertCircle className="h-3.5 w-3.5" />
							Email Not Verified
						</Badge>
					}
				</div>
			</div>

			{/* Email Verification Alert */}
			{!isVerified && (
				<Alert variant="destructive">
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
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="activity">Activity</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
					{/* Quick Links */}
					<QuickLinks />

					{/* Account Information */}
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium">Account Information</h3>
							<p className="text-sm text-muted-foreground">Your account details and settings</p>
						</div>
						<Separator />
						<dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
							<div className="space-y-1">
								<dt className="text-sm font-medium text-muted-foreground">Email</dt>
								<dd className="text-sm font-semibold">{user.email}</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-sm font-medium text-muted-foreground">Member Since</dt>
								<dd className="text-sm font-semibold">
									{user.createdAt ?
										new Date(user.createdAt).toLocaleDateString("en-US", {
											month: "long",
											year: "numeric",
										})
									:	"—"}
								</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-sm font-medium text-muted-foreground">Account Type</dt>
								<dd className="text-sm font-semibold capitalize">
									<Badge variant="outline">{user.role || "Customer"}</Badge>
								</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-sm font-medium text-muted-foreground">Phone</dt>
								<dd className="text-sm font-semibold">
									{user.phone || <span className="text-muted-foreground">Not set</span>}
								</dd>
							</div>
						</dl>
					</div>
				</TabsContent>

				<TabsContent value="activity" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
					{/* Recent Orders */}
					<div className="space-y-6">
						<div className="flex flex-row items-center justify-between">
							<div>
								<h3 className="text-lg font-medium">Recent Orders</h3>
								<p className="text-sm text-muted-foreground">Your latest order activity</p>
							</div>
							<Button variant="ghost" size="sm" asChild>
								<Link href="/account/orders">
									View All <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
						<Separator />
						<RecentOrders userId={user.id} />
					</div>

					{/* Recent Reviews */}
					<div className="space-y-6">
						<div className="flex flex-row items-center justify-between">
							<div>
								<h3 className="text-lg font-medium">My Reviews</h3>
								<p className="text-sm text-muted-foreground">Your product reviews and ratings</p>
							</div>
							<Button variant="ghost" size="sm" asChild>
								<Link href="/account/reviews">
									View All <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
						<Separator />
						<RecentReviews userId={user.id} />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
