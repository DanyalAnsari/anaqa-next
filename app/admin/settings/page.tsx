import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Users, UserCheck } from "lucide-react";
import { getSubscribers, getSubscriberStats } from "./_lib/data";
import { NewsletterForm } from "./_components/newsletter-form";
import { SubscribersTable } from "./_components/subscribers-table";

interface PageProps {
	searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function SettingsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = Number(params.page) || 1;

	const [subscriberData, stats] = await Promise.all([
		getSubscribers({
			search: params.search,
			status: params.status as any,
			page,
		}),
		getSubscriberStats(),
	]);

	return (
		<div className="max-w-5xl space-y-6">
			<div>
				<h1 className="text-2xl font-semibold">Settings</h1>
				<p className="text-muted-foreground text-sm">
					Manage store configuration and marketing.
				</p>
			</div>

			{/* Newsletter Broadcast */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Newsletter Broadcast</CardTitle>
					<CardDescription>
						Send email to {stats.active} active subscribers.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<NewsletterForm />
				</CardContent>
			</Card>

			<Separator />

			{/* Subscribers */}
			<div>
				<h2 className="text-lg font-semibold mb-4">Newsletter Subscribers</h2>

				<div className="grid grid-cols-3 gap-4 mb-6">
					{[
						{
							label: "Total",
							value: stats.total,
							icon: Users,
							color: "text-blue-600",
							bg: "bg-blue-100 dark:bg-blue-900/30",
						},
						{
							label: "Active",
							value: stats.active,
							icon: UserCheck,
							color: "text-green-600",
							bg: "bg-green-100 dark:bg-green-900/30",
						},
						{
							label: "Unsubscribed",
							value: stats.unsubscribed,
							icon: Mail,
							color: "text-red-600",
							bg: "bg-red-100 dark:bg-red-900/30",
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

				<Card>
					<CardContent className="pt-6">
						<SubscribersTable {...subscriberData} />
					</CardContent>
				</Card>
			</div>

			<Separator />

			{/* General */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">General Settings</CardTitle>
					<CardDescription>Basic store configuration.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-sm text-muted-foreground">
					<p>
						Store Name: <strong className="text-foreground">Anāqa</strong>
					</p>
					<p>
						Currency: <strong className="text-foreground">SAR</strong>
					</p>
					<p>
						Support Email:{" "}
						<strong className="text-foreground">support@anaqa.com</strong>
					</p>
					<p className="italic pt-4 border-t mt-4">
						More settings coming soon.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
