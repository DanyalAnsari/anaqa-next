import Logo from "./ui/logo";
import GridContainer from "./ui/container/grid-container";
import {
	CONTACT_INFO_ITEMS,
	FOOTER_SOCIAL_ICONS,
	QUICK_LINKS_NAV,
	QUICK_LINKS_POLICIES,
} from "@/lib/constants";
import { FlexContainer } from "./ui/container/flex-container";
import Text from "./ui/text";
import { H5 } from "./ui/headings";
import Link from "next/link";
import { IconBaseContainer } from "./ui/container/icon-container";

const Footer = () => {
	return (
		<footer className="bg-base-200/50 border-t border-base-300/30">
			{/* Main Footer Content */}
			<div className="py-20 container">
				<GridContainer layout="responsive" className="md:gap-12">
					<CompanyInfo />
					{/* Navigation */}
					<QuickLinks heading={"Quick Links"} links={QUICK_LINKS_NAV} />
					{/* Policies */}
					<QuickLinks heading="Policies" links={QUICK_LINKS_POLICIES} />
				</GridContainer>

				{/* Social Media */}
				<SocialMediaIcons />
			</div>

			{/* Bottom Bar */}
			<BottomBar />
		</footer>
	);
};

const CompanyInfo = () => (
	<div className="lg:col-span-2">
		<div className="mb-6">
			<Logo />
		</div>
		<Text className="leading-relaxed mb-6 max-w-md">
			We are committed to providing you with the best possible online shopping
			experience. Our team is dedicated to ensuring that your shopping journey
			is hassle-free and enjoyable.
		</Text>

		{/* Contact Info */}
		<div className="space-y-3">
			{CONTACT_INFO_ITEMS.map((item, idx) => (
				<FlexContainer key={idx} justify="start" className="gap-3">
					<item.icon className="w-4 h-4 text-primary" />
					<Text
						variant="small"
						className="hover:text-primary transition-colors"
					>
						{item.label}
					</Text>
				</FlexContainer>
			))}
		</div>
	</div>
);

interface QuickLinksProps {
	links: LinkItemType[];
	heading: string;
}

const QuickLinks = ({ links, heading }: QuickLinksProps) => {
	return (
		<div>
			<H5 className="mb-6">{heading}</H5>
			<ul className="space-y-3">
				{links.map(({ label, href }) => (
					<li key={href}>
						<Link
							href={href}
							className="text-neutral hover:text-primary text-sm hover:translate-x-1 inline-block transition-all duration-300"
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

const SocialMediaIcons = () => {
	return (
		<div className="mt-12 pt-8 border-t border-base-300/30">
			<FlexContainer
				justify="between"
				direction="column"
				className="md:flex-row gap-6"
			>
				<div className="flex items-center gap-4">
					<Text variant="label">Follow Us:</Text>
					<div className="flex gap-3">
						{FOOTER_SOCIAL_ICONS.map((item) => (
							<IconBaseContainer
								key={item.label}
								className="w-10 h-10 social-icon "
								title={item.label}
							>
								<item.icon className="w-5 h-5" />
							</IconBaseContainer>
						))}
					</div>
				</div>

				{/* Newsletter CTA */}
				<div className="text-center md:text-right">
					<Text variant="small" className="mb-2">
						Subscribe to get special offers & updates
					</Text>
					<Link href="/newsletter" className="btn btn-primary btn-sm">
						Subscribe Now
					</Link>
				</div>
			</FlexContainer>
		</div>
	);
};

const BottomBar = () => {
	return (
		<div className="bg-base-300/20 border-t border-base-300/30">
			<div className="container py-6">
				<FlexContainer
					direction="column"
					justify="between"
					className="md:flex-row gap-4"
				>
					<Text variant="small" className="text-center md:text-left">
						© {new Date().getFullYear()} ACME Industries Ltd. All rights
						reserved.
					</Text>
					<div className="flex items-center gap-6 text-xs text-neutral">
						<span>Designed with ❤️ in India</span>
						<span>•</span>
						<span>Powered by React</span>
					</div>
				</FlexContainer>
			</div>
		</div>
	);
};
export default Footer;
