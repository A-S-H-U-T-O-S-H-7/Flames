export default async function Page({ params }) {
  console.log("Params received:", params); // Debug params
  const { productId } = params;

  console.log("Fetching product for ID:", productId); // Debug productId
  const product = await getProduct({ id: productId });

  console.log("Product data:", product); // Debug product response

  if (!product) return <div>Product not found</div>;

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
