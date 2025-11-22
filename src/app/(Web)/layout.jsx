import Navbar from "@/components/web/home/Navbar";
import Footer from "@/components/web/home/Footer";
import { getCategories } from '@/lib/firestore/categories/read_server'
import { getCollections } from '@/lib/firestore/collections/read_server'


export default async function Main({ children }) {
  try {
    const categories = await getCategories()
    const collections = await getCollections()

    return (
      <div>
        <Navbar categories={categories || []} collections={collections || []}/>
        {children}
        <Footer categories={categories || []}/>
      </div>
    );
  } catch (error) {
    console.error('Error loading layout data:', error);
    return (
      <div>
        <Navbar categories={[]} collections={[]}/>
        {children}
        <Footer categories={[]}/>
      </div>
    );
  }
}