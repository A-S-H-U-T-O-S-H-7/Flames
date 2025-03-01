import { getProduct } from "@/lib/firestore/products/read_server";
import ProductDetails from "@/components/ProductDetails";
import AuthContextProvider from "@/context/AuthContext";
import AddReview from "@/components/product/AddReview";
import Reviews from "@/components/product/Review";
import RelatedProducts from "@/components/product/RelatedProducts";



export default async function Page({ params }) {
  
  const { productId } = await params;
  console.log("Product ID being requested:", productId);

  const product = await getProduct({ id: productId });
  console.log("Product returned:", product);

  if(!product) return (
    <div>
      <p>Product not found!!</p>
      <p>ID attempted: {productId}</p>
    </div>
    
    
  );

  return (
    <main className="p-[10px] bg-gray-50 md:p-[30px]">
      <ProductDetails product={product} />
      <div className="flex flex-col justify-center pt-10">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <AuthContextProvider>
            <AddReview productId={productId} />
            <Reviews productId={productId} />
          </AuthContextProvider>
        </div>
        <div>
          <RelatedProducts categoryId={product?.categoryId} />
        </div>
      </div>
    </main>
  );
}

