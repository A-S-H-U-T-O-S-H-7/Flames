export const OrderDetails = ({ order }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    <div>
      <h3 className="text-xs font-semibold text-gray-700">Order ID</h3>
      <p className="mt-1 text-sm font-medium text-gray-900">{order.id}</p>
    </div>
    <div className="col-span-2 md:col-span-1">
      <h3 className="text-xs font-semibold text-gray-700">Delivery Address</h3>
      <p className="mt-1 text-sm text-gray-900">{order.address.fullName}</p>
      <p className="text-xs text-gray-600">{order.address.addressLine1}</p>
      <p className="text-xs text-gray-600">{order.address.city}, {order.address.pincode}</p>
      <p className="text-xs text-gray-600">Mobile: {order.address.mobile || "N/A"}</p>
    </div>
    <div>
      <h3 className="text-xs font-semibold text-gray-700">
        {order.status.toLowerCase() === "delivered" ? "Paid Amount" : "Amount to be Paid"}
      </h3>
      <p className="mt-1 text-sm font-medium text-gray-900">
        ₹{order.total} <span className="text-xs text-gray-600">({order.paymentMode})</span>
      </p>
    </div>
  </div>
);