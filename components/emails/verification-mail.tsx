import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Button,
	Hr,
	Tailwind,
} from "@react-email/components";

interface VerificationEmailProps {
	firstName: string;
	verificationUrl: string;
}

const VerificationEmail = (props: VerificationEmailProps) => {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Body className="bg-gray-100 font-sans py-[40px]">
					<Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
						{/* Header */}
						<Section className="text-center mb-[32px]">
							<Text className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
								Verify Your Email Address
							</Text>
							<Text className="text-[16px] text-gray-600 m-0">
								Welcome! Please confirm your email to get started.
							</Text>
						</Section>

						{/* Main Content */}
						<Section className="mb-[32px]">
							<Text className="text-[16px] text-gray-700 mb-[16px] m-0">
								Hi {props.firstName},
							</Text>
							<Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
								Thank you for signing up! To complete your registration and
								secure your account, please verify your email address by
								clicking the button below.
							</Text>

							{/* Verification Button */}
							<Section className="text-center mb-[24px]">
								<Button
									href={props.verificationUrl}
									className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border inline-block"
								>
									Verify Email Address
								</Button>
							</Section>

							<Text className="text-[14px] text-gray-600 mb-[16px] m-0 leading-[20px]">
								If the button doesn't work, you can copy and paste this link
								into your browser:
							</Text>
							<Text className="text-[14px] text-blue-600 mb-[24px] m-0 break-all">
								{props.verificationUrl}
							</Text>

							<Text className="text-[14px] text-gray-600 m-0 leading-[20px]">
								This verification link will expire in 24 hours for security
								reasons. If you didn't create an account with us, you can safely
								ignore this email.
							</Text>
						</Section>

						<Hr className="border-gray-200 my-[32px]" />

						{/* Footer */}
						<Section className="text-center">
							<Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
								Need help? Contact our support team at support@company.com
							</Text>
							<Text className="text-[12px] text-gray-500 m-0 mb-[16px]">
								© {new Date().getFullYear()} Your Company Name. All rights
								reserved.
							</Text>
							<Text className="text-[12px] text-gray-500 m-0">
								123 Business Street, Suite 100, City, State 12345
							</Text>
							<Text className="text-[12px] text-gray-500 m-0 mt-[8px]">
								<a href="#" className="text-gray-500 underline">
									Unsubscribe
								</a>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

VerificationEmail.PreviewProps = {
	firstName: "John",
	verificationUrl: "https://yourapp.com/verify?token=abc123xyz789",
};

export default VerificationEmail;
