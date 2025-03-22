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
      <div className="w-full flex justify-center px-3 md:px-8 py-8">
        <div className="w-full max-w-7xl px-4 md:px-8">
          <div className="mb-10">
            {q ? (
              <h1 className="font-heading text-gray-800 text-3xl md:text-4xl font-bold mb-3 text-center">
                {products?.length ? 
                  `Results for "${q}"` : 
                  `No results found`
                }
              </h1>
            ) : (
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3 text-center">
                Browse Our Collection
              </h1>
            )}
            
            {q && (
              <p className="text-gray-500 text-center text-lg mb-2">
                {products?.length 
                  ? `Found ${products.length} products matching your search` 
                  : `We couldn't find anything matching "${q}"`
                }
              </p>
            )}
            
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-6" />
          </div>
          
          {products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {products.map((item) => (
                <div key={item?.id} className="h-full group">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="bg-blue-50 p-8 rounded-full mb-6 shadow-inner border border-blue-100">
                <SearchIcon size={52} className="text-blue-500" />
              </div>
              
              <h2 className="font-heading text-2xl font-bold mb-3 text-center text-gray-800">
                No products found
              </h2>
              
              <p className="text-gray-600 text-center max-w-md mb-8 text-lg">
                We couldn't find any products matching your search. Please try different keywords or browse our categories.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/" 
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Products
                </Link>
                
                <Link 
                  href="/category/fgHyNnMlCjJzpJ8448du" 
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center w-full sm:w-auto"
                >
                  <Layers className="mr-2 h-5 w-5" />
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