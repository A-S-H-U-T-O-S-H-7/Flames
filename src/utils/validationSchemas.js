import * as Yup from 'yup';

// Helper function to calculate age from date of birth
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const personalInfoSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
    .required('Full name is required'),
  
  dob: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'You must be at least 18 years old', value => {
      return calculateAge(value) >= 18;
    })
    .required('Date of birth is required'),
  
  email: Yup.string()
    .email('Invalid email address (must include @)')
    .required('Email is required'),
  
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .matches(/^[6-9]\d{9}$/, 'Phone number must start with 6, 7, 8, or 9')
    .required('Phone number is required'),
  
  personalAddress: Yup.string()
    .min(10, 'Address must be at least 10 characters')
    .required('Address is required'),
  
  aadhaarNumber: Yup.string()
    .matches(/^[2-9]{1}[0-9]{11}$/, 'Aadhaar must be 12 digits not starting with 0 or 1')
    .required('Aadhaar number is required'),
  
  panNumber: Yup.string()
    .transform(value => value ? value.toUpperCase() : value)
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN must be in format: ABCDE1234F')
    .required('PAN number is required')
});

export const businessInfoSchema = Yup.object().shape({
  businessName: Yup.string()
    .min(3, 'Business name must be at least 3 characters')
    .max(50, 'Business name must be less than 50 characters')
    .required('Business name is required'),
  
  businessType: Yup.string()
    .required('Business type is required'),
  
  businessDescription: Yup.string()
    .max(250, 'Business description must be less than 250 characters')
    .required('Business description is required')
});

export const bankDetailsSchema = Yup.object().shape({
  gstin: Yup.string()
    .transform(value => value ? value.toUpperCase() : '')
    .test('gstin-format', 'Invalid GSTIN format', function(value) {
      if (!value || value.length === 0) return true; // Optional field
      return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);
    })
    .notRequired(),
  
  platformFee: Yup.string()
    .required('Platform fee is required'),
  
  accountHolder: Yup.string()
    .min(3, 'Account holder name must be at least 3 characters')
    .max(100, 'Account holder name must be less than 100 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Account holder name can only contain letters and spaces')
    .required('Account holder name is required'),
  
  accountNumber: Yup.string()
    .matches(/^\d{9,18}$/, 'Account number must be 9-18 digits')
    .required('Account number is required'),
  
  ifscCode: Yup.string()
    .transform(value => value ? value.toUpperCase() : '')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .required('IFSC code is required'),
  
  bankName: Yup.string()
    .min(2, 'Bank name must be at least 2 characters')
    .max(100, 'Bank name must be less than 100 characters')
    .required('Bank name is required'),
  
  bankBranch: Yup.string()
    .min(2, 'Bank branch must be at least 2 characters')
    .max(100, 'Bank branch must be less than 100 characters')
    .required('Bank branch is required'),
  
  upiId: Yup.string()
    .test('upi-format', 'Invalid UPI ID format', function(value) {
      if (!value || value.length === 0) return true; // Optional field
      return /^[\w.-]+@[\w.-]+$/.test(value);
    })
    .notRequired()
});

export const documentSchema = Yup.object().shape({
  aadhaarCard: Yup.mixed()
    .required('Aadhaar card is required')
    .test('fileSize', 'File too large (max 5MB)', value => {
      return !value || (value && value.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Unsupported file format (PDF, JPG, PNG only)', value => {
      return !value || (value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type));
    }),
  
  panCard: Yup.mixed()
    .required('PAN card is required')
    .test('fileSize', 'File too large (max 5MB)', value => {
      return !value || (value && value.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Unsupported file format (PDF, JPG, PNG only)', value => {
      return !value || (value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type));
    }),
  
  businessLogo: Yup.mixed()
    .test('fileSize', 'File too large (max 5MB)', value => {
      return !value || (value && value.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Unsupported file format (JPG, PNG only)', value => {
      return !value || (value && ['image/jpeg', 'image/png'].includes(value.type));
    })
    .nullable()
    .optional(),
  
  profileImage: Yup.mixed()
    .test('fileSize', 'File too large (max 5MB)', value => {
      return !value || (value && value.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Unsupported file format (JPG, PNG only)', value => {
      return !value || (value && ['image/jpeg', 'image/png'].includes(value.type));
    })
    .nullable()
    .optional(),
  
  businessLicense: Yup.mixed()
    .test('fileSize', 'File too large (max 5MB)', value => {
      return !value || (value && value.size <= 5 * 1024 * 1024);
    })
    .test('fileType', 'Unsupported file format (PDF, JPG, PNG only)', value => {
      return !value || (value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type));
    })
    .nullable()
    .optional()
});

// Combined schemas for each step
export const stepSchemas = [
  Yup.object().shape({
    ...personalInfoSchema.fields,
    ...businessInfoSchema.fields
  }),
  bankDetailsSchema,
  documentSchema
];