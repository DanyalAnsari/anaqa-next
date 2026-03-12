"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { updateOrderStatus } from "../_actions/orders";
import type { OrderStatus } from "../_lib/data";

interface UpdateStatusFormProps {
	orderId: string;
	currentStatus: OrderStatus;
	transitions: OrderStatus[];
}

export function UpdateStatusForm({
	orderId,
	currentStatus,
	transitions,
}: UpdateStatusFormProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");
	const [note, setNote] = useState("");

	async function handleSubmit() {
		if (!status) return;
		setLoading(true);
		try {
			const result = await updateOrderStatus(
				orderId,
				status as OrderStatus,
				note || undefined,
			);
			if (result.success) {
				toast.success("Order status updated");
				setStatus("");
				setNote("");
				router.refresh();
			} else {
				toast.error(result.error);
			}
		} catch {
			toast.error("Failed to update status");
		} finally {
			setLoading(false);
		}
	}

	if (transitions.length === 0) {
		return (
			<div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border text-center">
				This order is <strong className="capitalize">{currentStatus}</strong>{" "}
				and cannot be updated further.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>Next Status</Label>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger>
						<SelectValue placeholder="Select status..." />
					</SelectTrigger>
					<SelectContent>
						{transitions.map((t) => (
							<SelectItem key={t} value={t} className="capitalize">
								{t}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-2">
				<Label>Note (optional)</Label>
				<Textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="Add a note to the timeline..."
					rows={2}
				/>
			</div>
			<Button
				className="w-full"
				onClick={handleSubmit}
				disabled={!status || loading}
			>
				{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
				Update Order
			</Button>
		</div>
	);
}
