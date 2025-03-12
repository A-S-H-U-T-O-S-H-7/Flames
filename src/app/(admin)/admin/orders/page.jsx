import ListView from "@/components/Admin/orders/ListView";

export default function Page() {
  return (
    <main className=" gap-4 p-5">
      <div>
        <h1 className="text-2xl font-medium font-heading">Orders Management</h1>
      </div>
      <ListView />
    </main>
  );
}