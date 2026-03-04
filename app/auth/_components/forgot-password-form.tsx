"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { authClient } from "@/lib/auth-client";
import {
	forgotPasswordSchema,
	type ForgotPasswordInput,
} from "@/lib/validations";

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [sentEmail, setSentEmail] = useState("");
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ForgotPasswordInput>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	async function onSubmit(data: ForgotPasswordInput) {
		setIsLoading(true);
		setError(null);
		try {
			const { error: apiError } = await authClient.requestPasswordReset({
				email: data.email,
				redirectTo: "/auth/reset-password",
			});

			if (apiError) {
				console.error("Password reset error:", apiError);
			}
		} catch (err) {
			console.error("Password reset exception:", err);
		} finally {
			setIsLoading(false);
			setSentEmail(data.email);
			setEmailSent(true);
			toast.success("Reset link sent!", {
				description: "If an account exists, check your email for instructions.",
			});
		}
	}

	if (emailSent) {
		return (
			<div className="fade-in text-center">
				<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
				</div>
				<h1 className="text-2xl font-medium mb-2">Check Your Email</h1>
				<p className="text-muted-foreground mb-2">
					We&apos;ve sent password reset instructions to:
				</p>
				<p className="font-medium mb-6">{sentEmail}</p>
				<p className="text-sm text-muted-foreground mb-6">
					If you don&apos;t see the email, check your spam folder.
				</p>
				<div className="space-y-3">
					<Button
						variant="outline"
						className="w-full"
						onClick={() => setEmailSent(false)}
					>
						Try a different email
					</Button>
					<Button variant="ghost" className="w-full" asChild>
						<Link href="/auth/sign-in">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Sign In
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="fade-in">
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				noValidate
			>
				<Controller
					name="email"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Email</FieldLabel>
							<Input
								{...field}
								id={field.name}
								type="email"
								aria-invalid={fieldState.invalid}
								placeholder="you@example.com"
								autoComplete="email"
								disabled={isLoading}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Send Reset Link
				</Button>
			</form>
		</div>
	);
}
