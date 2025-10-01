import React from "react";
import { SectionHeader } from "../ui/section-header";
import { POLICY_ITEMS, SECTION_INFO } from "@/lib/constants";
import GridContainer from "../ui/container/grid-container";
import { HoverIconContainer, IconBaseContainer } from "../ui/container/icon-container";
import { StatusBadge } from "../ui/badge";
import { H5 } from "../ui/headings";
import Text from "../ui/text";

const Policies = () => {
    	const { label, heading, text } = SECTION_INFO.policy;
	return (
		<section className="-mx-4 bg-gradient-section container py-16 md:py-20">
			{/* Section Header */}
			<SectionHeader label={label} heading={heading} description={text} />
			{/* Policies Grid */}
			<GridContainer layout="responsive" className="lg:grid-cols-3 md:gap-8">
				{POLICY_ITEMS.map(({ label, text, color, icon, badge }) => {
					const IconComponent = icon;
					return (
						<HoverIconContainer
							key={label}
							className="group p-6 md:p-8 policy-icons-container"
						>
							<div className="policy-icons-flex">
								<IconBaseContainer
									margin="none"
									hoverEffect="scale-110"
									className={`bg-${color}/10  border-none`}
								>
									<IconComponent className={`w-6 h-6 text-${color}`} />
								</IconBaseContainer>
								<StatusBadge type={color}>{badge}</StatusBadge>
							</div>

							{/* Content */}
							<div>
								<H5 className="transition-colors mb-3 group-hover:text-primary">
									{label}
								</H5>
								<Text variant="small" className="leading-relaxed">
									{text}
								</Text>
							</div>

							{/* Hover Effect Line */}
							<div
								className={`bg-${color} policy-icons-line group-hover:w-full`}
							></div>
						</HoverIconContainer>
					);
				})}
			</GridContainer>
		</section>
	);
};

export default Policies;
