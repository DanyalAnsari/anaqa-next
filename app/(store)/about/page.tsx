import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
	return (
		<div className="fade-in">
			{/* Hero */}
			<section className="relative py-20 md:py-32">
				<div className="container-wide">
					<div className="max-w-3xl mx-auto text-center">
						<span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
							Our Story
						</span>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
							Elegance in Every Stitch
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							Anāqa was born from a simple belief: modest fashion should never
							compromise on style, quality, or elegance.
						</p>
					</div>
				</div>
			</section>

			{/* Mission */}
			<section className="py-16 md:py-24 bg-secondary/30">
				<div className="container-wide">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<img
								src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80"
								alt="Anāqa workshop"
								className="rounded-lg w-full aspect-4/3 object-cover"
							/>
						</div>
						<div className="lg:pl-8">
							<span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
								Our Mission
							</span>
							<h2 className="text-3xl md:text-4xl font-medium mb-6">
								Redefining Modest Fashion
							</h2>
							<p className="text-muted-foreground mb-4 leading-relaxed">
								At Anāqa, we believe that every woman deserves to feel confident
								and beautiful in what she wears. Our collections are designed
								for the modern woman who values both tradition and contemporary
								style.
							</p>
							<p className="text-muted-foreground mb-6 leading-relaxed">
								Each piece in our collection is thoughtfully designed, using
								premium materials and ethical manufacturing practices. We work
								with skilled artisans who share our commitment to quality and
								attention to detail.
							</p>
							<Button asChild>
								<Link href="/collections">
									Explore Collections
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="editorial-spacing">
				<div className="container-wide">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-medium mb-4">
							Our Values
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							These principles guide everything we do, from design to delivery.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: "Quality First",
								description:
									"We never compromise on materials or craftsmanship. Every piece is made to last and be cherished for years.",
							},
							{
								title: "Ethical Production",
								description:
									"We partner with manufacturers who share our values of fair wages, safe working conditions, and environmental responsibility.",
							},
							{
								title: "Inclusive Design",
								description:
									"Our collections are designed for women of all shapes and sizes, because elegance has no boundaries.",
							},
						].map((value) => (
							<div key={value.title} className="text-center p-6">
								<h3 className="text-xl font-medium mb-3">{value.title}</h3>
								<p className="text-muted-foreground">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-16 md:py-24 bg-secondary/30">
				<div className="container-narrow text-center">
					<h2 className="text-3xl md:text-4xl font-medium mb-4">
						Join the Anāqa Community
					</h2>
					<p className="text-muted-foreground mb-8 max-w-lg mx-auto">
						Discover the collection and become part of a community that
						celebrates elegance, modesty, and modern style.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button size="lg" asChild>
							<Link href="/shop">Shop Now</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/contact">Get in Touch</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
