import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";
import CategoryPage from "@/components/CategoryPage";

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const categoryId = resolvedParams.categoryId;
  
  const category = await getCategory({ id: categoryId });
  return {
    title: `${category?.name} | Category`,
    description: `Browse our selection of ${category?.name}`,
    openGraph: {
      images: [category?.imageURL],
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const categoryId = resolvedParams.categoryId;
  
  const category = await getCategory({ id: categoryId });
  const products = await getProductsByCategory({ categoryId });


  return (
    <main className="flex justify-center p-[10px] md:px-[30px] md:py-5 w-full bg-gray-50 min-h-screen">
      <CategoryPage 
        initialProducts={products} 
        category={category} 
      />
    </main>
  );
}