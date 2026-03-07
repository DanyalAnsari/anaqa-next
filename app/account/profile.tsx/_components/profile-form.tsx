"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from "@/components/ui/field";

import {
	updateProfileSchema,
	type UpdateProfileInput,
} from "@/lib/validations";
import { authClient } from "@/lib/auth-client";

interface ProfileFormProps {
	user: any;
}

export function ProfileForm({ user }: ProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<UpdateProfileInput>({
		resolver: zodResolver(updateProfileSchema),
		mode: "onBlur",
		defaultValues: {
			firstName: user.firstName ?? "",
			lastName: user.lastName ?? "",
			phone: user.phone ?? "",
		},
	});

	async function onSubmit({ firstName, lastName, phone }: UpdateProfileInput) {
		setIsLoading(true);
		try {
			const { error } = await authClient.updateUser({
				name: `${firstName} ${lastName}`,
				phone: phone,
			});

			if (error) toast.error(error.message);

			toast.success("Profile updated successfully");
			setIsEditing(false);
			form.reset();
		} catch (error) {
			toast.error("Failed to update profile");
		} finally {
			setIsLoading(false);
		}
	}

	const handleCancel = () => {
		form.reset({
			firstName: user.firstName ?? "",
			lastName: user.lastName ?? "",
			phone: user.phone ?? "",
		});
		setIsEditing(false);
	};

	return (
		<div className="max-w-2xl">
			<div className="flex items-center justify-end mb-6">
				{!isEditing && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsEditing(true)}
					>
						Edit
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
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
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
								/>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</div>

				<Field>
					<FieldLabel htmlFor="email">Email Address</FieldLabel>
					<Input
						id="email"
						type="email"
						value={user.email ?? ""}
						disabled
						className="bg-secondary/50"
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
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				{isEditing && (
					<div className="flex gap-3">
						<Button
							type="submit"
							disabled={isLoading || !form.formState.isDirty}
						>
							{isLoading ?
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving…
								</>
							:	<>
									<Save className="mr-2 h-4 w-4" />
									Save Changes
								</>
							}
						</Button>
						<Button type="button" variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
					</div>
				)}
			</form>
		</div>
	);
}
