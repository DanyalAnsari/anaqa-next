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
}

export {};
