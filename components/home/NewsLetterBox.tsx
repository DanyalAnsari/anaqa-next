"use client";

import React, { FormEvent, useState } from "react";
import { Mail, Gift, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import { NEWSLETTER_ITEMS } from "@/lib/constants";
import { SectionHeader } from "../ui/section-header";

const NewsLetterBox = () => {
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!email.trim()) return;

		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubscribed(false);
			setIsLoading(false);
			setEmail("");
			toast.error("Sorry! This service is currently unavailable.");
		}, 1000);
	};

	if (isSubscribed) {
		return (
			<section className="container text-center py-16 md:py-20">
				<div className="bg-success/10 border border-success/20 rounded-2xl p-8 md:p-12">
					<div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
						<Check className="w-8 h-8 text-success" />
					</div>
					<h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
						Thank You for Subscribing!
					</h2>
					<p className="text-neutral leading-relaxed max-w-2xl mx-auto mb-6">
						You&apos;ve successfully joined our newsletter. Check your email for
						a welcome message and your 20% discount code.
					</p>
					<button
						onClick={() => setIsSubscribed(false)}
						className="btn btn-outline btn-success"
					>
						Subscribe Another Email
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className="container py-16 md:py-20">
			<div className="gradient-bg-dark rounded-2xl p-8 md:p-12 text-center">
				{/* Header */}
				<div className="flex items-center justify-center gap-3 mb-6">
					<div className="w-12 h-1 bg-accent rounded-full"></div>
					<span className="text-primary font-medium text-sm tracking-wider uppercase">
						Special Offer
					</span>
					<div className="w-12 h-1 bg-accent rounded-full"></div>
				</div>

				{/* Discount Badge */}
				<div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
					<Gift className="w-4 h-4" />
					20% OFF Your First Order
				</div>

				{/* Main Content */}
				<h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
					Subscribe & Save Big!
				</h2>
				<p className="text-accent text-lg leading-relaxed max-w-2xl mx-auto mb-8">
					Join our exclusive newsletter and be the first to know about new
					arrivals, special promotions, and get instant access to your welcome
					discount.
				</p>

				{/* Newsletter Form */}
				<form onSubmit={onSubmitHandler} className="max-w-md mx-auto">
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="flex-1 relative">
							<Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral/50" />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email address"
								className="input input-bordered w-full pl-12 pr-4 py-3 bg-base-100 border-base-300/50 focus:border-primary focus:outline-none transition-colors"
								required
							/>
						</div>
						<button
							type="submit"
							disabled={isLoading}
							className="btn btn-primary group px-6 shadow-lg hover:shadow-xl transition-all duration-300"
						>
							{isLoading ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : (
								<>
									Subscribe
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</>
							)}
						</button>
					</div>
				</form>

				{/* Trust Indicators */}
				<div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-primary">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-success rounded-full"></div>
						<span>No spam, ever</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-success rounded-full"></div>
						<span>Unsubscribe anytime</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-success rounded-full"></div>
						<span>Exclusive offers</span>
					</div>
				</div>

				{/* Features Grid */}
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					{NEWSLETTER_ITEMS.map(({ icon, label, text }) => (
						<div key={label} className="text-center">
							<div className="text-2xl mb-3">{icon}</div>
							<h3 className="font-semibold text-primary mb-2">{label}</h3>
							<p className="text-sm text-accent">{text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default NewsLetterBox;
