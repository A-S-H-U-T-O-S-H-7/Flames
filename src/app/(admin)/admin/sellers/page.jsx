"use client";

  import { useState } from 'react';
  import PermissionGuard from '@/components/Admin/PermissionGuard';
  import AdminSellersList from '@/components/Admin/sellers/AdminSellersList';
  import SellerStatsCards from '@/components/Admin/sellers/SellerStatsCard';
  import SellerRegistrationForm from '@/components/web/seller-registration/SellerRegistrationForm';
  import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
  import { X } from 'lucide-react';
  import Swal from 'sweetalert2';

export default function AdminSellersPage() {
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExportData = async () => {
    const result = await Swal.fire({
      title: 'Export Sellers Data',
      text: 'Are you sure you want to export all sellers data to CSV?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c7d5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Export',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      const { exportSellersData } = await import('@/lib/firestore/sellers/admin');
      const csvData = await exportSellersData();
      // Convert to CSV string
      const headers = Object.keys(csvData[0]).join(',');
      const rows = csvData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');

      // Download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sellers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data");
    }
  };

  return (
    <PermissionGuard requiredPermission="sellers">
      <div className="p-4 md:p-6 bg-[#1e2737] min-h-screen">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Seller Management</h1>
              <p className="text-gray-400">Manage marketplace sellers, KYC, and commissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Export Data
              </button>
              <button
                onClick={() => setShowAddSellerModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#22c7d5] to-[#1aa5b5] text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Add Seller
              </button>
            </div>
          </div>
        </div>

        <SellerStatsCards key={`stats-${refreshTrigger}`} />
        <AdminSellersList key={refreshTrigger} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />

        {/* Add Seller Modal */}
        <Modal
          isOpen={showAddSellerModal}
          onClose={() => {
            setShowAddSellerModal(false);
            setRefreshTrigger(prev => prev + 1);
          }}
          size="5xl"
          className="bg-[#1e2737] border border-gray-700"
          scrollBehavior="inside"
        >
          <ModalContent className="max-h-[90vh]">
            <ModalHeader className="text-white flex justify-between items-center">
              <span>Become a Seller</span>
              <button
                onClick={() => setShowAddSellerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </ModalHeader>
            <ModalBody className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <SellerRegistrationForm
                isAdmin={true}
                onSuccess={() => {
                  setShowAddSellerModal(false);
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </PermissionGuard>
  );
}