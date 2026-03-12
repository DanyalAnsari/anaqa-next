"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createCoupon, updateCoupon } from "../_actions/coupons";
import type { CouponItem } from "../_lib/data";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	coupon?: CouponItem | null;
}

function formatDateForInput(date: Date) {
	return new Date(date).toISOString().slice(0, 16);
}

export function CouponFormDialog({ open, onOpenChange, coupon }: Props) {
	const router = useRouter();
	const isEditing = !!coupon;
	const [loading, setLoading] = useState(false);

	const [code, setCode] = useState(coupon?.code ?? "");
	const [description, setDescription] = useState(coupon?.description ?? "");
	const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
		coupon?.discountType ?? "percentage",
	);
	const [discountValue, setDiscountValue] = useState(
		coupon?.discountValue ?? 0,
	);
	const [minimumPurchase, setMinimumPurchase] = useState(
		coupon?.minimumPurchase ?? 0,
	);
	const [maximumDiscount, setMaximumDiscount] = useState(
		coupon?.maximumDiscount ?? 0,
	);
	const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit ?? 100);
	const [perUserLimit, setPerUserLimit] = useState(coupon?.perUserLimit ?? 1);
	const [validFrom, setValidFrom] = useState(
		coupon ? formatDateForInput(coupon.validFrom) : "",
	);
	const [validUntil, setValidUntil] = useState(
		coupon ? formatDateForInput(coupon.validUntil) : "",
	);
	const [isActive, setIsActive] = useState(coupon?.isActive ?? true);

	async function handleSubmit() {
		if (!code.trim() || !validFrom || !validUntil) {
			toast.error("Fill required fields");
			return;
		}

		setLoading(true);
		const payload = {
			code: code.toUpperCase(),
			description: description || undefined,
			discountType,
			discountValue,
			minimumPurchase: minimumPurchase || undefined,
			maximumDiscount: maximumDiscount || undefined,
			usageLimit,
			perUserLimit,
			validFrom,
			validUntil,
			isActive,
		};

		try {
			const result =
				isEditing ?
					await updateCoupon(coupon!.id, payload)
				:	await createCoupon(payload);
			if (result.success) {
				toast.success(isEditing ? "Coupon updated" : "Coupon created");
				onOpenChange(false);
				router.refresh();
			} else toast.error(result.error);
		} catch {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Coupon" : "New Coupon"}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Code *</Label>
							<Input
								value={code}
								onChange={(e) => setCode(e.target.value.toUpperCase())}
								placeholder="SUMMER20"
							/>
						</div>
						<div className="space-y-2">
							<Label>Discount Type *</Label>
							<Select
								value={discountType}
								onValueChange={(v) =>
									setDiscountType(v as "percentage" | "fixed")
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="percentage">Percentage</SelectItem>
									<SelectItem value="fixed">Fixed Amount</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Description</Label>
						<Textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={2}
						/>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Value *</Label>
							<Input
								type="number"
								step="0.01"
								value={discountValue}
								onChange={(e) => setDiscountValue(Number(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Min Purchase</Label>
							<Input
								type="number"
								step="0.01"
								value={minimumPurchase}
								onChange={(e) => setMinimumPurchase(Number(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Max Discount</Label>
							<Input
								type="number"
								step="0.01"
								value={maximumDiscount}
								onChange={(e) => setMaximumDiscount(Number(e.target.value))}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Usage Limit *</Label>
							<Input
								type="number"
								value={usageLimit}
								onChange={(e) => setUsageLimit(Number(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<Label>Per User Limit</Label>
							<Input
								type="number"
								value={perUserLimit}
								onChange={(e) => setPerUserLimit(Number(e.target.value))}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Valid From *</Label>
							<Input
								type="datetime-local"
								value={validFrom}
								onChange={(e) => setValidFrom(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>Valid Until *</Label>
							<Input
								type="datetime-local"
								value={validUntil}
								onChange={(e) => setValidUntil(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between p-3 rounded-lg border">
						<Label>Active</Label>
						<Switch checked={isActive} onCheckedChange={setIsActive} />
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={loading}>
						{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
						{isEditing ? "Update" : "Create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
