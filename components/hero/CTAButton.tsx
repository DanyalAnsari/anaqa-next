"use client";
import React from "react";
import Button from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CTAButton = () => {
	const router = useRouter();
	return (
		<div className="hero-cta-flex">
			<Button variant={"primary"} onClick={() => router.push("/products")}>
				Shop Collection
				<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
			</Button>
			<Button variant={"secondary"}>View Lookbook</Button>
		</div>
	);
};

export default CTAButton;
