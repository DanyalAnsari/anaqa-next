"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ProductImage } from "@/components/ui/image";

interface GalleryImage {
	id: string;
	filePath: string;
	altText: string | null;
	position: number;
}

interface ProductGalleryProps {
	images: GalleryImage[];
	productTitle: string;
}

export function ProductGallery({ images, productTitle }: ProductGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
	const imageRef = useRef<HTMLDivElement>(null);

	const selectedImage = images[selectedIndex];

	const handlePrevious = () => {
		setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!imageRef.current) return;
		const rect = imageRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		setZoomPosition({ x, y });
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") handlePrevious();
		else if (e.key === "ArrowRight") handleNext();
	};

	if (images.length === 0) {
		return (
			<div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center">
				<Package className="h-16 w-16 text-muted-foreground/20" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div
				className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden group"
				onKeyDown={handleKeyDown}
				tabIndex={0}
				role="region"
				aria-label="Product image gallery"
			>
				<Dialog>
					<DialogTrigger asChild>
						<div
							ref={imageRef}
							className="relative w-full h-full cursor-zoom-in"
							onMouseEnter={() => setIsZoomed(true)}
							onMouseLeave={() => setIsZoomed(false)}
							onMouseMove={handleMouseMove}
						>
							{selectedImage && (
								<ProductImage
									filePath={selectedImage.filePath}
									alt={
										selectedImage.altText ||
										`${productTitle} - Image ${selectedIndex + 1}`
									}
									width={800}
									height={1066}
									priority={selectedIndex === 0}
									className={cn(
										"w-full h-full object-cover transition-transform duration-300",
										isZoomed && "scale-110",
									)}
									transforms="w-1600,h-2132,c-at_max,q-90"
								/>
							)}

							<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
									<ZoomIn className="h-5 w-5" />
								</div>
							</div>
						</div>
					</DialogTrigger>
					<DialogContent className="max-w-4xl p-0 bg-transparent border-none">
						<VisuallyHidden>
							<DialogTitle>{productTitle}</DialogTitle>
						</VisuallyHidden>
						{selectedImage && (
							<ProductImage
								filePath={selectedImage.filePath}
								alt={selectedImage.altText || productTitle}
								width={1200}
								height={1600}
								className="w-full h-auto rounded-lg"
								transforms="w-2400,h-3200,c-at_max,q-95"
							/>
						)}
					</DialogContent>
				</Dialog>

				{/* Navigation */}
				{images.length > 1 && (
					<>
						<Button
							variant="secondary"
							size="icon"
							className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 rounded-full shadow-lg"
							onClick={handlePrevious}
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>
						<Button
							variant="secondary"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 rounded-full shadow-lg"
							onClick={handleNext}
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</Button>

						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
							{selectedIndex + 1} / {images.length}
						</div>
					</>
				)}
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
					{images.map((image, index) => (
						<button
							key={image.id}
							onClick={() => setSelectedIndex(index)}
							className={cn(
								"relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
								selectedIndex === index ? "border-foreground" : (
									"border-transparent hover:border-foreground/50"
								),
							)}
							aria-label={`View image ${index + 1}`}
							aria-current={selectedIndex === index ? "true" : undefined}
						>
							<ProductImage
								filePath={image.filePath}
								alt={`Thumbnail ${index + 1}`}
								width={80}
								height={80}
								className="w-full h-full object-cover"
								transforms="w-160,h-160,c-at_max,q-70"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
