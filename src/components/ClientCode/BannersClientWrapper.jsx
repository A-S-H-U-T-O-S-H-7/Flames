"use client";

import React from "react";
import HeroBanner from "@/components/HeroBanner";
import { useBanners } from "@/lib/firestore/banners/read";

export default function BannersClientWrapper() {
  const { data: banners, isLoading, error } = useBanners();

  if (isLoading) return <div>Loading banners...</div>;
  if (error) return <div>Error loading banners: {error}</div>;
  
  return <HeroBanner banners={banners} />;
}
