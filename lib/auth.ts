import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database";
import schema from "@/database/schemas";
import { sendEmail } from "./nodemailer";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }, request) => {
			void sendEmail({
				to: user.email,
				subject: "Verify your email address",
				html: `<h1>Click the link to verify your email: <a href="${url}">${url}</a></h1>`,
			});
		},
	},
	plugins: [nextCookies()],
});
