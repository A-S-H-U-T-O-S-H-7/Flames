import { getProduct } from "@/lib/firestore/products/read_server";

export default async function Page({ params }) {
  const { productId } = await params;
  const product = await getProduct({ id: productId });
  
  if (!product) {
    return <p>Product not found for ID: {productId}</p>;
  }
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Product Name: {product.title}</h1>
    </div>
  );
}