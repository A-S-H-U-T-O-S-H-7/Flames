import { getCollection } from "@/lib/firestore/collections/read_server";
import CollectionPage from "@/components/Collection/CollectionPage";

function serializeFirestoreData(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data.map(serializeFirestoreData);
  if (typeof data === "object" && data !== null) {
    if (data.seconds !== undefined && data.nanoseconds !== undefined) {
      return new Date(data.seconds * 1000).toISOString();
    }
    return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, serializeFirestoreData(value)]));
  }
  return data;
}

export default async function Page({ params }) {
  // Await the params object before using it
  const { collectionId } = await params;
  const collection = await getCollection({ id: collectionId });

  return (
    <main className="flex justify-center p-[10px] md:px-[30px] md:py-5 w-full bg-gray-50 min-h-screen">
      <CollectionPage initialProducts={collection.products} collection={serializeFirestoreData(collection)} />
    </main>
  );
}