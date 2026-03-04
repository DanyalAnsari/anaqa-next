"use server";

import { LoginInput, RegisterInput } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

export const registerUser = async ({
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
		console.error("Registration failed:", error);
		return { success: false, error: "Registration failed" };
	}
};

export const loginWithEmail = async ({ email, password }: LoginInput) => {
	try {
		const response = await auth.api.signInEmail({
			body: {
				email,
				password,
			},

			headers: await headers(),
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
