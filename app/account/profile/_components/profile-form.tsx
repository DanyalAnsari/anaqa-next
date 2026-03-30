// app/account/profile/_components/profile-form.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
	updateProfileSchema,
	type UpdateProfileInput,
} from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

interface User {
	name: string;
	email: string;
	phone?: string | null;
}

interface ProfileFormProps {
	user: User;
}

function parseName(name: string) {
	const parts = name.trim().split(" ");
	return {
		firstName: parts[0] || "",
		lastName: parts.slice(1).join(" ") || "",
	};
}

export function ProfileForm({ user: initialUser }: ProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const { data: session } = authClient.useSession();
	const user = session?.user ?? initialUser;
	const { firstName, lastName } = parseName(user.name);

	const form = useForm<UpdateProfileInput>({
		resolver: zodResolver(updateProfileSchema),
		mode: "onChange",
		defaultValues: {
			firstName,
			lastName,
			phone: user.phone ?? "",
		},
	});

	async function onSubmit({ firstName, lastName, phone }: UpdateProfileInput) {
		const name = lastName ? `${firstName} ${lastName}` : firstName;

		await authClient.updateUser({
			name,
			phone: phone || undefined,
			fetchOptions: {
				onSuccess: () => {
					toast.success("Profile updated", {
						description: "Your changes have been saved successfully.",
					});
					setIsEditing(false);
				},
				onError: (ctx) => {
					toast.error(ctx.error.message || "Failed to update profile");
				},
			},
		});
	}

	function handleCancel() {
		form.reset({ firstName, lastName, phone: user.phone ?? "" });
		setIsEditing(false);
	}

	return (
		<div className="max-w-2xl">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					{isEditing && (
						<Badge variant="secondary" className="text-xs">
							Editing
						</Badge>
					)}
				</div>
				{!isEditing && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditing(true)}
						className="gap-2"
					>
						<Pencil className="h-3.5 w-3.5" />
						Edit Profile
					</Button>
				)}
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6"
				noValidate
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<Controller
						name="firstName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>First Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={!isEditing}
									className={cn(
										!isEditing && "bg-secondary/30 border-transparent",
									)}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="lastName"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									disabled={!isEditing}
									className={cn(
										!isEditing && "bg-secondary/30 border-transparent",
									)}
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</div>

				<Field>
					<FieldLabel htmlFor="email">Email Address</FieldLabel>
					<Input
						id="email"
						type="email"
						value={user.email}
						disabled
						className="bg-secondary/30 border-transparent"
					/>
					<FieldDescription>
						Email cannot be changed. Contact support if you need to update it.
					</FieldDescription>
				</Field>

				<Controller
					name="phone"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
							<Input
								{...field}
								id={field.name}
								type="tel"
								aria-invalid={fieldState.invalid}
								placeholder="+1 (555) 123-4567"
								disabled={!isEditing}
								className={cn(
									!isEditing && "bg-secondary/30 border-transparent",
								)}
							/>
							<FieldDescription>
								Used for order updates and delivery notifications.
							</FieldDescription>
							{fieldState.error && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{isEditing && (
					<div className="flex gap-3 pt-2">
						<Button
							type="submit"
							disabled={form.formState.isSubmitting || !form.formState.isDirty}
							className="gap-2"
						>
							{form.formState.isSubmitting ?
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Saving…
								</>
							:	<>
									<Save className="h-4 w-4" />
									Save Changes
								</>
							}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={form.formState.isSubmitting}
							className="gap-2"
						>
							<X className="h-4 w-4" />
							Cancel
						</Button>
					</div>
				)}
			</form>
		</div>
	);
}
