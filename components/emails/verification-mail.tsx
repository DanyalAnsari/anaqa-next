import { Text, Section } from "@react-email/components";
import { EmailLayout } from "@/components/emails/layout";
import { heading, paragraph, muted, colors } from "@/components/emails/theme";
import type { CSSProperties } from "react";

interface VerificationEmailProps {
	name?: string;
	otp: string;
}

const VerificationEmail = ({ name = "there", otp }: VerificationEmailProps) => {
	return (
		<EmailLayout preview="Your email verification code for Anāqa">
			<Text style={heading()}>Verify Your Email</Text>

			<Text style={paragraph}>Hi {name},</Text>

			<Text style={paragraph}>
				Thank you for creating an account with Anāqa. Use the verification code
				below to confirm your email address.
			</Text>

			<Section style={otpContainer}>
				<Text style={otpCode}>{otp}</Text>
			</Section>

			<Text style={{ ...muted, marginTop: "8px" }}>
				This code expires in <strong>5 minutes</strong>. You have 3 attempts
				before it is invalidated.
			</Text>

			<Text style={{ ...muted, marginTop: "16px" }}>
				If you didn&apos;t create an account with Anāqa, you can safely ignore
				this email.
			</Text>
		</EmailLayout>
	);
};

const otpContainer: CSSProperties = {
	backgroundColor: colors.sand,
	border: `1px solid ${colors.border}`,
	borderRadius: "6px",
	padding: "24px",
	textAlign: "center",
	margin: "24px 0",
};

const otpCode: CSSProperties = {
	fontFamily: "'Courier New', Courier, monospace",
	fontSize: "36px",
	fontWeight: "700",
	letterSpacing: "12px",
	color: colors.foreground,
	margin: "0",
	lineHeight: "1",
};

const VerificationEmailComponent =
	VerificationEmail as typeof VerificationEmail & {
		PreviewProps?: VerificationEmailProps;
	};

VerificationEmailComponent.PreviewProps = {
	name: "Sarah",
	otp: "482916",
};

export default VerificationEmailComponent;
