"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

interface OptimizedImageProps extends Omit<
	React.ComponentProps<typeof Image>,
	"src"
> {
	src?: string | null;
	fallback?: React.ReactNode;
}

function OptimizedImage({
	src,
	className,
	fallback,
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

	return (
		<Image
			src={src}
			className={cn("rounded-md object-cover", className)}
			onError={(e) => {
				setHasError(true);
				onError?.(e);
			}}
			{...props}
		/>
	);
}

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

	// Build full ImageKit URL if path is relative
	const imageUrl = React.useMemo(() => {
		if (!src) return null;
		if (src.startsWith("http")) return src;
		const cleanPath = src.startsWith("/") ? src.slice(1) : src;
		return `${URL_ENDPOINT}/tr:w-${size},h-${size},c-force,fo-face,q-90/${cleanPath}`;
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

export { OptimizedImage, AvatarImage };
