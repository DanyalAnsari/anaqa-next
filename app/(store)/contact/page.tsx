// app/(store)/contact/page.tsx
import { ContactForm } from "./_components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
	return (
		<div className="animate-in fade-in duration-500">
			{/* Hero */}
			<section className="py-12 md:py-20 bg-secondary/30">
				<div className="container-wide">
					<div className="max-w-2xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-medium mb-4">
							Contact Us
						</h1>
						<p className="text-lg text-muted-foreground">
							Have a question or need assistance? We&apos;re here to help.
						</p>
					</div>
				</div>
			</section>

			{/* Content */}
			<section className="editorial-spacing">
				<div className="container-wide">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
						{/* Contact Info */}
						<div>
							<h2 className="text-2xl font-medium mb-6">Get in Touch</h2>
							<p className="text-muted-foreground mb-8">
								Whether you have a question about an order, need styling advice,
								or just want to say hello, we&apos;d love to hear from you.
							</p>

							<div className="space-y-6">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
										<Mail className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<h3 className="font-medium mb-1">Email</h3>
										<p className="text-muted-foreground">hello@anaqa.com</p>
										<p className="text-sm text-muted-foreground">
											We respond within 24 hours
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
										<Phone className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<h3 className="font-medium mb-1">Phone</h3>
										<p className="text-muted-foreground">+966 50 123 4567</p>
										<p className="text-sm text-muted-foreground">
											Sun–Thu, 9am–5pm AST
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
										<MapPin className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<h3 className="font-medium mb-1">Location</h3>
										<p className="text-muted-foreground">King Fahd Road</p>
										<p className="text-muted-foreground">
											Riyadh, Saudi Arabia
										</p>
									</div>
								</div>
							</div>

							<div className="mt-8 pt-8 border-t border-border">
								<h3 className="font-medium mb-4">Follow Us</h3>
								<div className="flex gap-4">
									{["Instagram", "Twitter", "Pinterest"].map((social) => (
										<a
											key={social}
											href="#"
											className="text-muted-foreground hover:text-foreground transition-colors text-sm"
										>
											{social}
										</a>
									))}
								</div>
							</div>
						</div>

						{/* Form */}
						<ContactForm />
					</div>
				</div>
			</section>
		</div>
	);
}
