import ListView from "@/components/Admin/orders/ListView";

export default function Page() {
  return (
    <main >
      <div className="flex justify-between items-center">
        <h1 className="text-xl px-[30px] mt-[40px]">Orders Management</h1>
      </div>
      <ListView />
    </main>
  );
}