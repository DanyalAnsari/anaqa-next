import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

export interface SendMailOptions {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
}

export const transporter = nodemailer.createTransport({
	host: SMTP_HOST!,
	port: Number(SMTP_PORT),
	secure: Number(SMTP_PORT) === 465,
	auth: {
		user: SMTP_USER!,
		pass: SMTP_PASS!,
	},
});

export const sendMail = async (options: SendMailOptions): Promise<void> => {
	await transporter.sendMail({
		from: EMAIL_FROM,
		to: options.to,
		subject: options.subject,
		html: options.html,
		text: options.text,
	});
};

export const verifyConnection = async (): Promise<boolean> => {
	try {
		await transporter.verify();
		return true;
	} catch {
		return false;
	}
};
