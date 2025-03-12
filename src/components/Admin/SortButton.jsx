"use client";

import { Button } from "@nextui-org/react";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function SortButton({ 
  sortOrder, 
  onToggle,
  ascendingLabel = "Oldest First",
  descendingLabel = "Newest First",
  className = ""
}) {
  return (
    <Button 
      onClick={onToggle}
      className={`bg-white dark:bg-[#283548] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}
      startContent={sortOrder === "desc" ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
    >
      {sortOrder === "desc" ? descendingLabel : ascendingLabel}
    </Button>
  );
}