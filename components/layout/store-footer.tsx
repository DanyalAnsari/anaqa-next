import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
	shop: [
		{ name: "All Products", href: "/shop" },
		{ name: "Collections", href: "/collections" },
		{ name: "New Arrivals", href: "/shop?sort=newest" },
		{ name: "Sale", href: "/shop?sale=true" },
	],
	help: [
		{ name: "Contact Us", href: "/contact" },
		{ name: "Shipping Info", href: "/shipping" },
		{ name: "Returns & Exchanges", href: "/returns" },
		{ name: "FAQ", href: "/faq" },
	],
	account: [
		{ name: "Sign In", href: "/auth/sign-in" },
		{ name: "Create Account", href: "/auth/sign-up" },
		{ name: "Order History", href: "/account/orders" },
		{ name: "Wishlist", href: "/account/wishlist" },
	],
};

export function StoreFooter() {
	return (
		<footer className="border-t border-border/40 bg-secondary/30">
			<div className="container-wide py-12 md:py-16">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
					{/* Brand */}
					<div className="md:col-span-1">
						<Link href="/" className="inline-block">
							<span className="text-xl font-medium tracking-tight">Anāqa</span>
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Premium modest fashion for the modern woman. Elegance in every
							stitch, grace in every design.
						</p>
						<div className="mt-6 flex space-x-4">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Instagram"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Twitter"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
						</div>
					</div>

					{/* Shop */}
					<div>
						<h4 className="text-sm font-medium mb-4">Shop</h4>
						<ul className="space-y-3">
							{footerLinks.shop.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Help */}
					<div>
						<h4 className="text-sm font-medium mb-4">Help</h4>
						<ul className="space-y-3">
							{footerLinks.help.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Account */}
					<div>
						<h4 className="text-sm font-medium mb-4">Account</h4>
						<ul className="space-y-3">
							{footerLinks.account.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<Separator className="my-8" />

				<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Anāqa. All rights reserved.
					</p>
					<div className="flex items-center space-x-6 text-sm text-muted-foreground">
						<Link
							href="/privacy"
							className="hover:text-foreground transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-foreground transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
