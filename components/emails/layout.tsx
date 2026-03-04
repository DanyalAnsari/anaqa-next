import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
	Hr,
	Link,
	Preview,
} from "@react-email/components";
import { colors, fonts } from "./theme";

interface EmailLayoutProps {
	preview?: string;
	children: React.ReactNode;
	unsubscribeUrl?: string;
}

export const EmailLayout = ({
	preview,
	children,
	unsubscribeUrl,
}: EmailLayoutProps) => {
	const currentYear = new Date().getFullYear();

	return (
		<Html lang="en" dir="ltr">
			<Head>
				<meta name="color-scheme" content="light" />
				<meta name="supported-color-schemes" content="light" />
			</Head>

			{preview && <Preview>{preview}</Preview>}

			<Body
				style={{
					backgroundColor: colors.background,
					fontFamily: fonts.body,
					margin: "0",
					padding: "40px 20px",
					WebkitTextSizeAdjust: "100%",
				}}
			>
				<Container
					style={{
						backgroundColor: colors.surface,
						maxWidth: "600px",
						margin: "0 auto",
						border: `1px solid ${colors.border}`,
					}}
				>
					{/* ── Brand Header ──────────────────────────────────── */}
					<Section style={{ padding: "40px 40px 0", textAlign: "center" }}>
						<Text
							style={{
								fontFamily: fonts.heading,
								fontSize: "22px",
								fontWeight: "400",
								letterSpacing: "0.25em",
								color: colors.foreground,
								margin: "0",
							}}
						>
							ANĀQA
						</Text>
					</Section>

					<Hr
						style={{
							borderColor: colors.border,
							borderTop: "none",
							margin: "24px 40px",
						}}
					/>

					{/* ── Content ───────────────────────────────────────── */}
					<Section style={{ padding: "0 40px 8px" }}>{children}</Section>

					<Hr
						style={{
							borderColor: colors.border,
							borderTop: "none",
							margin: "24px 40px",
						}}
					/>

					{/* ── Footer ────────────────────────────────────────── */}
					<Section
						style={{
							padding: "0 40px 40px",
							textAlign: "center",
						}}
					>
						<Text
							style={{
								fontSize: "12px",
								color: colors.mutedForeground,
								margin: "0 0 4px",
								lineHeight: "20px",
							}}
						>
							This is an automated message. Please do not reply directly.
						</Text>
						<Text
							style={{
								fontSize: "12px",
								color: colors.mutedForeground,
								margin: "0 0 12px",
								lineHeight: "20px",
							}}
						>
							© {currentYear} Anāqa. All rights reserved.
						</Text>

						{unsubscribeUrl && (
							<Link
								href={unsubscribeUrl}
								style={{
									fontSize: "12px",
									color: colors.mutedForeground,
									textDecoration: "underline",
								}}
							>
								Unsubscribe
							</Link>
						)}
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

export default EmailLayout;
