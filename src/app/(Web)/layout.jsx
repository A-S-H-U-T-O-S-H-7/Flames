"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Main({ children }) {
  return (
    <div>
      <Navbar/>
      {children}
      <Footer/>
      
    </div>
  );
}
