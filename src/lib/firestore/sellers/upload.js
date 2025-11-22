import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// Upload any file to Firebase Storage with retry mechanism
export const uploadFile = async (file, folderPath, fileName, maxRetries = 3, timeoutMs = 30000) => {
  // Validate file before upload
  if (!file) {
    return {
      success: false,
      error: 'No file provided for upload'
    };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'File size exceeds 5MB limit'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Only JPG, PNG, and PDF files are allowed'
    };
  }

  // Timeout wrapper function
  const withTimeout = (promise, timeoutMs) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout - please try again')), timeoutMs)
      )
    ]);
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${fileName}-${Date.now()}.${fileExtension}`;
      const filePath = `${folderPath}/${uniqueFileName}`;
      
      const storageRef = ref(storage, filePath);
      const snapshot = await withTimeout(uploadBytes(storageRef, file), timeoutMs);
      const downloadURL = await withTimeout(getDownloadURL(snapshot.ref), 10000);
      
      return {
        success: true,
        url: downloadURL,
        path: filePath,
        fileName: uniqueFileName,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        return {
          success: false,
          error: getUploadErrorMessage(error)
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};

// Helper function to get user-friendly error messages
const getUploadErrorMessage = (error) => {
  if (error.code === 'storage/unauthorized') {
    return 'Upload failed: You do not have permission to upload files';
  } else if (error.code === 'storage/canceled') {
    return 'Upload was canceled';
  } else if (error.code === 'storage/quota-exceeded') {
    return 'Upload failed: Storage quota exceeded';
  } else if (error.code === 'storage/retry-limit-exceeded') {
    return 'Upload failed: Too many failed attempts. Please try again later';
  } else if (error.message.includes('network')) {
    return 'Upload failed: Please check your internet connection and try again';
  }
  return `Upload failed: ${error.message}`;
};

// Upload seller documents
export const uploadSellerDocument = async (file, sellerId, documentType) => {
  return uploadFile(file, `sellers/${sellerId}/documents`, documentType);
};