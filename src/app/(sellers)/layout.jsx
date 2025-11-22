

import SellerLayout from "@/components/seller/SellerLayout";
import AuthContextProvider from "@/context/AuthContext";
import PermissionContextProvider from "@/context/PermissionContext";
import MockDataProvider from "@/context/MockDataContext";

export default function SellersLayout({ children }) {
  return (
    <AuthContextProvider>
      <PermissionContextProvider>
        <MockDataProvider>
          <SellerLayout>
            {children}
          </SellerLayout>
        </MockDataProvider>
      </PermissionContextProvider>
    </AuthContextProvider>
  );
}
