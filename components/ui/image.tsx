"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

// ── Helpers ──

function buildImageKitUrl(src: string, transforms?: string): string {
	if (src.startsWith("http")) return src;
	const cleanPath = src.startsWith("/") ? src.slice(1) : src;
	return transforms ?
			`${URL_ENDPOINT}/tr:${transforms}/${cleanPath}`
		:	`${URL_ENDPOINT}/${cleanPath}`;
}

// ── OptimizedImage ──

interface OptimizedImageProps extends Omit<
	React.ComponentProps<typeof Image>,
	"src"
> {
	src?: string | null;
	fallback?: React.ReactNode;
	transforms?: string;
}

function OptimizedImage({
	src,
	className,
	fallback,
	transforms,
	onError,
	...props
}: OptimizedImageProps) {
	const [hasError, setHasError] = React.useState(false);

	React.useEffect(() => {
		setHasError(false);
	}, [src]);

	if (!src || hasError) {
		return fallback ? <div className={className}>{fallback}</div> : null;
	}

	const imageUrl = buildImageKitUrl(src, transforms);

	return (
		<Image
			src={imageUrl}
			className={cn("rounded-md object-cover", className)}
			onError={(e) => {
				setHasError(true);
				onError?.(e);
			}}
			{...props}
		/>
	);
}

// ── AvatarImage ──

interface AvatarImageProps {
	src?: string | null;
	size?: number;
	initials?: string;
	alt?: string;
	className?: string;
}

function AvatarImage({
	src,
	size = 200,
	initials = "?",
	alt = "Avatar",
	className,
}: AvatarImageProps) {
	const [hasError, setHasError] = React.useState(false);

	React.useEffect(() => {
		setHasError(false);
	}, [src]);

	const imageUrl = React.useMemo(() => {
		if (!src) return null;
		return buildImageKitUrl(src, `w-${size},h-${size},c-force,fo-face,q-90`);
	}, [src, size]);

	if (!imageUrl || hasError) {
		return (
			<AvatarFallback className="flex items-center justify-center text-2xl">
				{initials}
			</AvatarFallback>
		);
	}

	return (
		<Image
			src={imageUrl}
			alt={alt}
			width={size}
			height={size}
			className={cn("aspect-square size-full object-cover", className)}
			onError={() => setHasError(true)}
		/>
	);
}

// ── ProductImage (server-friendly, no state) ──

interface ProductImageProps {
	filePath?: string | null;
	alt: string;
	width: number;
	height: number;
	className?: string;
	transforms?: string;
	priority?: boolean;
	fallback?: React.ReactNode;
}

function ProductImage({
	filePath,
	alt,
	width,
	height,
	className,
	transforms,
	priority = false,
	fallback,
}: ProductImageProps) {
	if (!filePath) {
		return fallback ? <>{fallback}</> : null;
	}

	const imageUrl = buildImageKitUrl(
		filePath,
		transforms || `w-${width * 2},h-${height * 2},c-at_max,q-80`,
	);

	return (
		<Image
			src={imageUrl}
			alt={alt}
			width={width}
			height={height}
			priority={priority}
			className={cn("object-cover", className)}
		/>
	);
}

export { OptimizedImage, AvatarImage, ProductImage, buildImageKitUrl };
