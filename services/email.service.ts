import "server-only";
import { createElement, type ReactElement } from "react";
import { render } from "@react-email/render";

//  Template Imports

import { sendEmail } from "@/lib/nodemailer";
import VerificationEmail from "@/components/emails/verification-mail";
import PasswordResetEmail from "@/components/emails/password-reset";
import PasswordChangedEmail from "@/components/emails/password-change";
import { User } from "better-auth";

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
	user: User;
	token?: string;
	url: string;
}

export const emailService = {
	sendVerificationOtp: async (email: string, otp: string): Promise<void> => {
		const { html, text } = await renderTemplate(
			createElement(VerificationEmail, { otp }),
		);

		await sendEmail({
			to: email,
			subject: "Your Verification Code – Anāqa",
			html,
			text,
		});
	},

	sendPasswordResetEmail: async ({
		user,
		url,
	}: TokenEmailData): Promise<void> => {
		const { html, text } = await renderTemplate(
			createElement(PasswordResetEmail, {
				firstName: user.name.split(" ")[0],
				resetUrl: url,
			}),
		);

		await sendEmail({
			to: user.email,
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
