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

import { ForgotPasswordForm } from "../_components";

export default function ForgotPasswordPage() {
	return (
		<div className="fade-in">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="text-center px-0">
					<CardTitle className="text-2xl font-medium">Reset Password</CardTitle>
					<CardDescription>
						Enter your email and we'll send you a reset link
					</CardDescription>
				</CardHeader>

				<CardContent className="px-0">
					<ForgotPasswordForm />
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
