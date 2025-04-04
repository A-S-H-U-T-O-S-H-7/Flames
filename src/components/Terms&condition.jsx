import React from "react";
import { X } from "lucide-react";

const TermsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-purple-600">
          Terms & Conditions
        </h2>

        {/* Terms Content */}
        <div className="mb-6 max-h-72 overflow-y-auto text-gray-700 text-sm space-y-4">
          <p>
            Please read these Terms and Conditions carefully before proceeding
            with your purchase. By completing your payment, you agree to these
            terms.
          </p>

          <h3 className="font-semibold text-purple-600">1. Order & Payment</h3>
          <p>
            - All orders placed on **Flames** are subject to acceptance and
            availability.  
            - Payment must be completed before order processing.  
            - We accept Razorpay, UPI, debit/credit cards, and wallet payments.
          </p>

          <h3 className="font-semibold text-purple-600">2. Shipping & Delivery</h3>
          <p>
            - Orders are shipped within **3-7 business days**.  
            - Delivery timelines may vary due to unforeseen circumstances.  
            - Once shipped, tracking details will be shared via email/SMS.
          </p>

          <h3 className="font-semibold text-purple-600">3. Returns & Refunds</h3>
          <p>
            - We accept returns within **7 days** of delivery for unused and
            undamaged items.  
            - Refunds (if applicable) will be processed within **5-7 business days**.
          </p>

          <h3 className="font-semibold text-purple-600">4. Cancellations</h3>
          <p>
            - Orders can be canceled within **24 hours** of placing them.  
            - Once shipped, cancellations are not allowed.
          </p>

          <h3 className="font-semibold text-purple-600">5. Liability</h3>
          <p>
            - We are not responsible for delays caused by courier services.  
            - We do not offer compensation for minor color variations in
            products.
          </p>

          <h3 className="font-semibold text-purple-600">6. Acceptance of Terms</h3>
          <p>
            By proceeding with your payment, you acknowledge that you have read,
            understood, and agreed to these Terms & Conditions.
          </p>
        </div>

        {/* Agree & Close Button */}
        <div className="flex justify-end space-x-2">
          
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPopup;
