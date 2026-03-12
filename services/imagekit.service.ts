import "server-only";

import {
	uploadToImageKit,
	deleteFromImageKit,
	getFileDetails,
	listFiles,
	bulkDeleteFiles,
} from "@/lib/imagekit";

export const imageKitService = {
	async uploadAvatar(file: Buffer, fileName: string, userId: string) {
		return uploadToImageKit({
			file,
			fileName,
			folder: `avatars/${userId}`,
			tags: ["avatar", `user-${userId}`],
		});
	},

	async uploadProductImage(file: Buffer, fileName: string, productId: string) {
		return uploadToImageKit({
			file,
			fileName,
			folder: `products/${productId}`,
			tags: ["product", `product-${productId}`],
		});
	},

	async uploadCategoryImage(
		file: Buffer,
		fileName: string,
		categoryId: string,
	) {
		return uploadToImageKit({
			file,
			fileName,
			folder: `categories/${categoryId}`,
			tags: ["category", `category-${categoryId}`],
		});
	},

	async uploadBannerImage(file: Buffer, fileName: string) {
		return uploadToImageKit({
			file,
			fileName,
			folder: "banners",
			tags: ["banner"],
		});
	},

	async deleteImage(fileId: string) {
		return deleteFromImageKit(fileId);
	},

	async getImageDetails(fileId: string) {
		return getFileDetails(fileId);
	},

	async listUserAvatars(userId: string) {
		const items = await listFiles({
			folder: `avatars/${userId}`,
			tags: [`user-${userId}`],
		});
		// Filter out folders, keep only files
		return items.filter(
			(item): item is typeof item & { fileId: string; createdAt: string } =>
				"fileId" in item && "createdAt" in item,
		);
	},

	async listProductImages(productId: string) {
		const items = await listFiles({
			folder: `products/${productId}`,
			tags: [`product-${productId}`],
		});
		return items.filter(
			(item): item is typeof item & { fileId: string } => "fileId" in item,
		);
	},

	async bulkDelete(fileIds: string[]) {
		return bulkDeleteFiles(fileIds);
	},

	async cleanupOldAvatars(userId: string, keep = 1) {
		const avatars = await this.listUserAvatars(userId);
		const sorted = avatars.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
		const toDelete = sorted.slice(keep);

		if (toDelete.length === 0) return { deleted: 0, kept: sorted.length };

		const result = await this.bulkDelete(toDelete.map((a) => a.fileId));
		return {
			deleted: result.successfulDeletes.length,
			failed: result.failedDeletes.length,
			kept: keep,
		};
	},
};
