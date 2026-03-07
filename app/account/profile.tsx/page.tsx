import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { ProfileForm } from "./_components/profile-form";
import { SecuritySettings } from "./_components/security-settin";
import { DangerZone } from "./_components/danger-zone";
import { AvatarUpload } from "./_components/avatar-upload";

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const user = session?.user;

	if (!user) {
		return null;
	}

	const displayName = user.name || user.email || "User";
	const getInitials = () => {
		if (user.name) {
			const names = user.name.split(" ");
			return names.length > 1 ?
					`${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
				:	names[0][0].toUpperCase();
		}
		return "U";
	};

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight mb-2">
					Profile Settings
				</h1>
				<p className="text-muted-foreground">
					Manage your personal information and account settings.
				</p>
			</div>

			{/* Profile Picture Section */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-6">
						<div className="relative">
							<Avatar className="h-24 w-24">
								<AvatarImage src={user.image ?? undefined} alt={displayName} />
								<AvatarFallback className="text-2xl">
									{getInitials()}
								</AvatarFallback>
							</Avatar>
							<AvatarUpload />
						</div>
						<div className="space-y-1">
							<h2 className="text-2xl font-semibold">{displayName}</h2>
							<p className="text-sm text-muted-foreground">{user.email}</p>
							<Badge variant="secondary" className="mt-2 capitalize">
								{user.role || "Customer"} Account
							</Badge>
						</div>
					</div>
				</CardContent>
			</Card>

			<Separator />

			{/* Personal Information */}
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>
						Update your personal details and contact information
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProfileForm user={user} />
				</CardContent>
			</Card>

			<Separator />

			{/* Account Security */}
			<Card>
				<CardHeader>
					<CardTitle>Account Security</CardTitle>
					<CardDescription>
						Manage your password and security settings
					</CardDescription>
				</CardHeader>
				<CardContent>
					<SecuritySettings user={user} />
				</CardContent>
			</Card>

			<Separator />

			{/* Danger Zone */}
			<DangerZone />
		</div>
	);
}
