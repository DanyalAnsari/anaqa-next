import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin, emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database";
import schema from "@/database/schemas";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	user: {
		additionalFields: {
			phone: {
				type: "string",
				required: false,
			},
			avatarFileId: { type: "string", required: false },
			avatarFilePath: { type: "string", required: false },
		},
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }, _request) => {
			const { emailService } = await import("@/services/email.service");
			await emailService.sendPasswordResetEmail({
				user,
				url,
			});
		},
		onPasswordReset: async ({ user }, _request) => {
			const { emailService } = await import("@/services/email.service");
			emailService.sendPasswordChangedEmail(
				user.email,
				user.name.split(" ")[0],
			);
		},
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		sendOnSignIn: true,
	},
	plugins: [
		emailOTP({
			overrideDefaultEmailVerification: true,
			async sendVerificationOTP({ email, otp, type }) {
				if (type === "email-verification") {
					const { emailService } = await import("@/services/email.service");
					emailService.sendVerificationOtp(email, otp);
				}
			},
		}),
		admin(),
		nextCookies(),
	],
});
