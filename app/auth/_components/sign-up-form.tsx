"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from "@/components/ui/field";

import { registerSchema, type RegisterInput } from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		mode: "onTouched",
	});

	async function onSubmit(data: RegisterInput) {
		setIsLoading(true);
		try {
			await authClient.signUp.email({
				name: data.name,
				email: data.email,
				password: data.password,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Account created!", {
							description: "Please check your email to verify your account.",
						});
						router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
					},
					onError: ({ error }) => {
						toast.error(error?.message);
					},
				},
			});
		} catch (error) {
			toast.error("Failed to create account");
		} finally {
			setIsLoading(false);
			form.resetField("password");
			form.resetField("confirmPassword");
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<Controller
				name="name"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
						<Input
							{...field}
							id={field.name}
							aria-invalid={fieldState.invalid}
							placeholder="John Doe"
							autoComplete="name"
							disabled={isLoading}
						/>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

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

			<Controller
				name="password"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
								tabIndex={-1}
							>
								{showPassword ?
									<EyeOff className="h-4 w-4 text-muted-foreground" />
								:	<Eye className="h-4 w-4 text-muted-foreground" />}
								<span className="sr-only">
									{showPassword ? "Hide password" : "Show password"}
								</span>
							</Button>
						</div>
						<FieldDescription>Must be at least 8 characters</FieldDescription>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Create Account
			</Button>
		</form>
	);
}
