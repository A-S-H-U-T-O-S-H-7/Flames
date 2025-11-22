// src/app/layout.js
import { Libre_Baskerville, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "@/context/AuthContext";
import PermissionContextProvider from "@/context/PermissionContext";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Flames",
  description: "Ignite Your Style, Illuminate Your Beauty",
  icons: {
    icon: '/flame1.png',
    apple: '/apple-touch-icon.png',
    shortcut: '/flame1.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <Toaster/>
        <AuthContextProvider>
          <PermissionContextProvider> 
            {children}
          </PermissionContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}