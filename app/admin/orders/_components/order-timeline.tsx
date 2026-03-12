import { Clock, CheckCircle2, Package, Truck, XCircle } from "lucide-react";
import type { OrderStatus } from "../_lib/data";

const STATUS_ICONS: Record<string, typeof Clock> = {
	pending: Clock,
	confirmed: CheckCircle2,
	processing: Package,
	shipped: Truck,
	delivered: CheckCircle2,
	cancelled: XCircle,
};

interface TimelineEntry {
	id: string;
	status: OrderStatus;
	note: string | null;
	occurredAt: Date;
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(date);
}

export function OrderTimeline({ entries }: { entries: TimelineEntry[] }) {
	if (entries.length === 0) {
		return (
			<p className="text-sm text-muted-foreground italic">
				No status history available.
			</p>
		);
	}

	return (
		<div className="space-y-6">
			{entries.map((entry, idx) => {
				const Icon = STATUS_ICONS[entry.status] || Clock;
				const isLast = idx === entries.length - 1;

				return (
					<div key={entry.id} className="relative flex gap-4">
						{!isLast && (
							<div className="absolute left-2.75 top-6 -bottom-6 w-px bg-border" />
						)}
						<div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background">
							<Icon className="h-3 w-3" />
						</div>
						<div className="flex-1 pb-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium capitalize">{entry.status}</p>
								<p className="text-xs text-muted-foreground">
									{formatDate(entry.occurredAt)}
								</p>
							</div>
							{entry.note && (
								<p className="text-sm text-muted-foreground mt-1 bg-secondary/30 p-2 rounded-md border">
									{entry.note}
								</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
