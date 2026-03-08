import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarImage } from "@/components/ui/image";
import { ProfileForm } from "./_components/profile-form";
import { AvatarUpload } from "./_components/avatar-upload";

export default async function ProfilePage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const user = session?.user;

	if (!user) {
		return null;
	}

	const initials = user.name?.charAt(0) || user.email?.charAt(0) || "?";

	return (
		<div className="mx-auto w-full max-w-4xl space-y-10 py-10 px-4 md:px-8">
			{/* Breadcrumbs or Back Link could go here */}
			
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold tracking-tight text-foreground/90">
					Account Settings
				</h1>
				<p className="text-lg text-muted-foreground">
					Manage your public profile, security, and preferences.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
				{/* Avatar Sidebar */}
				<div className="lg:col-span-4 flex flex-col items-center gap-6 lg:items-start">
					<div className="relative group/container">
						<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-primary/30 rounded-full blur opacity-25 group-hover/container:opacity-40 transition duration-500"></div>
						<div className="relative bg-background rounded-full p-1 ring-1 ring-border shadow-2xl">
							<div className="relative h-40 w-40">
								<AvatarImage
									src={user.image}
									size={160}
									initials={initials}
									alt={user.name || "User"}
									className="rounded-full h-full w-full object-cover shadow-inner bg-muted"
								/>
								<AvatarUpload hasAvatar={!!user.image} initials={initials} />
							</div>
						</div>
					</div>
					
					<div className="space-y-4 w-full text-center lg:text-left">
						<div className="space-y-1">
							<h2 className="text-xl font-semibold text-foreground">
								Profile Picture
							</h2>
							<p className="text-sm text-muted-foreground max-w-[240px] mx-auto lg:mx-0">
								Click the camera icon to upload a new avatar or remove the current one.
							</p>
						</div>
					</div>
				</div>

				{/* Forms Area */}
				<div className="lg:col-span-8 space-y-8">
					<Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
						<CardHeader className="pb-4 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-xl">Personal Information</CardTitle>
							<CardDescription>
								Update your name and public details.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-8 px-6 pb-8">
							<ProfileForm user={user} />
						</CardContent>
					</Card>

					<Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
						<CardHeader className="pb-4 border-b border-border/10 bg-muted/30">
							<CardTitle className="text-xl flex items-center gap-2">
								<span className="text-destructive">Danger Zone</span>
							</CardTitle>
							<CardDescription>
								Manage permanent account actions.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-8 px-6 pb-8">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
								<div className="space-y-1">
									<p className="font-semibold text-foreground">
										Delete Account
									</p>
									<p className="text-sm text-muted-foreground">
										Once deleted, your account and all associated data cannot be recovered.
									</p>
								</div>
								<Button 
									variant="destructive" 
									className="sm:w-auto w-full font-medium transition-all hover:scale-105 active:scale-95"
								>
									Delete Account
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
