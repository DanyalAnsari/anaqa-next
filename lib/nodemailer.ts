import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

export interface SendMailOptions {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
}

// Singleton (survives Next.js HMR in dev)

const globalForEmail = globalThis as unknown as {
	emailTransporter: Transporter | undefined;
};

function createTransporter(): Transporter {
	const host = process.env.SMTP_HOST;
	const port = Number(process.env.SMTP_PORT) || 587;
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;

	if (!host || !user || !pass) {
		throw new Error(
			"Missing SMTP configuration. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your .env.local",
		);
	}

	return nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
		tls: {
			rejectUnauthorized: process.env.NODE_ENV === "production",
		},
	});
}

export const transporter =
	globalForEmail.emailTransporter ?? createTransporter();

if (process.env.NODE_ENV !== "production") {
	globalForEmail.emailTransporter = transporter;
}

export async function sendEmail(options: SendMailOptions): Promise<void> {
	const from = process.env.EMAIL_FROM || "Anāqa <noreply@anaqa.com>";

	const info = await transporter.sendMail({
		from,
		to: options.to,
		subject: options.subject,
		html: options.html,
		text: options.text,
	});

	if (process.env.NODE_ENV === "development") {
		const recips = Array.isArray(options.to) ? options.to.length : 1;
		console.log(`✉️  Email sent: ${info.messageId} → ${recips} recipient(s)`);
	}
}

export async function verifyEmailConnection(): Promise<boolean> {
	try {
		await transporter.verify();
		console.log("✅ Email transporter connected successfully");
		return true;
	} catch (error: any) {
		console.error(
			"❌ Email transporter connection failed:",
			error?.message || "Unknown error",
		);
		return false;
	}
}
