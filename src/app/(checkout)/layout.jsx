import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthContextProvider from "@/context/AuthContext";
import { getCategories } from '@/lib/firestore/categories/read_server';
import { getCollections } from '@/lib/firestore/collections/read_server';
import UserChecking from "@/components/UserChecking";

export default async function MainLayout({ children }) {
  const categories = await getCategories();
  const collections = await getCollections();

  return (
    <AuthContextProvider>
      <UserChecking>
        <Navbar categories={categories} collections={collections} />
        {children}
        <Footer />
      </UserChecking>
    </AuthContextProvider>
  );
}
