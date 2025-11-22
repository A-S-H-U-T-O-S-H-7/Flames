"use client";

import { Button } from "@nextui-org/react";
import { Store, AlertTriangle, CheckCircle, XCircle, Ban, Percent, Eye, FileText } from "lucide-react";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SellerRow({ 
  seller, 
  index, 
  onStatusUpdate, 
  onCommissionUpdate, 
  onViewDetails, 
  onQuickAction, 
  isUpdating,
  hasPermission, // ADD THIS PROP
  adminData // ADD THIS PROP
}) {
  const [formattedDate, setFormattedDate] = useState('N/A');
  const router = useRouter();

  useEffect(() => {
    if (seller.timestampCreate) {
      try {
        const date = seller.timestampCreate.toDate ? 
          seller.timestampCreate.toDate() : 
          new Date(seller.timestampCreate);
        setFormattedDate(date.toLocaleDateString());
      } catch (error) {
        setFormattedDate('N/A');
      }
    }
  }, [seller.timestampCreate]);

  // PERMISSION-BASED VISIBILITY FUNCTIONS
  const canApproveSeller = () => {
    return hasPermission('sellers') && seller.status !== 'approved' && !seller.sellerCredentials?.isSuspended;
  };

  const canRejectSeller = () => {
    return hasPermission('sellers') && seller.status !== 'rejected';
  };

  const canSuspendSeller = () => {
    return hasPermission('sellers') && 
           seller.status === 'approved' && 
           !seller.sellerCredentials?.isSuspended;
  };

  const canReactivateSeller = () => {
    return hasPermission('sellers') && 
           seller.sellerCredentials?.isSuspended;
  };

  const canUpdateCommission = () => {
    return hasPermission('sellers') || hasPermission('payments');
  };

  const canViewAnalytics = () => {
    return hasPermission('sellers') || hasPermission('reports');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'suspended':
        return <Ban className="w-4 h-4" />;
      default:
        return <Store className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'approved':
        return 'bg-green-900/30 text-green-400';
      case 'rejected':
        return 'bg-red-900/30 text-red-400';
      case 'suspended':
        return 'bg-gray-900/30 text-gray-400';
      default:
        return 'bg-blue-900/30 text-blue-400';
    }
  };

  const handleViewAnalytics = () => {
    if (canViewAnalytics()) {
      router.push(`/admin/sellers/${seller.id}`);
    }
  };

  return (
    <tr className="hover:bg-[#1e2737] transition-all duration-200 border-b border-gray-700/50">
      <td className="px-4 md:px-6 py-4 text-gray-300 font-medium">
        {index + 1}
      </td>
      <td className="px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
           {seller.documents?.profileImage?.url ? (
             <OptimizedImage
               src={seller.documents.profileImage.url}
               alt={`${seller.businessName || 'Seller'} profile`}
               className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex-shrink-0"
               width={48}
               height={48}
             />
           ) : (
             <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#22c7d5] to-purple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
               <Store className="text-white text-sm md:text-base" />
             </div>
           )}
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-semibold text-sm md:text-base truncate">{seller.businessName || 'N/A'}</h4>
              <p className="text-gray-400 text-xs md:text-sm truncate">{seller.email || 'N/A'}</p>
              <p className="text-gray-500 text-xs truncate">{seller.phone || ''}</p>
            </div>
          </div>
          <div className="md:hidden flex flex-col gap-3 mt-2 pt-2 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center justify-center gap-1 w-fit ${getStatusColor(seller.status || 'pending')}`}>
                  {getStatusIcon(seller.status || 'pending')}
                  {seller.status || 'pending'}
                </span>
                <span className="text-white font-semibold text-sm">{seller.commission ?? seller.bankDetails?.platformFee ?? 10}</span>
              </div>
              <div className="flex gap-2">
                {canViewAnalytics() && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="bordered"
                    onClick={handleViewAnalytics}
                    className="border-gray-600 text-gray-300 hover:border-[#22c7d5] hover:text-[#22c7d5] transition-colors"
                    title="View Analytics"
                  >
                    <Eye size={16} />
                  </Button>
                )}
                <Button
                  isIconOnly
                  size="sm"
                  variant="bordered"
                  onClick={() => onViewDetails(seller)}
                  className="border-gray-600 text-gray-300 hover:border-[#22c7d5] hover:text-[#22c7d5] transition-colors"
                  title="View Full Details"
                >
                  <FileText size={16} />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              {canApproveSeller() && (
                <Button
                  onClick={() => onQuickAction(seller, 'approved')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex-1"
                  isLoading={isUpdating}
                >
                  Accept
                </Button>
              )}
              {canRejectSeller() && (
                <Button
                  onClick={() => onQuickAction(seller, 'rejected')}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex-1"
                  isLoading={isUpdating}
                >
                  Reject
                </Button>
              )}
              {canSuspendSeller() && (
                <Button
                  onClick={() => onQuickAction(seller, 'suspended')}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex-1"
                  isLoading={isUpdating}
                >
                  Suspend
                </Button>
              )}
              {canReactivateSeller() && (
                <Button
                  onClick={() => onQuickAction(seller, 'reactivate')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex-1"
                  isLoading={isUpdating}
                >
                  Reactivate
                </Button>
              )}
              <Button
                onClick={() => onStatusUpdate(seller)}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                isDisabled={!hasPermission('sellers')}
              >
                More
              </Button>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 md:px-6 py-4 text-center hidden md:table-cell">
        <span className={`px-3 py-2 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto ${getStatusColor(seller.status || 'pending')}`}>
          {getStatusIcon(seller.status || 'pending')}
          {seller.status || 'pending'}
        </span>
      </td>
      <td className="px-4 md:px-6 py-4 text-center hidden md:table-cell">
        <div className="flex items-center justify-center gap-2">
          <span className="text-white font-semibold text-base">{seller.commission ?? seller.bankDetails?.platformFee ?? 10}</span>
          {canUpdateCommission() && (
            <button
              onClick={() => onCommissionUpdate(seller)}
              className="text-gray-400 hover:text-[#22c7d5] p-1.5 rounded-md hover:bg-[#22c7d5]/10 transition-colors"
              title="Edit Commission"
            >
              <Percent size={16} />
            </button>
          )}
        </div>
      </td>
      <td className="px-4 md:px-6 py-4 text-center text-gray-300 text-sm font-medium hidden md:table-cell" suppressHydrationWarning>
        {formattedDate}
      </td>
      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
        <div className="flex justify-center items-center gap-2">
          {canViewAnalytics() && (
            <Button
              isIconOnly
              size="sm"
              variant="bordered"
              onClick={handleViewAnalytics}
              className="border-gray-600 text-gray-300 hover:border-[#22c7d5] hover:text-[#22c7d5] transition-colors"
              title="View Analytics"
            >
              <Eye size={16} />
            </Button>
          )}
          <Button
            isIconOnly
            size="sm"
            variant="bordered"
            onClick={() => onViewDetails(seller)}
            className="border-gray-600 text-gray-300 hover:border-[#22c7d5] hover:text-[#22c7d5] transition-colors"
            title="View Full Details"
          >
            <FileText size={16} />
          </Button>
          
          {/* QUICK ACTIONS */}
          {canApproveSeller() && (
            <Button
              onClick={() => onQuickAction(seller, 'approved')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              isLoading={isUpdating}
              title="Approve Seller"
            >
              Approve
            </Button>
          )}
          {canRejectSeller() && (
            <Button
              onClick={() => onQuickAction(seller, 'rejected')}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              isLoading={isUpdating}
              title="Reject Seller"
            >
              Reject
            </Button>
          )}
          {canSuspendSeller() && (
            <Button
              onClick={() => onQuickAction(seller, 'suspended')}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              isLoading={isUpdating}
              title="Suspend Seller"
            >
              Suspend
            </Button>
          )}
          {canReactivateSeller() && (
            <Button
              onClick={() => onQuickAction(seller, 'reactivate')}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              isLoading={isUpdating}
              title="Reactivate Seller"
            >
              Reactivate
            </Button>
          )}
          <Button
            onClick={() => onStatusUpdate(seller)}
            size="sm"
            className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            title="More Options"
            isDisabled={!hasPermission('sellers')}
          >
            ⋯
          </Button>
        </div>
      </td>
    </tr>
  );
}