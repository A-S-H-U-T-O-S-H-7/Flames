import { getProduct } from "@/lib/firestore/products/read_server";
import ProductDetails from "@/components/ProductDetails";
import AuthContextProvider from "@/context/AuthContext";
import AddReview from "@/components/product/AddReview";
import Reviews from "@/components/product/Review";
import RelatedProducts from "@/components/product/RelatedProducts";

export async function generateMetadata({ params }) {
  const product = await getProduct({ id: params.productId });

  return {
    title: `${product?.title} | Product`,
    description: product?.shortDescription ?? "",
    openGraph: {
      images: [product?.featureImageURL],
    },
  };
}

export default async function Page({ params }) {
  const product = await getProduct({ id: params.productId });

  if (!product) return <div>Product not found</div>;

  return (
    <main className="p-[10px] bg-gray-50 md:p-[30px]">
      <ProductDetails product={product} />
      
        <div className="flex flex-col justify-center pt-10">
          <div className="flex flex-col md:flex-row gap-4  w-full">
          <AuthContextProvider>
            <AddReview productId={params.productId} />
            <Reviews productId={params.productId} />
            </AuthContextProvider>
            </div>
            <div>
            <RelatedProducts categoryId={product?.categoryId} />
            </div>
        </div>
      
    </main>
  );
}
