"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import Link from "next/link";
import { LoginInput, loginSchema } from "@/lib/validations";
import { loginWithEmail } from "../actions";

export function SignInForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
		mode: "onTouched",
	});

	async function onSubmit(data: LoginInput) {
		setIsLoading(true);
		try {
			const result = await loginWithEmail({
				email: data.email,
				password: data.password,
			});

			if (result.success) {
				const userName = result.data?.user?.name?.trim();
				toast.success(userName ? `Welcome back, ${userName}!` : "Welcome back!");
			} else {
				toast.error(result.error ?? "Failed to sign in");
			}
		} catch (error) {
			toast.error("Failed to sign in");
		} finally {
			setIsLoading(false);
			form.reset();
		}
	}

	return (
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

			<Controller
				name="password"
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<div className="flex items-center justify-between">
							<FieldLabel htmlFor={field.name}>Password</FieldLabel>
							<Link
								href="/auth/forgot-password"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Forgot password?
							</Link>
						</div>
						<div className="relative">
							<Input
								{...field}
								id={field.name}
								type={showPassword ? "text" : "password"}
								aria-invalid={fieldState.invalid}
								placeholder="••••••••"
								autoComplete="current-password"
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
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>

			<Button type="submit" className="w-full" size="lg" disabled={isLoading}>
				{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Sign In
			</Button>
		</form>
	);
}
