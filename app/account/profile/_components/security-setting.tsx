"use client";

import Link from "next/link";
import { Mail, Key, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { ChangePasswordDialog } from "./change-password-dialog";

interface SecuritySettingsProps {
	user: any;
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
	return (
		<div className="max-w-2xl space-y-4">
			{/* Email Verification */}
			<Card>
				<CardContent className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<Mail className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="font-medium">Email Verification</p>
							<p className="text-sm text-muted-foreground">
								{user?.emailVerified ?
									"Your email is verified"
								:	"Please verify your email"}
							</p>
						</div>
					</div>
					{user?.emailVerified ?
						<Badge
							variant="secondary"
							className="bg-green-500/10 text-green-700 dark:text-green-400"
						>
							Verified
						</Badge>
					:	<Button variant="outline" size="sm" asChild>
							<Link href="/auth/verify-email">Verify</Link>
						</Button>
					}
				</CardContent>
			</Card>

			{/* Change Password */}
			<Card>
				<CardContent className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<Key className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="font-medium">Password</p>
							<p className="text-sm text-muted-foreground">
								Change your account password
							</p>
						</div>
					</div>
					<ChangePasswordDialog />
				</CardContent>
			</Card>

			{/* 2FA Placeholder */}
			<Card>
				<CardContent className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
							<Shield className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="font-medium">Two-Factor Authentication</p>
							<p className="text-sm text-muted-foreground">
								Add an extra layer of security
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => toast.info("2FA coming soon!")}
					>
						Enable
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
