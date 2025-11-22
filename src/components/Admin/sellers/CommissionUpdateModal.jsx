"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

export default function CommissionUpdateModal({ isOpen, onClose, seller, onUpdate, isUpdating }) {
  const [commission, setCommission] = useState('');
  const [reason, setReason] = useState('');

  // Initialize commission when modal opens to prevent hydration issues
  useEffect(() => {
    if (isOpen && seller) {
      setCommission(seller.commission?.toString() || seller.bankDetails?.platformFee?.toString() || '10');
      setReason('');
    } else if (!isOpen) {
      setCommission('');
      setReason('');
    }
  }, [isOpen, seller]);

  const handleSubmit = () => {
    const commissionValue = parseFloat(commission);
    if (commissionValue >= 0 && commissionValue <= 50) {
      onUpdate(commission, reason);
      setCommission('');
      setReason('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="bg-[#0e1726] border border-gray-700">
        <ModalHeader className="text-white">
          Update Commission Rate - {seller?.businessName || seller?.name || 'Unknown'}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Commission Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                placeholder="Enter commission rate (0-50%)"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#1e2737] text-white placeholder-gray-400 focus:outline-none focus:border-[#22c7d5]"
              />
              <p className="text-xs text-gray-400 mt-1">
                Current rate: {seller?.commission || 10}%
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for commission change"
                className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#1e2737] text-white placeholder-gray-400 focus:outline-none focus:border-[#22c7d5]"
                rows={3}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="bordered" onPress={onClose} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit}
            isLoading={isUpdating}
            isDisabled={!commission || parseFloat(commission) < 0 || parseFloat(commission) > 50}
            className="bg-[#22c7d5] text-white"
          >
            Update Commission
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


