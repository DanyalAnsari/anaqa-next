import "server-only";
import { createElement, type ReactElement } from "react";
import { render } from "@react-email/render";

//  Template Imports

import { sendEmail } from "@/lib/nodemailer";
import VerificationEmail from "@/components/emails/verification-mail";
import PasswordResetEmail from "@/components/emails/password-reset";
import PasswordChangedEmail from "@/components/emails/password-change";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function renderTemplate(
	element: ReactElement,
): Promise<{ html: string; text: string }> {
	const [html, text] = await Promise.all([
		render(element),
		render(element, { plainText: true }),
	]);
	return { html, text };
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface TokenEmailData {
	email: string;
	token: string;
	firstName?: string;
}

export const emailService = {
	sendVerificationEmail: async (data: TokenEmailData): Promise<void> => {
		const verificationUrl = `${APP_URL}/auth/verify-email?token=${encodeURIComponent(data.token)}`;

		const { html, text } = await renderTemplate(
			createElement(VerificationEmail, {
				firstName: data.firstName,
				verificationUrl,
			}),
		);

		await sendEmail({
			to: data.email,
			subject: "Verify Your Email Address",
			html,
			text,
		});
	},

	sendPasswordResetEmail: async (data: TokenEmailData): Promise<void> => {
		const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(data.token)}`;

		const { html, text } = await renderTemplate(
			createElement(PasswordResetEmail, {
				firstName: data.firstName,
				resetUrl,
			}),
		);

		await sendEmail({
			to: data.email,
			subject: "Reset Your Password",
			html,
			text,
		});
	},

	sendPasswordChangedEmail: async (
		email: string,
		firstName?: string,
	): Promise<void> => {
		const { html, text } = await renderTemplate(
			createElement(PasswordChangedEmail, { firstName }),
		);

		await sendEmail({
			to: email,
			subject: "Your Password Has Been Changed",
			html,
			text,
		});
	},
};
