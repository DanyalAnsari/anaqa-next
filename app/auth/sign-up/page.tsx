import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignUpForm } from "@/app/auth/_components";

export default function SignUpPage() {
	return (
		<div className="fade-in">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="text-center px-0">
					<CardTitle className="text-2xl font-medium">Create Account</CardTitle>
					<CardDescription>Join the Anāqa community</CardDescription>
				</CardHeader>

				<CardContent className="px-0">
					<SignUpForm />
				</CardContent>

				<CardFooter className="flex-col gap-6 px-0">
					<p className="text-xs text-muted-foreground text-center">
						By creating an account, you agree to our{" "}
						<Link href="/terms" className="underline hover:text-foreground">
							Terms
						</Link>{" "}
						and{" "}
						<Link href="/privacy" className="underline hover:text-foreground">
							Privacy Policy
						</Link>
						.
					</p>

					<Separator />

					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
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
