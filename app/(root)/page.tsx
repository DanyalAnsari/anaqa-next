import React from "react";
import Hero from "@/components/home/Hero";
import GridContainer from "@/components/ui/container/grid-container";
import { IconBaseContainer } from "@/components/ui/container/icon-container";
import { H4 } from "@/components/ui/headings";
import Text from "@/components/ui/text";
import { HERO_SECONDARY_FEATURES_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import NewsLetterBox from "@/components/home/NewsLetterBox";
import Policies from "@/components/home/Policies";

export default function Home() {
	return (
		<>
			<div className="bg-gradient-hero">
				<Hero />
			</div>
			<div className="bg-gradient-section container py-16">
				<GridContainer layout="feature-grid">
					{HERO_SECONDARY_FEATURES_ITEMS.map((feature) => (
						<div key={feature.label} className="text-center group">
							<IconBaseContainer
								size="xl"
								className={cn("mb-6", feature.className)}
							>
								{React.createElement(feature.icon, {
									className: `w-9 h-9 text-${feature.color}`,
								})}
							</IconBaseContainer>
							<H4 className="mb-3">{feature.label}</H4>
							<Text className="leading-relaxed">{feature.text}</Text>
						</div>
					))}
				</GridContainer>
			</div>
			<Policies />
			<NewsLetterBox />
		</>
	);
}
