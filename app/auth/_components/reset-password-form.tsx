"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";

export function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	useEffect(() => {
		if (!token) {
			form.setError("password", {
				type: "manual",
				message: "Missing reset token. Please use the link from your email.",
			});
		}
	}, [token, form]);

	async function onSubmit(data: ResetPasswordInput) {
		if (!token) {
			toast.error("Missing reset token");
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await authClient.resetPassword({
				newPassword: data.password,
				token,
			});

			if (error) {
				toast.error(error.message ?? "Failed to reset password");
				return;
			}

			setIsSuccess(true);
			toast.success("Password reset successfully!");
		} catch {
			toast.error("Failed to reset password");
		} finally {
			setIsLoading(false);
		}
	}

	if (isSuccess) {
		return (
			<div className="fade-in text-center">
				<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
				</div>
				<h1 className="text-2xl font-medium mb-2">Password Reset</h1>
				<p className="text-muted-foreground mb-6">
					Your password has been reset successfully.
				</p>
				<Button className="w-full" asChild>
					<a href="/auth/sign-in">Sign In</a>
				</Button>
			</div>
		);
	}

	return (
		<div className="fade-in">
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				noValidate
			>
				<Controller
					name="password"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor={field.name}>New Password</FieldLabel>
							</div>
							<div className="relative">
								<Input
									{...field}
									id={field.name}
									type={showPassword ? "text" : "password"}
									aria-invalid={fieldState.invalid}
									placeholder="••••••••"
									autoComplete="new-password"
									disabled={isLoading}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
									onClick={() => setShowPassword(!showPassword)}
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ?
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									:	<Eye className="h-4 w-4 text-muted-foreground" />}
									<span className="sr-only">
										{showPassword ? "Hide password" : "Show password"}
									</span>
								</Button>
							</div>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Controller
					name="confirmPassword"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
							<Input
								{...field}
								id={field.name}
								type="password"
								aria-invalid={fieldState.invalid}
								placeholder="••••••••"
								autoComplete="new-password"
								disabled={isLoading}
							/>
							{fieldState.invalid && (
								<FieldError errors={[fieldState.error]} />
							)}
						</Field>
					)}
				/>

				<Button
					type="submit"
					className="w-full"
					size="lg"
					disabled={isLoading || !token}
				>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Reset Password
				</Button>
			</form>
		</div>
	);
}
