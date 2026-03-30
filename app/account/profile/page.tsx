// app/account/profile/page.tsx
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./_components/profile-form";
import { AvatarUpload } from "./_components/avatar-upload";
import { SecuritySettings } from "./_components/security-setting";
import { DangerZone } from "./_components/danger-zone";
import { AvatarImage } from "@/components/ui/image";
import { Avatar } from "@/components/ui/avatar";

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const user = session?.user;

	if (!user) {
		return null;
	}

	const initials =
		user.name?.charAt(0).toUpperCase() ||
		user.email?.charAt(0).toUpperCase() ||
		"?";

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
				<p className="text-muted-foreground mt-1">
					Manage your account settings, security, and preferences.
				</p>
			</div>

			<Tabs defaultValue="profile" className="space-y-6">
				<TabsList className="bg-secondary/50">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>

				<TabsContent
					value="profile"
					className="space-y-8 focus-visible:outline-none focus-visible:ring-0"
				>
					{/* Avatar Section */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-4 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-lg font-medium">
								Profile Picture
							</CardTitle>
							<CardDescription>
								Click the camera icon to upload a new avatar or remove the
								current one.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="flex flex-col sm:flex-row items-center gap-6">
								{/* Avatar with Upload */}
								<div className="relative group/container">
									<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/30 rounded-full blur opacity-20 group-hover/container:opacity-35 transition duration-500" />
									<div className="relative bg-background rounded-full p-1 ring-1 ring-border/50 shadow-xl">
										<div className="relative h-32 w-32">
											<Avatar>
												<AvatarImage
													src={user.image}
													size={128}
													initials={initials}
													alt={user.name || "User"}
													className="rounded-full h-full w-full object-cover shadow-inner bg-muted"
												/>
												<AvatarUpload
													hasAvatar={!!user.image}
													initials={initials}
												/>
											</Avatar>
										</div>
									</div>
								</div>

								{/* Avatar Info */}
								<div className="text-center sm:text-left space-y-2">
									<h3 className="font-semibold text-lg">
										{user.name || "User"}
									</h3>
									<p className="text-sm text-muted-foreground">{user.email}</p>
									<p className="text-xs text-muted-foreground">
										Accepts JPG, PNG, WebP, or GIF up to 5MB
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Personal Information */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-4 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-lg font-medium">
								Personal Information
							</CardTitle>
							<CardDescription>
								Update your name and contact details.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<ProfileForm user={user} />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value="security"
					className="space-y-8 focus-visible:outline-none focus-visible:ring-0"
				>
					{/* Security Settings */}
					<Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-4 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-lg font-medium">Security</CardTitle>
							<CardDescription>
								Manage your password and security settings.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<SecuritySettings user={user} />
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card className="border-destructive/30 bg-destructive/5 backdrop-blur-sm overflow-hidden">
						<CardHeader className="pb-4 border-b border-destructive/10">
							<CardTitle className="text-lg font-medium text-destructive">
								Danger Zone
							</CardTitle>
							<CardDescription>
								Irreversible and destructive actions.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<DangerZone />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
