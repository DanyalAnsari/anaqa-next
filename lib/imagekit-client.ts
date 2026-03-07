"use client";

const URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

interface TransformOptions {
	path: string;
	width?: number;
	height?: number;
	quality?: number;
	format?: "auto" | "webp" | "jpg" | "png";
	crop?: "force" | "at_max" | "at_least";
	focus?: "auto" | "center" | "face";
}

export function getImageUrl({
	path,
	width,
	height,
	quality = 80,
	format = "auto",
	crop,
	focus,
}: TransformOptions): string | null {
	if (!path) return null;

	const cleanPath = path.startsWith("/") ? path.slice(1) : path;
	const t: string[] = [`q-${quality}`, `f-${format}`];

	if (width) t.push(`w-${width}`);
	if (height) t.push(`h-${height}`);
	if (crop) t.push(`c-${crop}`);
	if (focus) t.push(`fo-${focus}`);

	return `${URL_ENDPOINT}/tr:${t.join(",")}/${cleanPath}`;
}

export function getAvatarUrl(
	path: string | null | undefined,
	size = 200,
): string | null {
	if (!path) return null;
	return getImageUrl({
		path,
		width: size,
		height: size,
		quality: 90,
		crop: "force",
		focus: "face",
	});
}

export function getProductImageUrl(
	path: string | null | undefined,
	width?: number,
	height?: number,
): string | null {
	if (!path) return null;
	return getImageUrl({ path, width, height });
}
