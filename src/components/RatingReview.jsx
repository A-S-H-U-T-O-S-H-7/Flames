import MyRating from "./MyRating";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";

export async function RatingReviewWrapper({ productId, averageRating = 0 }) {
  const counts = await getProductReviewCounts({ productId });
  return (
    <div className="flex gap-1 items-center">
      <MyRating value={counts?.averageRating ?? averageRating ?? 0} size="small" />
      <h1 className="text-xs text-gray-400">
        (<span>{(counts?.averageRating ?? averageRating ?? 0).toFixed(1)}</span>)
      </h1>
    </div>
  );
}