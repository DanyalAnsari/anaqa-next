import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database";
import schema from "@/database/schemas";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }, request) => {
			const { emailService } = await import("@/services/email.service");
			await emailService.sendPasswordResetEmail({
				user,
				url,
			});
		},
		onPasswordReset: async ({ user }, request) => {
			// your logic here
			console.log(`Password for user ${user.email} has been reset.`);
			const { emailService } = await import("@/services/email.service");
			await emailService.sendPasswordChangedEmail(
				user.email,
				user.name.split(" ")[0],
			);
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }, request) => {
			const { emailService } = await import("@/services/email.service");
			await emailService.sendVerificationEmail({ user, url });
		},
		autoSignInAfterVerification: true,
		sendOnSignIn: true,
	},
	plugins: [admin(), nextCookies()],
});
