"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { sendNewsletter } from "../_actions/settings";

export function NewsletterForm() {
	const [loading, setLoading] = useState(false);
	const [subject, setSubject] = useState("");
	const [content, setContent] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!subject || !content) {
			toast.error("Please fill in both subject and content");
			return;
		}

		setLoading(true);
		try {
			const result = await sendNewsletter(subject, content);
			if (result.success) {
				toast.success(`Newsletter sent to ${result.data?.sent} subscribers`);
				setSubject("");
				setContent("");
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to send newsletter");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label>Subject</Label>
				<Input
					placeholder="New Summer Collection is Here!"
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					disabled={loading}
				/>
			</div>
			<div className="space-y-2">
				<Label>Content</Label>
				<Textarea
					placeholder="Newsletter content..."
					className="min-h-50"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					disabled={loading}
				/>
			</div>
			<div className="flex justify-end">
				<Button type="submit" disabled={loading || !subject || !content}>
					{loading ?
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					:	<Send className="mr-2 h-4 w-4" />}
					{loading ? "Sending..." : "Send Broadcast"}
				</Button>
			</div>
		</form>
	);
}
