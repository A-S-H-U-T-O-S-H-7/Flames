"use client";

import React from "react";
import CollectionSection from "../collection/CollectionSection";
import { useShowcasedCollections } from "@/lib/firestore/collections/read";

export default function ShowcasedCollectionsClientWrapper() {
  const { data: showcasedCollections, isLoading, error } = useShowcasedCollections();

  if (isLoading) return <div>Loading showcased collections...</div>;
  if (error) return <div>Error loading showcased collections: {error}</div>;

  return <CollectionSection showcasedCollections={showcasedCollections || []} />;
}
