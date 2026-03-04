import { Text, Button, Section, Link } from "@react-email/components";
import { EmailLayout } from "./layout";
import {
	heading,
	paragraph,
	muted,
	primaryButton,
	linkStyle,
	colors,
} from "./theme";

interface VerificationEmailProps {
	firstName?: string;
	verificationUrl: string;
}

const VerificationEmail = ({
	firstName = "there",
	verificationUrl,
}: VerificationEmailProps) => {
	return (
		<EmailLayout preview="Verify your email address to get started with Anāqa">
			<Text style={heading()}>Verify Your Email</Text>

			<Text style={paragraph}>Hi {firstName},</Text>

			<Text style={paragraph}>
				Thank you for creating an account with Anāqa. Please verify your email
				address to complete your registration.
			</Text>

			<Section style={{ textAlign: "center", margin: "32px 0" }}>
				<Button href={verificationUrl} style={primaryButton}>
					Verify Email Address
				</Button>
			</Section>

			<Text style={muted}>
				If the button doesn&apos;t work, copy and paste this link into your
				browser:
			</Text>

			<Link href={verificationUrl} style={linkStyle}>
				{verificationUrl}
			</Link>

			<Text style={{ ...muted, marginTop: "24px" }}>
				This link will expire in <strong>24 hours</strong>. If you didn&apos;t
				create an account, you can safely ignore this email.
			</Text>
		</EmailLayout>
	);
};

VerificationEmail.PreviewProps = {
	firstName: "Sarah",
	verificationUrl: "https://anaqa.com/auth/verify-email?token=abc123xyz789",
} as VerificationEmailProps;

export default VerificationEmail;
