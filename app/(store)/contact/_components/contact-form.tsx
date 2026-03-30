"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "../actions";

const contactSchema = z.object({
	name: z.string().min(2, "Name is required"),
	email: z.string().email("Valid email is required"),
	subject: z.string().min(2, "Subject is required"),
	message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isPending, startTransition] = useTransition();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
	});

	const onSubmit = (data: ContactFormValues) => {
		startTransition(async () => {
			const result = await submitContactForm(data);
			if (result.success) {
				setIsSubmitted(true);
				toast.success("Message sent!", {
					description: "We'll get back to you as soon as possible.",
				});
				reset();
			} else {
				toast.error(result.error);
			}
		});
	};

	if (isSubmitted) {
		return (
			<div className="bg-card border border-border rounded-lg p-8 text-center">
				<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
				</div>
				<h3 className="text-xl font-medium mb-2">Message Sent!</h3>
				<p className="text-muted-foreground mb-6">
					Thank you for reaching out. We&apos;ll get back to you as soon as
					possible.
				</p>
				<Button onClick={() => setIsSubmitted(false)}>
					Send Another Message
				</Button>
			</div>
		);
	}

	return (
		<div className="bg-card border border-border rounded-lg p-6 md:p-8">
			<h2 className="text-xl font-medium mb-6">Send a Message</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							placeholder="Your name"
							disabled={isPending}
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							disabled={isPending}
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="subject">Subject</Label>
					<Input
						id="subject"
						placeholder="How can we help?"
						disabled={isPending}
						{...register("subject")}
					/>
					{errors.subject && (
						<p className="text-sm text-destructive">{errors.subject.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="message">Message</Label>
					<Textarea
						id="message"
						rows={5}
						placeholder="Tell us more..."
						disabled={isPending}
						className="resize-none"
						{...register("message")}
					/>
					{errors.message && (
						<p className="text-sm text-destructive">{errors.message.message}</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isPending}>
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Send Message
				</Button>
			</form>
		</div>
	);
}
