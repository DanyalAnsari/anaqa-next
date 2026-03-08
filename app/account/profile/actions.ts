"use server";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/gif",
];

type UploadAvatarResult =
	| {
			success: true;
			data: { url: string; filePath: string; fileId: string };
	  }
	| { success: false; error: string };

export async function uploadAvatar(
	formData: FormData,
): Promise<UploadAvatarResult> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const file = formData.get("file") as File;

		if (!file) {
			return { success: false, error: "No file provided" };
		}

		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			return {
				success: false,
				error:
					"Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
			};
		}

		if (file.size > MAX_FILE_SIZE) {
			return {
				success: false,
				error: "File size must be less than 5MB.",
			};
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const { imageKitService } = await import("@/services/imagekit.service");

		const uploadResult = await imageKitService.uploadAvatar(
			buffer,
			file.name,
			session.user.id,
		);

		// Persist avatar metadata to the user row
		await updateUserAvatar({
			fileId: uploadResult.fileId,
			url: uploadResult.url,
			filePath: uploadResult.filePath,
		});

		// Clean up previous avatars in ImageKit (keep only latest)
		await imageKitService
			.cleanupOldAvatars(session.user.id, 1)
			.catch((err: unknown) => {
				// Non-critical — log but don't fail the request
				console.warn("Avatar cleanup warning:", err);
			});

		revalidatePath("/account/profile");
		revalidatePath("/account");

		return {
			success: true,
			data: {
				url: uploadResult.url,
				filePath: uploadResult.filePath,
				fileId: uploadResult.fileId,
			},
		};
	} catch (error) {
		console.error("Avatar upload error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to upload avatar",
		};
	}
}

export async function deleteAvatar(): Promise<
	{ success: true } | { success: false; error: string }
> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) return { success: false, error: "Unauthorized" };

		if (session.user.avatarFileId) {
			const { imageKitService } = await import("@/services/imagekit.service");
			await imageKitService.deleteImage(session.user.avatarFileId);
		}

		// Clear avatar fields in the database
		await updateUserAvatar(null);

		revalidatePath("/account/profile");
		revalidatePath("/account");

		return { success: true };
	} catch (error) {
		console.error("Avatar delete error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Failed to delete avatar",
		};
	}
}

async function updateUserAvatar(
	avatar: { fileId: string; url: string; filePath: string } | null,
) {
	await auth.api.updateUser({
		headers: await headers(),
		body: {
			image: avatar?.url ?? null,
			avatarFileId: avatar?.fileId ?? null,
			avatarFilePath: avatar?.filePath ?? null,
		},
	});
}
