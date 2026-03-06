"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm<ContactFormInput>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
		mode: "onTouched",
	});

	const onSubmit = async (data: ContactFormInput) => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log("Contact form submitted:", data);
		setIsLoading(false);
		setIsSubmitted(true);
		toast.success("Message sent!", {
			description: "We'll get back to you as soon as possible.",
		});
		form.reset();
	};
	return (
		<div>
			{isSubmitted ?
				<div className="bg-card border border-border rounded-lg p-8 text-center">
					<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
						<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
					</div>
					<h3 className="text-xl font-medium mb-2">Message Sent!</h3>
					<p className="text-muted-foreground mb-6">
						Thank you for reaching out. We'll get back to you as soon as
						possible.
					</p>
					<Button onClick={() => setIsSubmitted(false)}>
						Send Another Message
					</Button>
				</div>
			:	<div className="bg-card border border-border rounded-lg p-6 md:p-8">
					<h2 className="text-xl font-medium mb-6">Send a Message</h2>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Controller
									name="name"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={field.name}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												id={field.name}
												aria-invalid={fieldState.invalid}
												placeholder="Your name"
												autoComplete="name"
												disabled={isLoading}
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>
							<div className="space-y-2">
								<Controller
									name="email"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={field.name}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												aria-invalid={fieldState.invalid}
												type="email"
												placeholder="you@example.com"
												autoComplete="email"
												disabled={isLoading}
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Controller
								name="subject"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={field.name}>
										<FieldLabel htmlFor={field.name}>Subject</FieldLabel>
										<Input
											id={field.name}
											aria-invalid={fieldState.invalid}
											placeholder="How can we help?"
											disabled={isLoading}
											{...field}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						<div className="space-y-2">
							<Controller
								name="message"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={field.name}>
										<FieldLabel htmlFor={field.name}>Message</FieldLabel>
										<Textarea
											id={field.name}
											rows={5}
											aria-invalid={fieldState.invalid}
											placeholder="Tell us more..."
											disabled={isLoading}
											{...field}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							size="lg"
							disabled={isLoading}
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Send Message
						</Button>
					</form>
				</div>
			}
		</div>
	);
}
