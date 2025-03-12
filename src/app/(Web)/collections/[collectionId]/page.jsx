

import { getCollection } from "@/lib/firestore/collections/read_server";
import CollectionPage from "@/components/Collection/CollectionPage";



export default async function Page({ params }) {
  const { collectionId } = params;
  const collection = await getCollection({ id: collectionId });

  return (
    <main className="flex justify-center p-[10px] md:px-[30px] md:py-5 w-full bg-gray-50 min-h-screen">
      <CollectionPage
        initialProducts={collection.products} 
        collection={collection} 
      />
      
    </main>
  );
}