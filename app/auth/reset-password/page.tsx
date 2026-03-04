import { Suspense } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/app/auth/_components";

function ResetPasswordFormFallback() {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<div className="h-4 w-20 bg-muted animate-pulse rounded" />
				<div className="h-10 w-full bg-muted animate-pulse rounded" />
			</div>
			<div className="space-y-2">
				<div className="h-4 w-32 bg-muted animate-pulse rounded" />
				<div className="h-10 w-full bg-muted animate-pulse rounded" />
			</div>
			<div className="h-10 w-full bg-muted animate-pulse rounded" />
		</div>
	);
}

export default function ResetPasswordPage() {
	return (
		<div className="fade-in">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="text-center px-0">
					<CardTitle className="text-2xl font-medium">New Password</CardTitle>
					<CardDescription>Enter your new password below</CardDescription>
				</CardHeader>

				<CardContent className="px-0">
					<Suspense fallback={<ResetPasswordFormFallback />}>
						<ResetPasswordForm />
					</Suspense>
				</CardContent>

				<CardFooter className="flex-col gap-6 px-0">
					<Separator />
					<p className="text-center text-sm text-muted-foreground">
						Remember your password?{" "}
						<Link
							href="/auth/sign-in"
							className="font-medium text-foreground hover:underline"
						>
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
