// app/account/addresses/_components/address-form-dialog.tsx
"use client";

import { useEffect, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Field,
	FieldLabel,
	FieldDescription,
	FieldError,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { createAddress, updateAddress } from "../actions";
import type { InferSelectModel } from "drizzle-orm";
import type { address } from "@/lib/db/schema";

type Address = InferSelectModel<typeof address>;

// Validation schema matching the DB schema
const addressFormSchema = z.object({
	label: z.string().min(1, "Label is required"),
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	phone: z.string().min(8, "Valid phone number is required"),
	street: z.string().min(3, "Street address is required"),
	city: z.string().min(2, "City is required"),
	state: z.string().min(2, "State is required"),
	postalCode: z.string().min(3, "Postal code is required"),
	country: z.string().min(1, "Country is required"),
	isDefault: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

const ADDRESS_LABELS = [
	{ value: "home", label: "Home" },
	{ value: "office", label: "Office" },
	{ value: "work", label: "Work" },
	{ value: "other", label: "Other" },
];

const COUNTRIES = [
	{ value: "SA", label: "Saudi Arabia" },
	{ value: "AE", label: "United Arab Emirates" },
	{ value: "KW", label: "Kuwait" },
	{ value: "BH", label: "Bahrain" },
	{ value: "QA", label: "Qatar" },
	{ value: "OM", label: "Oman" },
	{ value: "US", label: "United States" },
	{ value: "GB", label: "United Kingdom" },
];

interface AddressFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	address: Address | null;
	onSuccess: () => void;
}

export function AddressFormDialog({
	open,
	onOpenChange,
	address: editingAddress,
	onSuccess,
}: AddressFormDialogProps) {
	const isEditing = !!editingAddress;
	const [isPending, startTransition] = useTransition();

	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressFormSchema),
		mode: "onBlur",
		defaultValues: {
			label: "home",
			fullName: "",
			phone: "",
			street: "",
			city: "",
			state: "",
			postalCode: "",
			country: "SA",
			isDefault: false,
		},
	});

	// Reset form when dialog opens or address changes
	useEffect(() => {
		if (open) {
			if (editingAddress) {
				form.reset({
					label: editingAddress.label,
					fullName: editingAddress.fullName,
					phone: editingAddress.phone,
					street: editingAddress.street,
					city: editingAddress.city,
					state: editingAddress.state,
					postalCode: editingAddress.postalCode,
					country: editingAddress.country,
					isDefault: editingAddress.isDefault,
				});
			} else {
				form.reset({
					label: "home",
					fullName: "",
					phone: "",
					street: "",
					city: "",
					state: "",
					postalCode: "",
					country: "SA",
					isDefault: false,
				});
			}
		}
	}, [open, editingAddress, form]);

	const handleFormSubmit = (data: AddressFormValues) => {
		startTransition(async () => {
			const result =
				isEditing ?
					await updateAddress(editingAddress.id, data)
				:	await createAddress(data);

			if (result.success) {
				toast.success(isEditing ? "Address updated" : "Address added", {
					description:
						isEditing ?
							"Your address has been updated."
						:	"Your new address has been saved.",
				});
				onSuccess();
			} else {
				toast.error(result.error);
			}
		});
	};

	// Prevent closing while submitting
	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen && isPending) return;
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Address" : "Add New Address"}
					</DialogTitle>
					<DialogDescription>
						{isEditing ?
							"Update your shipping address details."
						:	"Add a new shipping address to your account."}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(handleFormSubmit)}
					className="space-y-5"
					noValidate
				>
					{/* Label */}
					<Controller
						name="label"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor="label">Address Label</FieldLabel>
								<Select
									value={field.value}
									onValueChange={field.onChange}
									disabled={isPending}
								>
									<SelectTrigger id="label">
										<SelectValue placeholder="Select label" />
									</SelectTrigger>
									<SelectContent>
										{ADDRESS_LABELS.map((label) => (
											<SelectItem key={label.value} value={label.value}>
												{label.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Separator />

					{/* Contact Details */}
					<div className="space-y-4">
						<p className="text-sm font-medium text-muted-foreground">
							Contact Details
						</p>

						{/* Full Name */}
						<Controller
							name="fullName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
									<Input
										{...field}
										id={field.name}
										placeholder="John Doe"
										aria-invalid={fieldState.invalid}
										disabled={isPending}
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						{/* Phone */}
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
										placeholder="+966 5X XXX XXXX"
										aria-invalid={fieldState.invalid}
										disabled={isPending}
									/>
									<FieldDescription>
										Used for delivery coordination.
									</FieldDescription>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</div>

					<Separator />

					{/* Address Details */}
					<div className="space-y-4">
						<p className="text-sm font-medium text-muted-foreground">
							Address Details
						</p>

						{/* Street */}
						<Controller
							name="street"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Street Address</FieldLabel>
									<Input
										{...field}
										id={field.name}
										placeholder="123 Main Street, Apt 4B"
										aria-invalid={fieldState.invalid}
										disabled={isPending}
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						{/* City & State */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Controller
								name="city"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>City</FieldLabel>
										<Input
											{...field}
											id={field.name}
											placeholder="Riyadh"
											aria-invalid={fieldState.invalid}
											disabled={isPending}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="state"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											State / Province
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											placeholder="Riyadh Province"
											aria-invalid={fieldState.invalid}
											disabled={isPending}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						{/* Postal Code & Country */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Controller
								name="postalCode"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Postal Code</FieldLabel>
										<Input
											{...field}
											id={field.name}
											placeholder="12345"
											aria-invalid={fieldState.invalid}
											disabled={isPending}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="country"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="country">Country</FieldLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isPending}
										>
											<SelectTrigger id="country">
												<SelectValue placeholder="Select country" />
											</SelectTrigger>
											<SelectContent>
												{COUNTRIES.map((country) => (
													<SelectItem key={country.value} value={country.value}>
														{country.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					</div>

					<Separator />

					{/* Default Address Toggle */}
					<Controller
						name="isDefault"
						control={form.control}
						render={({ field }) => (
							<div className="flex items-center justify-between py-1">
								<div className="space-y-0.5">
									<FieldLabel
										htmlFor="isDefault"
										className="cursor-pointer text-sm font-medium"
									>
										Set as default address
									</FieldLabel>
									<p className="text-xs text-muted-foreground">
										This address will be pre-selected at checkout.
									</p>
								</div>
								<Switch
									id="isDefault"
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={
										isPending || (isEditing && editingAddress?.isDefault)
									}
								/>
							</div>
						)}
					/>

					<DialogFooter className="gap-2 sm:gap-0 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isPending || !form.formState.isDirty}
							className="gap-2"
						>
							{isPending ?
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									{isEditing ? "Saving…" : "Adding…"}
								</>
							: isEditing ?
								<>
									<Save className="h-4 w-4" />
									Save Changes
								</>
							:	<>
									<Plus className="h-4 w-4" />
									Add Address
								</>
							}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
