"use client";

import { getFaq } from "@/lib/firestore/faqs/read_server";
import { createNewFaq, updateFaq } from "@/lib/firestore/faqs/write";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const faqTypes = [
    { key: "seller", label: "Seller" },
    { key: "user", label: "User" }
  ];

  const fetchData = async () => {
    try {
      const res = await getFaq({ id: id });
      if (!res) {
        toast.error("Faq Not Found!");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...(prevData ?? {}),
      [key]: value,
    }));
  };

 const handleCreate = async () => {
  setIsLoading(true);
  try {
    await createNewFaq(data);
    toast.success("Successfully Created");
    setData(null); 
  } catch (error) {
    toast.error(error?.message);
  }
  setIsLoading(false);
};

const handleUpdate = async () => {
  setIsLoading(true);
  try {
    await updateFaq(data);
    toast.success("Successfully Updated");
    setData(null);
    router.push(`/admin/faqs`);
  } catch (error) {
    toast.error(error?.message);
  }
  setIsLoading(false);
};

  return (
    <div className="flex border border-[#22c7d5] py-6 flex-col gap-6 bg-white dark:bg-[#0e1726] dark:text-[#888ea8] rounded-xl p-5 w-full md:w-[400px] transition-all duration-200 ease-in-out">
      <h1 className="font-semibold text-[#212529] dark:text-white">
        {id ? "Update" : "Create"} Faq
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleUpdate() : handleCreate();
        }}
        className="flex flex-col gap-4"
      >
        {/* FAQ Type Dropdown */}
        <div className="flex flex-col gap-2">
          <label htmlFor="faq-type" className="text-gray-500 dark:text-[#888ea8] text-sm">
            FAQ Type <span className="text-red-500">*</span>
          </label>
          <Select
            id="faq-type"
            name="faqType"
            placeholder="Select FAQ Type"
            selectedKeys={data?.faqType ? [data.faqType] : []}
            onChange={(e) => handleData("faqType", e.target.value)}
            className="w-full"
            classNames={{
              trigger: "border border-purple-500 dark:border-[#22c7d5] bg-white dark:bg-[#1e2737]",
              value: "text-black dark:text-white"
            }}
          >
            {faqTypes.map((type) => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Question Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="faq" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Faq <span className="text-red-500">*</span>
          </label>
          <input
            id="faq"
            name="faq"
            type="text"
            placeholder="Enter Faq"
            value={data?.faq ?? ""}
            onChange={(e) => handleData("faq", e.target.value)}
            className="border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Answer Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="answer" className="text-gray-500 dark:text-[#888ea8] text-sm">
            Answer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            placeholder="Enter Answer"
            value={data?.answer ?? ""}
            onChange={(e) => handleData("answer", e.target.value)}
            rows={4}
            className="border border-purple-500 dark:border-[#22c7d5] px-4 py-2 rounded-lg w-full focus:outline-none bg-white dark:bg-[#1e2737] text-black dark:text-white transition-all duration-200 ease-in-out resize-vertical"
          />
        </div>

        {/* Submit Button */}
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          type="submit"
          className="bg-[#22c7d5] text-white font-semibold py-2 mt-4 px-4 rounded-lg hover:bg-[#1aa5b5] "
        >
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}