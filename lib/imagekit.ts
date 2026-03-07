import "server-only";

import ImageKit from "imagekit";

const globalForImageKit = globalThis as unknown as {
	imagekit: ImageKit | undefined;
};

function createImageKit() {
	const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
	const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
	const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

	if (!urlEndpoint || !publicKey || !privateKey) {
		throw new Error("Missing ImageKit environment variables.");
	}

	return new ImageKit({ urlEndpoint, publicKey, privateKey });
}

export const imagekit = globalForImageKit.imagekit ?? createImageKit();

if (process.env.NODE_ENV !== "production") {
	globalForImageKit.imagekit = imagekit;
}

export interface UploadResult {
	fileId: string;
	name: string;
	url: string;
	filePath: string;
	thumbnailUrl?: string;
	width?: number;
	height?: number;
	size: number;
}

export async function uploadToImageKit({
	file,
	fileName,
	folder = "uploads",
	tags = [],
}: {
	file: Buffer | string;
	fileName: string;
	folder?: string;
	tags?: string[];
}): Promise<UploadResult> {
	const response = await imagekit.upload({
		file,
		fileName: `${Date.now()}-${fileName}`,
		folder,
		useUniqueFileName: true,
		tags: [...tags, "app-upload"],
	});

	return {
		fileId: response.fileId,
		name: response.name,
		url: response.url,
		filePath: response.filePath,
		thumbnailUrl: response.thumbnailUrl,
		width: response.width,
		height: response.height,
		size: response.size,
	};
}

export async function deleteFromImageKit(fileId: string) {
	await imagekit.deleteFile(fileId);
}

export async function getFileDetails(fileId: string) {
	return imagekit.getFileDetails(fileId);
}

export async function listFiles(
	options: {
		folder?: string;
		tags?: string[];
		limit?: number;
		skip?: number;
	} = {},
) {
	return imagekit.listFiles({
		path: options.folder,
		tags: options.tags,
		limit: options.limit ?? 100,
		skip: options.skip ?? 0,
	});
}

export async function bulkDeleteFiles(fileIds: string[]) {
	const successfulDeletes: string[] = [];
	const failedDeletes: string[] = [];

	await Promise.allSettled(
		fileIds.map(async (id) => {
			try {
				await deleteFromImageKit(id);
				successfulDeletes.push(id);
			} catch {
				failedDeletes.push(id);
			}
		}),
	);

	return { successfulDeletes, failedDeletes };
}
