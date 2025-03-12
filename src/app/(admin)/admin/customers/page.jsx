import ListView from "@/components/Admin/customers/ListView";

export default function Page() {
  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Customers</h1>
      </div>
      <div className="">
      <ListView />
      </div>
    </main>
  );
}