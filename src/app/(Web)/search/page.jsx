import ProductCard from "@/components/ProductCard";
import { algoliasearch } from "algoliasearch";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

const getProducts = async (text) => {
  if (!text) {
    return [];
  }
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  );
  const search = await client.searchForHits({
    requests: [
      {
        indexName: "products",
        query: text,
        hitsPerPage: 20,
      },
    ],
  });
  const hits = search.results[0]?.hits;
  return hits ?? [];
};

export default async function Page({ searchParams }) {
  const { q } = searchParams;
  const products = await getProducts(q);
  
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <div className="w-full flex justify-center px-3 md:px-8">
        <div className="w-full max-w-7xl px-2.5 md:px-8 py-6 md:py-10">
          {q ? (
            <h1 className="font-heading text-gray-700 text-2xl md:text-3xl font-bold mb-6 text-center">
              {products?.length ? `Products for "${q}"` : `No results for "${q}"`}
            </h1>
          ) : (
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6 text-center">
              All Products
            </h1>
          )}

          {products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((item) => (
                <ProductCard product={item} key={item?.id} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg shadow-sm">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <SearchIcon size={48} className="text-gray-400" />
              </div>
              <h2 className="font-heading text-xl font-semibold mb-2 text-center">
                No products found
              </h2>
              <p className="text-gray-500 text-center max-w-md mb-6">
                We couldn't find any products matching your search. Please try different keywords or browse our categories.
              </p>
              <Link href="/" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}