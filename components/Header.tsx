import { Menu } from "lucide-react";
import React from "react";
import NavbarMenu from "./ui/navbar-menu";
import Logo from "./ui/logo";

const Header = () => {
	return (
		<header className="w-full border-b border-base-200 sticky top-0 bg-base-100 z-100">
			<div className="navbar container bg-base-100 ">
				{/* Mobile devices Navigation */}
				<nav className="navbar-start md:hidden">
					<div className="dropdown dropdown-start">
						<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
							<Menu size={24} className="h-5 w-5" />
						</div>
						<NavbarMenu
							tabIndex={0}
							variant="mobile"
							className="nav-mobile dropdown-content"
						/>
					</div>
				</nav>
				{/* Logo */}
				<div className="navbar-start">
					<Logo />
				</div>
				{/* Navigation */}
				<nav className="navbar-center hidden lg:flex">
					<NavbarMenu className="menu-horizontal px-1" />
				</nav>
				{/* To be implemented */}
				{/* <div className="navbar-end gap-2">
					<div className="hidden sm:flex">
						<Search />
					</div>
					<Cart />
					<Profile />
				</div> */}
			</div>
			{/* Mobile Search Bar */}
			{/* <div className="sm:hidden px-4 py-2 border-t border-base-200">
				<Search />
			</div> */}
		</header>
	);
};

export default Header;
