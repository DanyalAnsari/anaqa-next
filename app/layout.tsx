import type { Metadata } from "next";
import { Poppins, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-playfair",
});

const montserrat = Montserrat({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	title: "Anaqa",
	description: "An online clothing store app.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.className} ${playfair.variable} ${montserrat.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
