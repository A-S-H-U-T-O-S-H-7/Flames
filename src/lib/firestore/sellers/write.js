import { doc, setDoc, updateDoc, serverTimestamp, collection, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { uploadSellerDocument } from './upload';

const simpleHash = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Create new seller registration
export const createSeller = async (formData, documentFiles) => {
  try {
    // Create seller document with auto-generated ID
    const sellerRef = doc(collection(db, 'sellers'));
    const sellerId = sellerRef.id;

    // Upload documents and get URLs
    const uploadedDocuments = {};
    const uploadErrors = [];
    
    // Upload each document if provided
    for (const [docType, file] of Object.entries(documentFiles)) {
      if (file) {
        const uploadResult = await uploadSellerDocument(file, sellerId, docType);
        if (uploadResult.success) {
          uploadedDocuments[docType] = {
            url: uploadResult.url,
            path: uploadResult.path,
            fileName: uploadResult.fileName,
            size: uploadResult.size,
            type: uploadResult.type,
            uploadedAt: new Date().toISOString()
          };
        } else {
          uploadErrors.push(`${docType}: ${uploadResult.error}`);
        }
      }
    }

    // Check if critical documents failed to upload
    const criticalDocs = ['aadhaarCard', 'panCard'];
    const criticalErrors = uploadErrors.filter(error => 
      criticalDocs.some(doc => error.startsWith(doc))
    );
    
    if (criticalErrors.length > 0) {
      return {
        success: false,
        error: `Failed to upload required documents: ${criticalErrors.join(', ')}`
      };
    }

    // Prepare seller data
    const sellerData = {
      // Seller Identity
      sellerId: sellerId,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Personal Information
      personalInfo: {
        fullName: formData.fullName,
        dob: formData.dob,
        email: formData.email,
        phone: formData.phone,
        personalAddress: formData.personalAddress,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber
      },
      
      // Business Information
      businessInfo: {
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription
      },
      
      // Bank Details
      bankDetails: {
        gstin: formData.gstin || '',
        platformFee: formData.platformFee,
        accountHolder: formData.accountHolder,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
        bankBranch: formData.bankBranch,
        upiId: formData.upiId || ''
      },

      //seller Credentials
      sellerCredentials: {
    isActivated: false,
    activatedAt: null,
    lastLogin: null,
    isSuspended: false,
    suspensionReason: '',
    suspendedAt: null,
    suspendedBy: null
  },
  activationStatus: 'inactive',

      
      // Commission (mapped from platformFee)
      commission: parseFloat(formData.platformFee) || 10,
      
      // Uploaded Documents (with URLs)
      documents: uploadedDocuments,
      
      // Admin tracking
      approvedBy: null,
      approvedAt: null,
      rejectionReason: ''
    };

    // Save to Firestore
    await setDoc(sellerRef, sellerData);

    // Also create entry in admins collection for role management
    const adminRef = doc(db, 'admins', sellerId);
    await setDoc(adminRef, {
      uid: sellerId,
      role: 'seller',
      approved: false,
      createdAt: serverTimestamp(),
      email: formData.email
    });

    const response = {
      success: true,
      sellerId: sellerId,
      message: 'Seller registration submitted successfully!'
    };

    // Add warnings for non-critical upload failures
    if (uploadErrors.length > 0 && criticalErrors.length === 0) {
      response.warnings = uploadErrors;
      response.message += ` Note: Some optional documents could not be uploaded: ${uploadErrors.join(', ')}`;
    }

    return response;

  } catch (error) {
    console.error('Error creating seller:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An unexpected error occurred while creating your seller account.';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'You do not have permission to create a seller account. Please contact support.';
    } else if (error.code === 'network-request-failed') {
      errorMessage = 'Network error: Please check your internet connection and try again.';
    } else if (error.code === 'quota-exceeded') {
      errorMessage = 'Storage quota exceeded. Please try again later or contact support.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Update seller status (for admin)
export const updateSellerStatus = async (sellerId, status, adminId, reason = '') => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    const updateData = {
      status: status,
      updatedAt: serverTimestamp()
    };

    if (status === 'approved') {
      updateData.approvedBy = adminId;
      updateData.approvedAt = serverTimestamp();
    } else if (status === 'rejected') {
      updateData.rejectionReason = reason;
    }

    await updateDoc(sellerRef, updateData);

    // Also update admin collection
    const adminRef = doc(db, 'admins', sellerId);
    await updateDoc(adminRef, {
      approved: status === 'approved',
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error updating seller status:', error);
    return { success: false, error: error.message };
  }
};

export const activateSellerAccount = async (sellerId, password) => {
  try {
    console.log('[activateSellerAccount] Starting activation for:', sellerId);
    
    // Get seller data
    const sellerRef = doc(db, 'sellers', sellerId);
    const sellerDoc = await getDoc(sellerRef);
    
    if (!sellerDoc.exists()) {
      return { success: false, error: 'Seller not found' };
    }
    
    const sellerData = sellerDoc.data();
    const email = sellerData.personalInfo?.email;
    
    if (!email) {
      return { success: false, error: 'Seller email not found' };
    }
    
    // Hash the seller-specific password
    const hashedPassword = await simpleHash(password);
    
    // Update Firestore with activation details AND hashed password
    await updateDoc(sellerRef, {
      'sellerCredentials.isActivated': true,
      'sellerCredentials.activatedAt': serverTimestamp(),
      'sellerCredentials.sellerPassword': hashedPassword, // Store hashed password
      'sellerCredentials.isSuspended': false,
      'activationStatus': 'active',
      'updatedAt': serverTimestamp()
    });
    
    console.log('✓ [activateSellerAccount] Seller password set and activation complete!');
    return { success: true };
    
  } catch (error) {
    console.error('[activateSellerAccount] Fatal error:', error);
    return { success: false, error: error.message };
  }
};

export const suspendSellerAccount = async (sellerId, adminId, reason = '') => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    
    await updateDoc(sellerRef, {
      status: 'suspended',
      'sellerCredentials.isSuspended': true,
      'sellerCredentials.suspensionReason': reason,
      'sellerCredentials.suspendedAt': serverTimestamp(),
      'sellerCredentials.suspendedBy': adminId,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error suspending seller account:', error);
    return { success: false, error: error.message };
  }
};

export const reactivateSellerAccount = async (sellerId, adminId) => {
  try {
    const sellerRef = doc(db, 'sellers', sellerId);
    
    await updateDoc(sellerRef, {
      status: 'approved',
      'sellerCredentials.isSuspended': false,
      'sellerCredentials.suspensionReason': '',
      'sellerCredentials.suspendedAt': null,
      'sellerCredentials.suspendedBy': null,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error reactivating seller account:', error);
    return { success: false, error: error.message };
  }
};

// 4. Password hashing helper
const hashPassword = async (password) => {
  // Basic hashing - use bcrypt in production
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
