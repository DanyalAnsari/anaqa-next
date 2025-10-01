declare global {
	interface BaseComponentProps {
		className?: string;
		children?: React.ReactNode;
	}

	interface LinkItemType {
		label: string;
		href: string;
	}

	interface InfoWithIconItems {
		label: string;
		icon: ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
		>;
	}

	type LucideIconType = ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;

	interface HeroFeaturesItemsProp extends InfoWithIconItems {
		type: "info" | "success" | "secondary";
	}

	interface FeaturesItemsProp extends InfoWithIconItems {
		color?:
			| "info"
			| "success"
			| "secondary"
			| "neutral"
			| "primary"
			| "accent"
			| "warning"
			| "error";
		className?: string;
		text: string;
		badge?: string;
	}

	type SectionInfoTypes = {
		label: string;
		heading: string;
		text: string;
	};

	interface SectionHeadersType {
		policy: SectionInfoTypes;
	}
}

export {};
