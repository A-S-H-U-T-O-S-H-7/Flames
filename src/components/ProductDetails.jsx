import Photos from "./product/Photos";
import Details from "./product/Details";

export default function ProductDetails({ product }) {
  return (
    <section className="flex flex-col  md:flex-row gap-3">
      <Photos imageList={[product?.featureImageURL, ...(product?.imageList ?? [])]} />
      <Details product={product} />
    </section>
  );
}
