import { createAuthClient } from "better-auth/react";
import {
	adminClient,
	emailOTPClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	plugins: [
		inferAdditionalFields<typeof auth>(),
		adminClient(),
		emailOTPClient(),
	],
});

export type Session = typeof authClient.$Infer.Session;
export type User = Session["user"];
