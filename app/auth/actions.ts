"use server";

import { LoginInput, RegisterInput } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";

export const registerWithEmail = async ({
	email,
	password,
	name,
}: Omit<RegisterInput, "confirmPassword">) => {
	try {
		const response = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name,
			},
		});

		return { success: true, data: response };
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, error: error.message };
		}
		console.log("Registeration failed:", error);
		return { success: false, error: "Registeration failed" };
	}
};

export const loginWithEmail = async ({ email, password }: LoginInput) => {
	try {
		const response = await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		});

		return { success: true, data: response };
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, error: error.message };
		}
		console.log("Login failed:", error);
		return { success: false, error: "Login failed" };
	}
};
