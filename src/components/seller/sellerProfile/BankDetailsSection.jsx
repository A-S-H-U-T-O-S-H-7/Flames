import { CreditCard, Building2, MapPin, FileText, Smartphone, User, Copy, Check, Edit2, Save, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firestore/firebase';

export default function BankDetails({ bankDetails = {
  accountHolder: "John Doe",
  accountNumber: "1234567890123456",
  ifscCode: "HDFC0001234",
  bankName: "HDFC Bank",
  bankBranch: "Mumbai Central",
  gstin: "27AABCU9603R1ZM",
  upiId: "john.doe@paytm"
}, sellerId, onUpdate }) {
  const [copiedField, setCopiedField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedDetails, setEditedDetails] = useState(bankDetails);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDetails(bankDetails);
  };

  const handleSave = async () => {
    if (!sellerId) {
      alert('Seller ID not found');
      return;
    }

    // Basic validation
    if (!editedDetails.accountHolder?.trim()) {
      alert('Account holder name is required');
      return;
    }

    if (!editedDetails.accountNumber?.trim()) {
      alert('Account number is required');
      return;
    }

    if (editedDetails.accountNumber && !/^\d{9,18}$/.test(editedDetails.accountNumber)) {
      alert('Please enter a valid account number (9-18 digits)');
      return;
    }

    if (!editedDetails.ifscCode?.trim()) {
      alert('IFSC code is required');
      return;
    }

    if (editedDetails.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(editedDetails.ifscCode)) {
      alert('Please enter a valid IFSC code');
      return;
    }

    if (editedDetails.upiId && !/^[\w.\-]+@[\w]+$/.test(editedDetails.upiId)) {
      alert('Please enter a valid UPI ID');
      return;
    }

    setIsSaving(true);
    try {
      const sellerRef = doc(db, 'sellers', sellerId);
      const updateData = {
        updatedAt: serverTimestamp(),
        'bankDetails.accountHolder': editedDetails.accountHolder,
        'bankDetails.accountNumber': editedDetails.accountNumber,
        'bankDetails.ifscCode': editedDetails.ifscCode,
        'bankDetails.bankName': editedDetails.bankName,
        'bankDetails.bankBranch': editedDetails.bankBranch,
        'bankDetails.upiId': editedDetails.upiId
        // Note: GSTIN is intentionally excluded as it should not be editable
      };

      await updateDoc(sellerRef, updateData);
      
      setIsEditing(false);
      if (onUpdate) onUpdate();
      alert('Bank details updated successfully!');
    } catch (error) {
      console.error('Error updating bank details:', error);
      alert('Failed to update bank details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedDetails(bankDetails);
    setIsEditing(false);
  };

  const handleChange = useCallback((field, value) => {
    setEditedDetails(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const CopyButton = ({ value, field }) => (
    <button
      onClick={() => handleCopy(value, field)}
      className="ml-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
      title="Copy to clipboard"
    >
      {copiedField === field ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );


  return (
    <div className="w-full pb-2">
      <div className="relative border border-dashed border-blue-400 dark:border-blue-500 rounded-2xl p-5 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-blue-900/30">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <p className="text-xs text-blue-600 dark:text-blue-300">Secure banking information</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm font-medium">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            )}
          </div>

          {/* First Row - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            {/* Account Holder */}
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span className="text-[12px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Account Holder</span>
                </div>
                {!isEditing && bankDetails.accountHolder && <CopyButton value={bankDetails.accountHolder} field="holder" />}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.accountHolder || ''}
                  onChange={(e) => handleChange('accountHolder', e.target.value)}
                  placeholder="Enter account holder name"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              ) : (
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{bankDetails.accountHolder || '-'}</p>
              )}
            </div>

            {/* Account Number */}
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                  <span className="text-[12px] font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">Account Number</span>
                </div>
                {!isEditing && bankDetails.accountNumber && <CopyButton value={bankDetails.accountNumber} field="account" />}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.accountNumber || ''}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  placeholder="Enter account number"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              ) : (
                <p className="text-base font-bold text-gray-900 dark:text-white font-mono">{bankDetails.accountNumber || '-'}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  <span className="text-[12px] font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">IFSC Code</span>
                </div>
                {!isEditing && bankDetails.ifscCode && <CopyButton value={bankDetails.ifscCode} field="ifsc" />}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.ifscCode || ''}
                  onChange={(e) => handleChange('ifscCode', e.target.value)}
                  placeholder="Enter IFSC code"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              ) : (
                <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{bankDetails.ifscCode || '-'}</p>
              )}
            </div>
          </div>

          {/* Second Row - 4 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Bank Name */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Bank Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.bankName || ''}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  placeholder="Enter bank name"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{bankDetails.bankName || '-'}</p>
              )}
            </div>

            {/* Branch */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                <span className="text-[12px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">Branch</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.bankBranch || ''}
                  onChange={(e) => handleChange('bankBranch', e.target.value)}
                  placeholder="Enter branch name"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{bankDetails.bankBranch || '-'}</p>
              )}
            </div>

            {/* GSTIN */}
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span className="text-[12px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">GSTIN</span>
                </div>
                {!isEditing && bankDetails.gstin && <CopyButton value={bankDetails.gstin} field="gstin" />}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.gstin || ''}
                  onChange={(e) => handleChange('gstin', e.target.value)}
                  placeholder="GSTIN cannot be edited"
                  disabled={true}
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white font-mono">{bankDetails.gstin || '-'}</p>
              )}
            </div>

            {/* UPI ID */}
            <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-blue-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-[12px] font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">UPI ID</span>
                </div>
                {!isEditing && bankDetails.upiId && <CopyButton value={bankDetails.upiId} field="upi" />}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedDetails.upiId || ''}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  placeholder="Enter UPI ID"
                  className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              ) : (
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{bankDetails.upiId || '-'}</p>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}