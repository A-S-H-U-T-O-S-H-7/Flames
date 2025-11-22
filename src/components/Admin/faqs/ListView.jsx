"use client";

import { useFaqs } from "@/lib/firestore/faqs/read";
import { deleteFaq } from "@/lib/firestore/faqs/write";
import { Button, CircularProgress, Select, SelectItem } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: faqs, error, isLoading } = useFaqs();
  const [selectedType, setSelectedType] = useState("all");

  const faqTypes = [
    { key: "all", label: "All FAQs" },
    { key: "seller", label: "Seller FAQs" },
    { key: "user", label: "User FAQs" }
  ];

  // Filter FAQs based on selected type
  const filteredFaqs = faqs?.filter(faq => {
    if (selectedType === "all") return true;
    return faq.faqType === selectedType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <CircularProgress size="lg" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 p-5 bg-white dark:bg-[#1e2737] rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">FAQs</h1>
        
        {/* Filter Dropdown */}
        <div className="w-full md:w-64">
          <Select
            label="Filter by Type"
            selectedKeys={[selectedType]}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full"
          >
            {faqTypes.map((type) => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#22c7d5] text-white">
              <th className="px-4 py-3 text-left">SN</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Faq</th>
              <th className="px-4 py-3 text-left">Answer</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaqs?.map((item, index) => (
              <Row index={index} item={item} key={item?.id} />
            ))}
          </tbody>
        </table>
        {filteredFaqs?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No FAQs found for the selected type.
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
  if (!confirm("Are you sure?")) return;

  setIsDeleting(true);
  try {
    await deleteFaq(item?.id);
    toast.success("Faq deleted successfully!");
  } catch (error) {
    toast.error(error.message || "Error deleting faq.");
  }
  setIsDeleting(false);
};

  const handleUpdate = () => {
    router.push(`/admin/faqs?id=${item?.id}`);
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      seller: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", label: "Seller" },
      user: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "User" }
    };
    
    const config = typeConfig[type] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200", label: type };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{index + 1}</td>
      <td className="px-4 py-3">
        {getTypeBadge(item?.faqType)}
      </td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{item?.faq}</td>
      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 max-w-md truncate">
        {item?.answer}
      </td>
      <td className="px-4 py-3 flex justify-center gap-3">
        <Button
          onClick={handleUpdate}
          isDisabled={isDeleting}
          isIconOnly
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition-all"
        >
          <Edit2 size={18} />
        </Button>
        <Button
          onClick={handleDelete}
          isLoading={isDeleting}
          isDisabled={isDeleting}
          isIconOnly
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-all"
        >
          <Trash2 size={18} />
        </Button>
      </td>
    </tr>
  );
}