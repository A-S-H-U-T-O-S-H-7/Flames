import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategories } from '@/lib/firestore/categories/read_server'
import { getCollections } from '@/lib/firestore/collections/read_server'


export default async function Main({ children }) {
const categories = await getCategories()
const collections = await getCollections()

  return (
    <div>
      <Navbar categories={categories} collections={collections}/>
      {children}
      <Footer categories={categories}/>
      
    </div>
  );
}