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
}

export {};
