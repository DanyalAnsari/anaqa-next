"use server";

type ActionResult = { success: true } | { success: false; error: string };

export async function submitContactForm(data: {
	name: string;
	email: string;
	subject: string;
	message: string;
}): Promise<ActionResult> {
	try {
		// TODO: Send email, save to DB, integrate with support system
		console.log("Contact form submission:", data);

		// Simulate processing
		await new Promise((resolve) => setTimeout(resolve, 500));

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: "Failed to send message. Please try again.",
		};
	}
}
