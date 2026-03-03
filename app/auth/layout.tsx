import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex">
			{/* Left side - Branding */}
			<div className="hidden lg:flex lg:w-1/2 bg-secondary/50 relative">
				<div
					className="absolute inset-0 bg-cover bg-center opacity-20"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920&q=80')",
					}}
				/>
				<div className="relative z-10 flex flex-col justify-between p-12 w-full">
					<Link href="/" className="text-2xl font-medium tracking-tight">
						Anāqa
					</Link>
					<div className="max-w-md">
						<blockquote className="text-lg italic text-muted-foreground">
							"Elegance is not about being noticed, it's about being
							remembered."
						</blockquote>
						<p className="mt-4 text-sm text-muted-foreground">
							— Giorgio Armani
						</p>
					</div>
					<p className="text-sm text-muted-foreground">
						Premium modest fashion for the modern woman.
					</p>
				</div>
			</div>

			{/* Right side - Auth form */}
			<div className="flex-1 flex flex-col">
				<div className="flex items-center justify-between p-4 lg:p-6">
					<Link
						href="/"
						className="lg:hidden text-xl font-medium tracking-tight"
					>
						Anāqa
					</Link>
					<div className="ml-auto">
						<ThemeToggle />
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 flex items-center justify-center p-4 sm:p-8">
					<div className="w-full max-w-md">{children}</div>
				</div>

				{/* Footer */}
				<div className="p-4 lg:p-6 text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Anāqa. All rights reserved.</p>
				</div>
			</div>
		</div>
	);
}
