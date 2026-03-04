"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { authClient } from "@/lib/auth-client";
import { z } from "zod";

const resendVerificationSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

type VerifyState = "waiting" | "verifying" | "success" | "error";

interface VerifyEmailFormProps {
	initialEmail?: string;
	token?: string | null;
}

export function VerifyEmailForm({
	initialEmail = "",
	token: initialToken,
}: VerifyEmailFormProps) {
	const token = initialToken ?? null;
	const verifiedRef = useRef(false);

	const [verifyState, setVerifyState] = useState<VerifyState>(
		token ? "verifying" : "waiting",
	);
	const [verifyErrorMsg, setVerifyErrorMsg] = useState("");
	const [isResending, setIsResending] = useState(false);

	const form = useForm<ResendVerificationInput>({
		resolver: zodResolver(resendVerificationSchema),
		defaultValues: { email: initialEmail },
	});

	// Auto-verify when token is in URL
	useEffect(() => {
		if (!token || verifiedRef.current) return;
		verifiedRef.current = true;

		async function verify() {
			try {
				await authClient.verifyEmail({
					query: {
						token: token!,
						callbackURL: "/",
					},
					fetchOptions: {
						onSuccess: () => {
							setVerifyState("success");
							toast.success("Email verified!");
						},
						onError: ({ error }) => {
							setVerifyState("error");
							setVerifyErrorMsg(error.message ?? "Verification failed");
						},
					},
				});
			} catch (err) {
				setVerifyState("error");
				setVerifyErrorMsg("An unexpected error occurred");
			}
		}

		verify();
	}, [token]);

	async function handleResend(data: ResendVerificationInput) {
		setIsResending(true);
		try {
			await authClient.sendVerificationEmail({
				email: data.email,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Verification email sent!", {
							description: "Please check your inbox.",
						});
					},
					onError: ({ error }) => {
						toast.error(error.message ?? "Failed to send email");
					},
				},
			});
		} catch {
			toast.error("Failed to send email. Please try again.");
		} finally {
			setIsResending(false);
		}
	}

	// Verifying state (auto-verify in progress)
	if (verifyState === "verifying") {
		return (
			<div className="fade-in text-center">
				<Card className="border-none shadow-none bg-transparent">
					<CardContent className="pt-8">
						<Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-6" />
						<p className="text-lg font-medium">Verifying your email…</p>
						<p className="text-muted-foreground mt-2">Please wait a moment.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Success state
	if (verifyState === "success") {
		return (
			<div className="fade-in text-center">
				<Card className="border-none shadow-none bg-transparent">
					<CardContent className="pt-8">
						<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
							<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
						</div>
						<h1 className="text-2xl font-medium mb-2">Email Verified!</h1>
						<p className="text-muted-foreground mb-6">
							Your account is now fully activated. You can sign in.
						</p>
						<Button className="w-full" asChild>
							<Link href="/"> Home</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state (invalid/expired token)
	if (verifyState === "error") {
		return (
			<div className="fade-in text-center">
				<Card className="border-none shadow-none bg-transparent">
					<CardContent className="pt-8">
						<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
							<AlertCircle className="h-8 w-8 text-destructive" />
						</div>
						<h1 className="text-2xl font-medium mb-2">Verification Failed</h1>
						<p className="text-muted-foreground mb-6">{verifyErrorMsg}</p>
						<div className="space-y-3">
							<Button
								className="w-full"
								variant="outline"
								onClick={() => setVerifyState("waiting")}
							>
								Resend Verification Email
							</Button>
							<Button className="w-full" variant="ghost" asChild>
								<Link href="/auth/sign-in">Back to Sign In</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Waiting state (no token — check your email)
	return (
		<div className="fade-in">
			<Card className="border-none shadow-none bg-transparent">
				<CardHeader className="text-center px-0">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
						<Mail className="h-8 w-8 text-muted-foreground" />
					</div>
					<CardTitle className="text-2xl font-medium">
						Check Your Email
					</CardTitle>
					<CardDescription>
						{initialEmail ?
							<>
								We've sent a verification link to{" "}
								<span className="font-medium text-foreground">
									{initialEmail}
								</span>
							</>
						:	"We've sent a verification link to your email address"}
					</CardDescription>
				</CardHeader>

				<CardContent className="px-0 space-y-6">
					<Alert>
						<AlertDescription className="text-sm">
							Click the link in the email to verify your account. If you don't
							see it, check your spam folder.
						</AlertDescription>
					</Alert>

					<form
						onSubmit={form.handleSubmit(handleResend)}
						className="space-y-4"
						noValidate
					>
						<Controller
							name="email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Email address</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="email"
										aria-invalid={fieldState.invalid}
										placeholder="you@example.com"
										autoComplete="email"
										disabled={isResending}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Button
							type="submit"
							variant="outline"
							className="w-full"
							disabled={isResending}
						>
							{isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Resend Verification Email
						</Button>
					</form>

					<Button variant="ghost" className="w-full" asChild>
						<Link href="/auth/sign-in">Back to Sign In</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
