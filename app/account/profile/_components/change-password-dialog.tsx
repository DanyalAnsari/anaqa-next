"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
	changePasswordSchema,
	type ChangePasswordInput,
} from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

export function ChangePasswordDialog() {
	const [open, setOpen] = useState(false);
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ChangePasswordInput>({
		resolver: zodResolver(changePasswordSchema),
		mode: "onBlur",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	async function onSubmit({
		currentPassword,
		newPassword,
	}: ChangePasswordInput) {
		setIsLoading(true);
		setError(null);

		try {
			await authClient.changePassword({
				currentPassword,
				newPassword,
				fetchOptions: {
					onSuccess: () => {
						toast.success("Password changed successfully", {
							description: "You may need to sign in again on other devices.",
						});
						setOpen(false);
						form.reset();
					},
					onError: (ctx) => {
						setError(ctx.error.message);
					},
				},
			});
		} catch (error: any) {
			setError(error.message ?? "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					Change
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Change Password</DialogTitle>
					<DialogDescription>
						Enter your current password and choose a new one.
					</DialogDescription>
				</DialogHeader>

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
					noValidate
				>
					<Controller
						name="currentPassword"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
								<div className="relative">
									<Input
										{...field}
										id={field.name}
										type={showCurrent ? "text" : "password"}
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
										onClick={() => setShowCurrent(!showCurrent)}
										tabIndex={-1}
									>
										{showCurrent ?
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										:	<Eye className="h-4 w-4 text-muted-foreground" />}
									</Button>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="newPassword"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>New Password</FieldLabel>
								<div className="relative">
									<Input
										{...field}
										id={field.name}
										type={showNew ? "text" : "password"}
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
										onClick={() => setShowNew(!showNew)}
										tabIndex={-1}
									>
										{showNew ?
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										:	<Eye className="h-4 w-4 text-muted-foreground" />}
									</Button>
								</div>
								<FieldDescription>
									Must be at least 8 characters with uppercase, lowercase,
									number, and special character
								</FieldDescription>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>

					<Controller
						name="confirmNewPassword"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Confirm New Password
								</FieldLabel>
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

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpen(false);
								form.reset();
							}}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Change Password
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
