"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/app/(store)/actions";

export function NewsletterSection() {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;

		startTransition(async () => {
			const result = await subscribeNewsletter(email.trim());
			if (result.success) {
				toast.success("Subscribed!", {
					description: "Thank you for joining our newsletter.",
				});
				setIsSubscribed(true);
				setEmail("");
			} else {
				toast.error(result.error);
			}
		});
	};

	return (
		<section className="editorial-spacing bg-secondary/30">
			<div className="container-narrow text-center">
				<Mail className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
				<h2 className="text-2xl md:text-3xl font-medium mb-4">
					Stay in the Loop
				</h2>
				<p className="text-muted-foreground mb-8 max-w-md mx-auto">
					Subscribe to receive updates on new arrivals, special offers, and
					styling tips.
				</p>

				{isSubscribed ?
					<div className="flex items-center justify-center gap-2 text-green-600">
						<CheckCircle className="h-5 w-5" />
						<p className="font-medium">You&apos;re subscribed!</p>
					</div>
				:	<form
						onSubmit={handleSubmit}
						className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
					>
						<Input
							type="email"
							placeholder="Your email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isPending}
							className="flex-1"
						/>
						<Button type="submit" disabled={isPending} className="shrink-0">
							{isPending ?
								<Loader2 className="h-4 w-4 animate-spin" />
							:	"Subscribe"}
						</Button>
					</form>
				}
			</div>
		</section>
	);
}
