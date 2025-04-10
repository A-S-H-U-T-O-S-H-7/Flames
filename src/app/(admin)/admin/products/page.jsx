import ListView from "@/components/Admin/products/ListView";
import Link from "next/link";


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl ">Products</h1>
        <Link href={`/admin/products/form`}>
          <button className="bg-blue-800 border border-[#22c7d5] text-white text-base font-semibold  px-6 py-2 rounded-lg">
            Create
          </button>
        </Link>
      </div>
      <ListView/>
    </main>
  );
}