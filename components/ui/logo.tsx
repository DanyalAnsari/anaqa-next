import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = ({ className }: BaseComponentProps) => (
	<Link href={"/"} className={cn("logo", className)}>
		Anaqa
	</Link>
);

export default Logo;
