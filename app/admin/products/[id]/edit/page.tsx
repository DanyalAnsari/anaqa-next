import { notFound } from "next/navigation";
import { getProductById, getCategories } from "../../_lib/data";
import { ProductForm } from "../../_components/product-form";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
	const { id } = await params;
	const [product, categories] = await Promise.all([
		getProductById(id),
		getCategories(),
	]);
	if (!product) notFound();
	return <ProductForm product={product} categories={categories} />;
}
