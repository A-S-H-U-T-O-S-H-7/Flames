import ListView from "@/components/Admin/reviews/ListView";

export default function Page() {
  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-white font-bold">Reviews </h1>
      </div>
      <ListView/>
    </main>
  );
}