import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database";
import schema from "@/database/schemas";
import { emailService } from "@/services/email.service";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }, request) => {
			void emailService.sendPasswordResetEmail({
				user,
				url,
			});
		},
		onPasswordReset: async ({ user }, request) => {
			// your logic here
			console.log(`Password for user ${user.email} has been reset.`);
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }, request) => {
			void emailService.sendVerificationEmail({ user, url });
		},
		autoSignInAfterVerification: true,
		sendOnSignIn: true,
	},
	plugins: [nextCookies()],
});
