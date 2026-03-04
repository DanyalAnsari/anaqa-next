import { Text, Section } from "@react-email/components";
import { EmailLayout } from "./layout";
import { heading, paragraph, alertBox, alertText } from "./theme";

interface PasswordChangedEmailProps {
	firstName?: string;
}

const PasswordChangedEmail = ({
	firstName = "there",
}: PasswordChangedEmailProps) => {
	return (
		<EmailLayout preview="Your Anāqa account password has been changed">
			<Text style={heading()}>Password Updated</Text>

			<Text style={paragraph}>Hi {firstName},</Text>

			<Text style={paragraph}>
				Your Anāqa account password has been successfully changed. You can now
				sign in with your new password.
			</Text>

			{/* Danger Alert */}
			<Section style={alertBox("danger")}>
				<Text style={alertText("danger")}>
					<strong>🚨 Didn&apos;t make this change?</strong>
					<br />
					If you did not change your password, your account may have been
					compromised. Please contact our support team immediately.
				</Text>
			</Section>
		</EmailLayout>
	);
};

PasswordChangedEmail.PreviewProps = {
	firstName: "Sarah",
} as PasswordChangedEmailProps;

export default PasswordChangedEmail;
