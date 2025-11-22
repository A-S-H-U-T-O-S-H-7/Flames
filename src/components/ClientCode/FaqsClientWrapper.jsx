"use client";

import React from "react";
import FAQ from "../web/home/FAQ";
import { useFaqs } from "@/lib/firestore/faqs/read";

export default function FaqsClientWrapper() {
  const { data: faqs, isLoading, error } = useFaqs();

  if (isLoading) return <div>Loading FAQs...</div>;
  if (error) return <div>Error loading FAQs: {error}</div>;
  
  return <FAQ faqs={faqs} />;
}
