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

import { SignInForm } from "../_components";

export default function SignInPage() {
	return (
		<div className="fade-in">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="text-center px-0">
					<CardTitle className="text-2xl font-medium">Welcome Back</CardTitle>
					<CardDescription>Sign in to your Anāqa account</CardDescription>
				</CardHeader>

				<CardContent className="px-0">
					<SignInForm />
				</CardContent>

				<CardFooter className="flex-col gap-6 px-0">
					<Separator />
					<p className="text-center text-sm text-muted-foreground">
						Don't have an account?{" "}
						<Link
							href="/auth/sign-up"
							className="font-medium text-foreground hover:underline"
						>
							Create one
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
