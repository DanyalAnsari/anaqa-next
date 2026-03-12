import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ShieldCheck,
	ShieldAlert,
	Mail,
	Phone,
	Calendar,
	MapPin,
	ShoppingBag,
	Heart,
	Star,
	Ban,
} from "lucide-react";
import type { CustomerDetail } from "../../_lib/data";

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function formatCurrency(amount: number) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "SAR",
		minimumFractionDigits: 0,
	}).format(amount);
}

function getInitials(name: string, email: string) {
	if (name) {
		const parts = name.split(" ");
		return parts.length >= 2 ?
				`${parts[0][0]}${parts[1][0]}`.toUpperCase()
			:	name.substring(0, 2).toUpperCase();
	}
	return email.substring(0, 2).toUpperCase();
}

export function CustomerInfo({ customer }: { customer: CustomerDetail }) {
	return (
		<div className="space-y-6">
			{/* Profile Card */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-col sm:flex-row items-start gap-6">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={customer.image ?? undefined}
								alt={customer.name}
							/>
							<AvatarFallback className="text-xl">
								{getInitials(customer.name, customer.email)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 space-y-3">
							<div>
								<div className="flex items-center gap-2 flex-wrap">
									<h2 className="text-xl font-semibold">
										{customer.name || "Unnamed"}
									</h2>
									{customer.emailVerified ?
										<ShieldCheck className="h-4 w-4 text-green-500" />
									:	<ShieldAlert className="h-4 w-4 text-yellow-500" />}
									<Badge
										variant={customer.role === "admin" ? "default" : "outline"}
										className="capitalize"
									>
										{customer.role}
									</Badge>
									{customer.banned && (
										<Badge variant="destructive">Banned</Badge>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									<a
										href={`mailto:${customer.email}`}
										className="hover:underline"
									>
										{customer.email}
									</a>
								</div>
								{customer.phone && (
									<div className="flex items-center gap-2">
										<Phone className="h-4 w-4" />
										<span>{customer.phone}</span>
									</div>
								)}
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>Joined {formatDate(customer.createdAt)}</span>
								</div>
							</div>

							{customer.banned && customer.banReason && (
								<div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm">
									<Ban className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
									<div>
										<p className="font-medium text-destructive">Ban Reason</p>
										<p className="text-muted-foreground">
											{customer.banReason}
										</p>
										{customer.banExpires && (
											<p className="text-xs text-muted-foreground mt-1">
												Expires: {formatDate(customer.banExpires)}
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{
						label: "Orders",
						value: customer.ordersCount,
						icon: ShoppingBag,
						color: "text-blue-600",
						bg: "bg-blue-100 dark:bg-blue-900/30",
					},
					{
						label: "Total Spent",
						value: formatCurrency(customer.totalSpent),
						icon: ShoppingBag,
						color: "text-green-600",
						bg: "bg-green-100 dark:bg-green-900/30",
					},
					{
						label: "Reviews",
						value: customer.reviewsCount,
						icon: Star,
						color: "text-yellow-600",
						bg: "bg-yellow-100 dark:bg-yellow-900/30",
					},
					{
						label: "Wishlist",
						value: customer.wishlistCount,
						icon: Heart,
						color: "text-red-600",
						bg: "bg-red-100 dark:bg-red-900/30",
					},
				].map((stat) => (
					<Card key={stat.label}>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div
									className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center`}
								>
									<stat.icon className={`h-5 w-5 ${stat.color}`} />
								</div>
								<div>
									<p className="text-xl font-semibold">{stat.value}</p>
									<p className="text-xs text-muted-foreground">{stat.label}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Addresses */}
			{customer.addresses.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<MapPin className="h-5 w-5" />
							Addresses ({customer.addresses.length})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{customer.addresses.map((addr) => (
								<div key={addr.id} className="p-4 rounded-lg border space-y-1">
									<div className="flex items-center justify-between">
										<p className="font-medium text-sm">{addr.label}</p>
										{addr.isDefault && (
											<Badge variant="secondary" className="text-xs">
												Default
											</Badge>
										)}
									</div>
									<div className="text-sm text-muted-foreground space-y-0.5">
										<p className="text-foreground">{addr.fullName}</p>
										<p>{addr.street}</p>
										<p>
											{addr.city}, {addr.state} {addr.postalCode}
										</p>
										<p>{addr.country}</p>
										<p>{addr.phone}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
