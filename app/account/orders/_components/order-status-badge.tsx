import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Clock,
	CheckCircle,
	Loader2,
	Truck,
	PackageCheck,
	XCircle,
} from "lucide-react";

type OrderStatus =
	| "pending"
	| "confirmed"
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";

const STATUS_CONFIG: Record<
	OrderStatus,
	{
		label: string;
		className: string;
		icon: React.ElementType;
	}
> = {
	pending: {
		label: "Pending",
		className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
		icon: Clock,
	},
	confirmed: {
		label: "Confirmed",
		className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
		icon: CheckCircle,
	},
	processing: {
		label: "Processing",
		className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
		icon: Loader2,
	},
	shipped: {
		label: "Shipped",
		className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
		icon: Truck,
	},
	delivered: {
		label: "Delivered",
		className: "bg-green-500/10 text-green-600 border-green-500/20",
		icon: PackageCheck,
	},
	cancelled: {
		label: "Cancelled",
		className: "bg-red-500/10 text-red-600 border-red-500/20",
		icon: XCircle,
	},
};

interface OrderStatusBadgeProps {
	status: OrderStatus;
	className?: string;
	showIcon?: boolean;
}

export function OrderStatusBadge({
	status,
	className: extraClassName,
	showIcon = true,
}: OrderStatusBadgeProps) {
	const config = STATUS_CONFIG[status];

	if (!config) {
		return (
			<Badge variant="secondary" className={extraClassName}>
				{status}
			</Badge>
		);
	}

	const Icon = config.icon;

	return (
		<Badge
			variant="outline"
			className={cn(
				"text-xs gap-1 font-medium",
				config.className,
				extraClassName,
			)}
		>
			{showIcon && (
				<Icon
					className={cn("h-3 w-3", status === "processing" && "animate-spin")}
				/>
			)}
			{config.label}
		</Badge>
	);
}
