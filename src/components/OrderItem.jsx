// Condensed sub-components
import Link from "next/link";

export const OrderItem = ({ item }) => (
  <div className="flex bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3 w-full sm:w-auto sm:max-w-xs">
    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
      <img src={item.product_data.images[0]} alt={item.product_data.name} className="w-full h-full object-cover" />
    </div>
    <div className="ml-3 flex-grow">
      <Link href={`/product-details/${item.product_data.id}`} className="text-sm font-semibold text-blue-600 hover:underline">
        {item.product_data.name}
      </Link>
      <p className="text-xs text-gray-600 mt-1">{item.product_data.description || "No description available"}</p>
      <p className="text-xs font-medium mt-1 text-gray-600">Quantity - {item.quantity}</p>
    </div>
  </div>
);