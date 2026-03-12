"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CouponsTable } from "./coupons-table";
import { CouponFormDialog } from "./coupon-form-dialog";
import type { CouponItem } from "../_lib/data";

interface Props {
	coupons: CouponItem[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export function CouponsClient(props: Props) {
	const [showCreate, setShowCreate] = useState(false);

	return (
		<>
			<div className="flex justify-end">
				<Button onClick={() => setShowCreate(true)}>
					<Plus className="h-4 w-4 mr-2" />
					Add Coupon
				</Button>
			</div>
			<Card>
				<CardContent className="pt-6">
					<CouponsTable {...props} />
				</CardContent>
			</Card>
			<CouponFormDialog open={showCreate} onOpenChange={setShowCreate} />
		</>
	);
}
