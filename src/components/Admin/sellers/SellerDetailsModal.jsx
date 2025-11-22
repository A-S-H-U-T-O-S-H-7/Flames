"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { X, Building, User, CreditCard, FileText, Eye } from "lucide-react";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useState, useEffect } from "react";

export default function SellerDetailsModal({ isOpen, onClose, seller }) {
  const [formattedJoinDate, setFormattedJoinDate] = useState('N/A');

  useEffect(() => {
    if (seller?.timestampCreate || seller?.createdAt) {
      try {
        const timestamp = seller.timestampCreate || seller.createdAt;
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        setFormattedJoinDate(date.toLocaleDateString());
      } catch (error) {
        setFormattedJoinDate('N/A');
      }
    }
  }, [seller?.timestampCreate, seller?.createdAt]);

  if (!seller) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="bg-[#0e1726] border border-gray-700"
      scrollBehavior="inside"
    >
      <ModalContent className="max-h-[90vh]">
        <ModalHeader className="text-white flex justify-between items-center">
          <span>Seller Full Details - {seller.businessName || 'Unknown'}</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </ModalHeader>
        <ModalBody className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="space-y-8">
            {/* Business Information */}
            <div className="bg-[#1e2737] rounded-lg p-6 border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-5 h-5 text-[#22c7d5]" />
                <h3 className="text-lg font-semibold text-white">Business Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Business Name:</span>
                  <p className="text-white">{seller.businessInfo?.businessName || seller.businessName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Business Type:</span>
                  <p className="text-white">{seller.businessInfo?.businessType || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">GST Number:</span>
                  <p className="text-white">{seller.bankDetails?.gstin || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">PAN Number:</span>
                  <p className="text-white">{seller.personalInfo?.panNumber || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 text-sm">Business Description:</span>
                  <p className="text-white">{seller.businessInfo?.businessDescription || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-[#1e2737] rounded-lg p-6 border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-[#22c7d5]" />
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Full Name:</span>
                  <p className="text-white">{seller.personalInfo?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Email:</span>
                  <p className="text-white">{seller.personalInfo?.email || seller.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Phone:</span>
                  <p className="text-white">{seller.personalInfo?.phone || seller.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Date of Birth:</span>
                  <p className="text-white">{seller.personalInfo?.dob || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Aadhaar Number:</span>
                  <p className="text-white">{seller.personalInfo?.aadhaarNumber || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 text-sm">Address:</span>
                  <p className="text-white">{seller.personalInfo?.personalAddress || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-[#1e2737] rounded-lg p-6 border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-[#22c7d5]" />
                <h3 className="text-lg font-semibold text-white">Bank Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Account Holder Name:</span>
                  <p className="text-white">{seller.bankDetails?.accountHolder || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Account Number:</span>
                  <p className="text-white">{seller.bankDetails?.accountNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Bank Name:</span>
                  <p className="text-white">{seller.bankDetails?.bankName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">IFSC Code:</span>
                  <p className="text-white">{seller.bankDetails?.ifscCode || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Branch:</span>
                  <p className="text-white">{seller.bankDetails?.bankBranch || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">UPI ID:</span>
                  <p className="text-white">{seller.bankDetails?.upiId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Platform Fee:</span>
                  <p className="text-white">{seller.bankDetails?.platformFee || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Document Images */}
            <div className="bg-[#1e2737] rounded-lg p-6 border border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-[#22c7d5]" />
                <h3 className="text-lg font-semibold text-white">Document Images</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seller.documents?.profileImage?.url && (
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Profile Image:</span>
                    <div className="relative group">
                      <OptimizedImage
                        src={seller.documents.profileImage.url}
                        alt="Profile Image"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        width={200}
                        height={128}
                      />
                      <a
                        href={seller.documents.profileImage.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                )}

                {seller.documents?.aadhaarCard?.url && (
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Aadhaar Card:</span>
                    <div className="relative group">
                      <OptimizedImage
                        src={seller.documents.aadhaarCard.url}
                        alt="Aadhaar Card"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        width={200}
                        height={128}
                      />
                      <a
                        href={seller.documents.aadhaarCard.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                )}

                {seller.documents?.panCard?.url && (
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">PAN Card:</span>
                    <div className="relative group">
                      <OptimizedImage
                        src={seller.documents.panCard.url}
                        alt="PAN Card"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        width={200}
                        height={128}
                      />
                      <a
                        href={seller.documents.panCard.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                )}

                {seller.documents?.gstCertificate?.url && (
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">GST Certificate:</span>
                    <div className="relative group">
                      <OptimizedImage
                        src={seller.documents.gstCertificate.url}
                        alt="GST Certificate"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        width={200}
                        height={128}
                      />
                      <a
                        href={seller.documents.gstCertificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                )}

                {seller.documents?.businessLicense?.url && (
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Business License:</span>
                    <div className="relative group">
                      <OptimizedImage
                        src={seller.documents.businessLicense.url}
                        alt="Business License"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        width={200}
                        height={128}
                      />
                      <a
                        href={seller.documents.businessLicense.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                )}

                {seller.documents?.bankStatement?.url && (
                  <div className="space-y-2">
                    <span className="text-gray-400 text-sm">Bank Statement:</span>
                    <div className="relative group">
                      <OptimizedImage
                        src={seller.documents.bankStatement.url}
                        alt="Bank Statement"
                        className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        width={200}
                        height={128}
                      />
                      <a
                        href={seller.documents.bankStatement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {(!seller.documents || Object.keys(seller.documents).length === 0) && (
                <p className="text-gray-400 text-center py-8">No documents uploaded</p>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-[#1e2737] rounded-lg p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Commission Rate:</span>
                  <p className="text-white">{seller.commission ?? seller.bankDetails?.platformFee ?? 10}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Total Earnings:</span>
                  <p className="text-white">{formatCurrency(seller.totalEarnings || 0)}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">KYC Status:</span>
                  <p className="text-white">{seller.isKycVerified ? 'Verified' : 'Pending'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Joined Date:</span>
                  <p className="text-white" suppressHydrationWarning>
                    {formattedJoinDate}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Status:</span>
                  <p className="text-white capitalize">{seller.status || 'pending'}</p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}