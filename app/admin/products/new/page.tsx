import { getCategories } from "../_lib/data";
import { ProductForm } from "../_components/product-form";

export default async function NewProductPage() {
	const categories = await getCategories();
	return <ProductForm categories={categories} />;
}
