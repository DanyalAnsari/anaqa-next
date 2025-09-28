import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="sm:px-[5vw] md:px-[7vw] lg:px-[9vw] px-4">
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
