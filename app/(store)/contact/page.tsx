import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "./_components/contact-form";

export default function ContactPage() {
	return (
		<div className="fade-in">
			{/* Hero */}
			<section className="py-12 md:py-20 bg-secondary/30">
				<div className="container-wide">
					<div className="max-w-2xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-medium mb-4">
							Contact Us
						</h1>
						<p className="text-lg text-muted-foreground">
							Have a question or need assistance? We're here to help.
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
								or just want to say hello, we'd love to hear from you.
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
										<p className="text-muted-foreground">+1 (555) 123-4567</p>
										<p className="text-sm text-muted-foreground">
											Mon-Fri, 9am-5pm EST
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
										<MapPin className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<h3 className="font-medium mb-1">Location</h3>
										<p className="text-muted-foreground">123 Fashion Avenue</p>
										<p className="text-muted-foreground">New York, NY 10001</p>
									</div>
								</div>
							</div>

							{/* Social Links */}
							<div className="mt-8 pt-8 border-t border-border">
								<h3 className="font-medium mb-4">Follow Us</h3>
								<div className="flex gap-4">
									{["Instagram", "Twitter", "Pinterest", "Facebook"].map(
										(social) => (
											<a
												key={social}
												href="#"
												className="text-muted-foreground hover:text-foreground transition-colors"
											>
												{social}
											</a>
										),
									)}
								</div>
							</div>
						</div>

						{/* Contact Form */}
						<ContactForm />
					</div>
				</div>
			</section>
		</div>
	);
}
