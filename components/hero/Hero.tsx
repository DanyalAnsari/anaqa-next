import Image from "next/image";
import React from "react";
import { FloatingBadge, StatusBadge } from "../ui/badge";
import { FlexContainer } from "../ui/container/flex-container";
import { Star } from "lucide-react";
import Text from "../ui/text";
import { H1 } from "../ui/headings";
import { HERO_FEATURES_ITEMS } from "@/lib/constants";
import CTAButton from "./CTAButton";

const Hero = () => {
	return (
		<div className="hero container min-h-[75vh] p-0">
			<div className="hero-content flex-col lg:flex-row-reverse lg:p-8 gap-8 lg:gap-16">
				{/* Hero Image */}
				<div className="flex-1 relative">
					<div className="hero-image-container">
						<Image
							src={"/hero_img.png"}
							alt="Latest Fashion Collection"
							height={420}
							width={520}
							className="image-hover h-[420px] lg:h-[520px]"
						/>
						{/* Floating Badge */}
						<FloatingBadge
							variant="primary"
							position="top-left"
							className="top-6 left-6"
						>
							New Collection
						</FloatingBadge>
						{/* Sale Badge */}
						<FloatingBadge className="top-6 right-6 font-bold">
							Up to 50% OFF
						</FloatingBadge>
						{/* Decorative overlay */}
						<div className="image-overlay gradient-overlay-main pointer-events-none" />
					</div>
				</div>

				{/* Hero Content */}
				<div className="flex-1 text-center lg:text-left">
					<div className="hero-content-flex  mb-8">
						<FlexContainer justify="start" className="gap-1">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className="w-4 h-4 fill-warning text-warning" />
							))}
						</FlexContainer>
						<Text className="font-medium" variant="small">
							Trusted by 50k+ customers
						</Text>
					</div>
					{/* Heading */}
					<div className="mb-8">
						<div className="hero-content-flex mb-6">
							<div className="divider-end h-1 w-16 rounded-full bg-secondary" />
							<StatusBadge size="xs" type="secondary">
								Spring 2025
							</StatusBadge>
						</div>

						<H1 className="mb-6">
							<span className="block">Latest</span>
							<span className="text-secondary">Arrivals</span>
						</H1>

						<Text className="max-w-lg mx-auto lg:mx-0 mb-8" variant="large">
							Discover our curated collection of premium clothing that combines
							Nordic-inspired design with modern sophistication and sustainable
							craftsmanship.
						</Text>
					</div>
					<CTAButton />
					<FlexContainer
						wrap={"wrap"}
						className="lg:justify-start gap-8 text-sm"
					>
						{HERO_FEATURES_ITEMS.map(({ label, type, icon }) => (
							<FlexContainer key={label} className="gap-2 text-neutral">
								<FeatureIcon icon={icon} bgColor={type} />
								<span className="font-medium">{label}</span>
							</FlexContainer>
						))}
					</FlexContainer>
				</div>
			</div>
		</div>
	);
};

interface FeatureIconProps extends BaseComponentProps {
	icon: LucideIconType;
	bgColor?: "info" | "success" | "secondary";
}

const FeatureIcon = ({ icon, bgColor = "info" }: FeatureIconProps) => {
	const bgClasses = {
		info: "bg-info/10",
		success: "bg-success/10",
		secondary: "bg-secondary/10",
	};

	const iconClasses = {
		info: "text-info",
		success: "text-success",
		secondary: "text-secondary",
	};

	return (
		<div
			className={`w-8 h-8 ${bgClasses[bgColor]} rounded-full flex items-center justify-center`}
		>
			{React.createElement(icon, {
				className: `w-4 h-4 ${iconClasses[bgColor]}`,
			})}
		</div>
	);
};

export default Hero;
