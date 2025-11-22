"use client";

import { useSellerProfiles, updateSellerStatus, updateSellerCommission,suspendSellerAccount,reactivateSellerAccount } from "@/lib/firestore/sellers/admin";
import { Button, CircularProgress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import {
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import { usePermissions } from '@/context/PermissionContext'; // ADD THIS IMPORT
import FilterBar from "./FilterBar";
import SellerRow from "./SellerRow";
import StatusUpdateModal from "./StatusUpdateModal";
import CommissionUpdateModal from "./CommissionUpdateModal";
import SellerDetailsModal from "./SellerDetailsModal";

export default function AdminSellersList({ onRefresh }) {
  // ADD PERMISSIONS HOOK
  const { 
    hasPermission, 
    adminData, 
    isSuperAdmin, 
    isAdmin 
  } = usePermissions();
  
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    data: sellers,
    error,
    isLoading,
    lastSnapDoc,
  } = useSellerProfiles({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList[lastSnapDocList?.length - 1],
    status: statusFilter || null
  });

  // CHECK PERMISSION TO ACCESS THIS PAGE
  if (!hasPermission('sellers')) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p>You don't have permission to manage sellers.</p>
      </div>
    );
  }

  const toMillis = (ts) => {
    if (!ts) return 0;
    try {
      if (typeof ts?.toDate === 'function') return ts.toDate().getTime();
      if (typeof ts?.seconds === 'number') return ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6);
      if (typeof ts === 'string') return Date.parse(ts) || 0;
      return 0;
    } catch { return 0; }
  };

  const sortedSellers = useMemo(() => {
    const displaySellers = sellers || [];
    if (!Array.isArray(displaySellers)) return displaySellers;
    return [...displaySellers].sort((a, b) => toMillis(b?.createdAt) - toMillis(a?.createdAt));
  }, [sellers]);

  const handleNextPage = () => {
    if (lastSnapDoc) {
      setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
    }
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setLastSnapDocList([]);
  };

  // UPDATED handleStatusUpdate with admin tracking
  const handleStatusUpdate = async (status, reason = null) => {
    if (!selectedSeller) return;

    setIsUpdating(true);
    try {
      // Use actual admin data from permission context
      const adminId = adminData?.id || adminData?.email || 'unknown-admin';
      
      // Handle different status types
      if (status === 'suspended') {
        await suspendSellerAccount(selectedSeller.id, adminId, reason);
      } else if (status === 'reactivate') {
        await reactivateSellerAccount(selectedSeller.id, adminId);
      } else {
        await updateSellerStatus({
          sellerId: selectedSeller.id,
          status,
          reason,
          adminId: adminId // Pass admin ID for tracking
        });
      }
      
      toast.success(`Seller status updated to ${status}`);
      setShowStatusModal(false);
      setSelectedSeller(null);
      onRefresh?.();
    } catch (error) {
      toast.error(error?.message || "Failed to update seller status");
    }
    setIsUpdating(false);
  };

  const handleCommissionUpdate = async (commission, reason = null) => {
    if (!selectedSeller) return;

    // Check if admin can update commissions
    if (!hasPermission('sellers') && !hasPermission('payments')) {
      toast.error('You do not have permission to update commissions');
      return;
    }

    setIsUpdating(true);
    try {
      await updateSellerCommission({
        sellerId: selectedSeller.id,
        commission: parseFloat(commission),
        reason
      });
      toast.success(`Commission updated to ${commission}%`);
      setShowCommissionModal(false);
      setSelectedSeller(null);
      onRefresh?.();
    } catch (error) {
      toast.error(error?.message || "Failed to update commission");
    }
    setIsUpdating(false);
  };

  // UPDATED handleQuickAction with permission checks
  const handleQuickAction = async (seller, status) => {
    if (!seller) return;

    const actionText = status === 'approved' ? 'approve' : 
                      status === 'rejected' ? 'reject' : 
                      status === 'suspended' ? 'suspend' : 'reactivate';
    
    const result = await Swal.fire({
      title: `Confirm ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      text: `Are you sure you want to ${actionText} ${seller.businessName || seller.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#10b981' : 
                         status === 'suspended' ? '#f59e0b' :
                         status === 'reactivate' ? '#3b82f6' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText}`,
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setIsUpdating(true);
    try {
      const adminId = adminData?.id || adminData?.email || 'unknown-admin';
      
      if (status === 'suspended') {
        const { value: reason } = await Swal.fire({
          title: 'Suspension Reason',
          input: 'text',
          inputLabel: 'Please provide reason for suspension:',
          inputPlaceholder: 'Enter suspension reason...',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to provide a reason!';
            }
          }
        });
        
        if (reason) {
          await suspendSellerAccount(seller.id, adminId, reason);
        } else {
          toast.error('Suspension reason is required');
          return;
        }
      } else if (status === 'reactivate') {
        await reactivateSellerAccount(seller.id, adminId);
      } else {
        await updateSellerStatus({
          sellerId: seller.id,
          status,
          reason: status === 'rejected' ? 'Rejected by admin' : `Status changed to ${status}`
        });
      }
      
      toast.success(`Seller status updated to ${status}`);
      onRefresh?.();
    } catch (error) {
      toast.error(error?.message || "Failed to update seller status");
    }
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  const displaySellers = sortedSellers;

  if (!displaySellers || displaySellers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Sellers Found</h3>
        <p className="text-gray-400">
          {statusFilter ? `No sellers with status "${statusFilter}" found.` : "No sellers have joined your marketplace yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with permission info */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Sellers List</h2>
            <p className="text-gray-400 text-sm">Manage seller accounts and commissions</p>
          </div>
          <div className="text-sm text-gray-400">
            Logged in as: {adminData?.name} ({adminData?.role})
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <FilterBar statusFilter={statusFilter} onChange={handleStatusFilterChange} />

      {/* Sellers Table */}
      <div className="bg-[#0e1726] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
            <thead>
              <tr className="bg-gradient-to-r from-[#1e2737] to-[#2a3441]">
                <th className="font-semibold px-4 md:px-6 py-4 text-left text-gray-200 border-b border-gray-600" style={{ minWidth: "60px" }}>#</th>
                <th className="font-semibold px-4 md:px-6 py-4 text-left text-gray-200 border-b border-gray-600" style={{ minWidth: "250px" }}>Seller Info</th>
                <th className="font-semibold px-4 md:px-6 py-4 text-center text-gray-200 border-b border-gray-600" style={{ minWidth: "120px" }}>Status</th>
                <th className="font-semibold px-4 md:px-6 py-4 text-center text-gray-200 border-b border-gray-600" style={{ minWidth: "120px" }}>Commission</th>
                <th className="font-semibold px-4 md:px-6 py-4 text-center text-gray-200 border-b border-gray-600" style={{ minWidth: "140px" }}>Joined</th>
                <th className="font-semibold px-4 md:px-6 py-4 text-center text-gray-200 border-b border-gray-600" style={{ minWidth: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedSellers.map((seller, index) => (
                <SellerRow
                  key={seller.id}
                  seller={seller}
                  index={index + lastSnapDocList?.length * pageLimit}
                  onStatusUpdate={(seller) => {
                    setSelectedSeller(seller);
                    setShowStatusModal(true);
                  }}
                  onCommissionUpdate={(seller) => {
                    setSelectedSeller(seller);
                    setShowCommissionModal(true);
                  }}
                  onViewDetails={(seller) => {
                    setSelectedSeller(seller);
                    setShowDetailsModal(true);
                  }}
                  onQuickAction={handleQuickAction}
                  isUpdating={isUpdating}
                  hasPermission={hasPermission} // Pass permission function
                  adminData={adminData} // Pass admin data
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        seller={selectedSeller}
        onUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
        hasPermission={hasPermission}
        adminData={adminData}
      />

      {/* Commission Update Modal */}
      <CommissionUpdateModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        seller={selectedSeller}
        onUpdate={handleCommissionUpdate}
        isUpdating={isUpdating}
      />

      {/* Seller Details Modal */}
      <SellerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        seller={selectedSeller}
      />
    </div>
  );
}