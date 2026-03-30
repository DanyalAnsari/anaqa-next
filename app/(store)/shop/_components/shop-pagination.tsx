"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function ShopPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: ShopPaginationProps) {
	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push("ellipsis");

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) {
				if (!pages.includes(i)) pages.push(i);
			}

			if (currentPage < totalPages - 2) pages.push("ellipsis");
			if (!pages.includes(totalPages)) pages.push(totalPages);
		}

		return pages;
	};

	return (
		<nav
			className={cn("flex items-center justify-center gap-1", className)}
			aria-label="Pagination"
		>
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label="Previous page"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<div className="flex items-center gap-1">
				{getPageNumbers().map((page, index) =>
					page === "ellipsis" ?
						<span
							key={`ellipsis-${index}`}
							className="px-2 text-muted-foreground"
						>
							<MoreHorizontal className="h-4 w-4" />
						</span>
					:	<Button
							key={page}
							variant={currentPage === page ? "default" : "outline"}
							size="icon"
							onClick={() => onPageChange(page)}
							aria-label={`Page ${page}`}
							aria-current={currentPage === page ? "page" : undefined}
						>
							{page}
						</Button>,
				)}
			</div>

			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label="Next page"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</nav>
	);
}
