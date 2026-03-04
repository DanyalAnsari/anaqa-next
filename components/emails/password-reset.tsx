import { Text, Button, Section, Link } from "@react-email/components";
import { EmailLayout } from "./layout";
import {
	heading,
	paragraph,
	muted,
	destructiveButton,
	linkStyle,
	alertBox,
	alertText,
} from "./theme";

interface PasswordResetEmailProps {
	firstName?: string;
	resetUrl: string;
}

const PasswordResetEmail = ({
	firstName = "there",
	resetUrl,
}: PasswordResetEmailProps) => {
	return (
		<EmailLayout preview="Reset your Anāqa account password">
			<Text style={heading()}>Reset Your Password</Text>

			<Text style={paragraph}>Hi {firstName},</Text>

			<Text style={paragraph}>
				We received a request to reset the password for your Anāqa account.
				Click the button below to choose a new password.
			</Text>

			<Section style={{ textAlign: "center", margin: "32px 0" }}>
				<Button href={resetUrl} style={destructiveButton}>
					Reset Password
				</Button>
			</Section>

			<Text style={muted}>
				If the button doesn&apos;t work, copy and paste this link into your
				browser:
			</Text>

			<Link href={resetUrl} style={linkStyle}>
				{resetUrl}
			</Link>

			<Text style={{ ...muted, marginTop: "24px" }}>
				This link will expire in <strong>1 hour</strong>.
			</Text>

			{/* Warning Alert */}
			<Section style={alertBox("warning")}>
				<Text style={alertText("warning")}>
					<strong>⚠️ Didn&apos;t request this?</strong>
					<br />
					If you did not request a password reset, please ignore this email.
					Your password will remain unchanged.
				</Text>
			</Section>
		</EmailLayout>
	);
};

PasswordResetEmail.PreviewProps = {
	firstName: "Sarah",
	resetUrl: "https://anaqa.com/reset-password?token=xyz789abc123",
} as PasswordResetEmailProps;

export default PasswordResetEmail;
