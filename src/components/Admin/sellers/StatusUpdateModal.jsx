import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@nextui-org/react";
import { AlertTriangle, CheckCircle, XCircle, Ban, RefreshCw, Mail } from "lucide-react";

const StatusUpdateModal = ({ isOpen, onClose, seller, onUpdate, isUpdating }) => {
  const [reason, setReason] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // UPDATED STATUS OPTIONS WITH SUSPENSION
  const statusOptions = [
    { value: 'approved', label: 'Approve', icon: CheckCircle, color: 'success' },
    { value: 'rejected', label: 'Reject', icon: XCircle, color: 'danger' },
    { value: 'suspended', label: 'Suspend', icon: Ban, color: 'warning' },
    { value: 'reactivate', label: 'Reactivate', icon: RefreshCw, color: 'primary' }
  ];

  const handleSubmit = () => {
    if ((selectedStatus === 'rejected' || selectedStatus === 'suspended') && !reason.trim()) {
      alert('Please provide a reason for rejection or suspension');
      return;
    }
    
    onUpdate(selectedStatus, reason);
    setReason('');
    setSelectedStatus('');
  };

  const handleClose = () => {
    setReason('');
    setSelectedStatus('');
    onClose();
  };

  const isSellerSuspended = seller?.sellerCredentials?.isSuspended;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Update Seller Status
        </ModalHeader>
        <ModalBody>
          {/* Current Status Info */}
          {isSellerSuspended && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mb-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Currently Suspended:</strong> {seller.sellerCredentials.suspensionReason}
              </p>
              <p className="text-yellow-600 dark:text-yellow-300 text-xs mt-1">
                Suspended on: {seller.sellerCredentials.suspendedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Update status for <strong>{seller?.businessName || seller?.email}</strong>
          </p>

          {/* Status Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {statusOptions
              .filter((option) => {
                // Show reactivate only if suspended
                if (option.value === 'reactivate' && !isSellerSuspended) return false;
                // Don't show suspend if already suspended
                if (option.value === 'suspended' && isSellerSuspended) return false;
                return true;
              })
              .map((option) => (
                <Button
                  key={option.value}
                  color={option.color}
                  variant={selectedStatus === option.value ? "solid" : "bordered"}
                  className="h-14"
                  onPress={() => setSelectedStatus(option.value)}
                  startContent={React.createElement(option.icon, { size: 18 })}
                >
                  {option.label}
                </Button>
              ))}
          </div>

          {/* Reason Input (for reject/suspend) */}
          {(selectedStatus === 'rejected' || selectedStatus === 'suspended') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reason for {selectedStatus === 'rejected' ? 'rejection' : 'suspension'}:
              </label>
              <Textarea
                value={reason}
                onValueChange={setReason}
                placeholder={`Explain why you are ${selectedStatus === 'rejected' ? 'rejecting' : 'suspending'} this seller...`}
                minRows={3}
                className="w-full"
              />
            </div>
          )}

          {/* Reactivation Note */}
          {selectedStatus === 'reactivate' && (
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                This will restore the seller's access to their dashboard and make their products visible again.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button 
            color={
              selectedStatus === 'approved' ? 'success' : 
              selectedStatus === 'rejected' ? 'danger' : 
              selectedStatus === 'suspended' ? 'warning' : 'primary'
            }
            onPress={handleSubmit}
            isLoading={isUpdating}
            isDisabled={!selectedStatus || ((selectedStatus === 'rejected' || selectedStatus === 'suspended') && !reason.trim())}
          >
            {isUpdating ? 'Updating...' : `Update to ${selectedStatus}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StatusUpdateModal;