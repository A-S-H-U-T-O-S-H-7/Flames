// page.jsx
import ProductCard from "@/components/ProductCard";
import { algoliasearch } from "algoliasearch";
import { SearchIcon, ShoppingBag, Layers } from "lucide-react";
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
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full flex justify-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <div className="mb-6 sm:mb-8 md:mb-10 px-2">
            {q ? (
              <h1 className="font-heading text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-center">
                {products?.length ? 
                  `Results for "${q}"` : 
                  `No results found`
                }
              </h1>
            ) : (
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-center">
                Browse Our Collection
              </h1>
            )}
            
            {q && (
              <p className="text-gray-500 text-center text-sm sm:text-base md:text-lg mb-2 sm:mb-3">
                {products?.length 
                  ? `Found ${products.length} products matching your search` 
                  : `We couldn't find anything matching "${q}"`
                }
              </p>
            )}
            
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-blue-600 mx-auto rounded-full mb-4 sm:mb-6" />
          </div>
          
          {products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-2 sm:px-3 md:px-4">
              {products.map((item) => (
                <div key={item?.id} className="h-full group">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 mx-2 sm:mx-4 bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-gray-100">
              <div className="bg-blue-50 p-4 sm:p-6 md:p-8 rounded-full mb-4 sm:mb-6 shadow-inner border border-blue-100">
                <SearchIcon size={32} className="text-blue-500 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-13 lg:w-13" />
              </div>
              
              <h2 className="font-heading text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center text-gray-800">
                No products found
              </h2>
              
              <p className="text-gray-600 text-center text-sm sm:text-base md:text-lg max-w-md mb-6 sm:mb-8">
                We couldn't find any products matching your search. Please try different keywords or browse our categories.
              </p>
              
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full max-w-md px-4">
                <Link 
                  href="/" 
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full"
                >
                  <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Browse Products
                </Link>
                
                <Link 
                  href="/category/fgHyNnMlCjJzpJ8448du" 
                  className="px-4 sm:px-5 md:px-6 py-2 sm:py-3 bg-white border border-gray-300 text-gray-700 text-sm sm:text-base font-medium rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center w-full"
                >
                  <Layers className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  View Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}