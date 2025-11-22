import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Ban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { stepSchemas } from '../../../utils/validationSchemas';
import { createSeller } from '../../../lib/firestore/sellers/write';
import { getSellerByEmail } from '../../../lib/firestore/sellers/read';
import FormProgress from './FormProgress';
import BusinessPersonalInfo from './steps/BusinessPersonalInfo';
import BankDetails from './steps/BankDetails';
import DocumentUpload from './steps/DocumentUpload';
import LoadingOverlay from './LoadingOverlay';
import SellerStatusPage from './SellerStatusPage';
import SellerActivationForm from './SellerActivationForm';

const STEPS = [
  { number: 1, label: 'Business & Personal', component: BusinessPersonalInfo },
  { number: 2, label: 'Bank Details', component: BankDetails },
  { number: 3, label: 'Documents', component: DocumentUpload }
];

const SellerRegistrationForm = ({ isAdmin = false, onSuccess }) => {
  // Get auth and router
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // UI State
  const [currentStep, setCurrentStep] = useState(1);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Seller Status State
  const [sellerStatus, setSellerStatus] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [showStatusPage, setShowStatusPage] = useState(false);

  // Form Data State
  const [savedValues, setSavedValues] = useState({
    // Personal Information
    fullName: '',
    dob: '',
    email: user?.email || '',
    phone: '',
    personalAddress: '',
    aadhaarNumber: '',
    panNumber: '',
    // Business Information
    businessName: '',
    businessType: '',
    businessDescription: '',
    // Bank Details
    gstin: '',
    platformFee: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    bankBranch: '',
    upiId: '',
    // Document files
    aadhaarCard: null,
    panCard: null,
    businessLicense: null,
    businessLogo: null,
    profileImage: null
  });

  // Check for existing seller application on mount
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (authLoading) {
        return; 
      }
      
      if (!user || !user.email) {
        setIsCheckingStatus(false);
        return;
      }
      
      const startTime = Date.now();
      const minCheckTime = 1000;
      
      try {
        const result = await getSellerByEmail(user.email);
        
        if (result.success) {
          const sellerData = result.data;
          setSellerData(sellerData);
          
          // ENHANCED STATUS CHECKING WITH SUSPENSION & ACTIVATION SUPPORT
          if (sellerData.sellerCredentials?.isSuspended) {
            setSellerStatus('suspended');
          } else if (sellerData.sellerCredentials?.isActivated) {
            setSellerStatus('activated');
          } else if (sellerData.status === 'approved') {
            setSellerStatus('approved');
          } else {
            setSellerStatus(sellerData.status);
          }
          
          setShowStatusPage(true);
        } else {
          setSellerStatus(null);
          setShowStatusPage(false);
        }
        
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minCheckTime) {
          await new Promise(resolve => setTimeout(resolve, minCheckTime - elapsedTime));
        }
      } catch (error) {
        console.error('Error checking seller status:', error);
        toast.error('Error checking application status');
        
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minCheckTime) {
          await new Promise(resolve => setTimeout(resolve, minCheckTime - elapsedTime));
        }
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    checkExistingApplication();
  }, [user, authLoading]);

  // Auto-redirect activated sellers to dashboard
  useEffect(() => {
    if (sellerStatus === 'activated') {
      const timer = setTimeout(() => {
        router.push('/sellers/dashboard');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [sellerStatus, router]);

  // Update email in form when user changes
  useEffect(() => {
    if (user && user.email) {
      setSavedValues(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user]);

  // Get current step component
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  // Handle next step
  const handleNext = async (values, { setTouched, setSubmitting }) => {
    const currentSchema = stepSchemas[currentStep - 1];
    
    try {
      await currentSchema.validate(values, { abortEarly: false });
      setSavedValues(prev => ({ ...prev, ...values }));
      
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
      }
      setSubmitting(false);
    } catch (errors) {
      const formattedErrors = {};
      if (errors.inner) {
        errors.inner.forEach(error => {
          formattedErrors[error.path] = error.message;
        });
        setTouched(formattedErrors);
      }
      setSubmitting(false);
    }
  };

  // Handle back step
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Handle final form submission
  const handleSubmit = async (values, actions) => {
    setIsSubmitting(true);
    setLoadingStep(0);

    if (values.email !== user?.email) {
      toast.error('Email mismatch. Please contact support.');
      setIsSubmitting(false);
      return;
    }
    
    const startTime = Date.now();
    const minLoadingTime = 3000;
    
    try {
      for (const schema of stepSchemas) {
        await schema.validate(values, { abortEarly: false });
      }

      const existingApplication = await getSellerByEmail(values.email);
      if (existingApplication.success) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minLoadingTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }
        
        setSellerData(existingApplication.data);
        setSellerStatus(existingApplication.data.status);
        setShowStatusPage(true);
        setIsSubmitting(false);
        actions.setSubmitting(false);
        return;
      }

      setLoadingStep(0);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const documentFiles = {
        aadhaarCard: values.aadhaarCard,
        panCard: values.panCard,
        businessLicense: values.businessLicense,
        businessLogo: values.businessLogo,
        profileImage: values.profileImage
      };

      const { aadhaarCard, panCard, businessLicense, businessLogo, profileImage, ...formData } = values;

      setLoadingStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = await createSeller(formData, documentFiles);
      
      setLoadingStep(2);
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      if (result.success) {
        if (isAdmin) {
          onSuccess?.();
        } else {
          setSellerData({
            sellerId: result.sellerId,
            status: 'pending',
            personalInfo: { email: formData.email }
          });
          setSellerStatus('pending');
          setShowStatusPage(true);
        }

        actions.resetForm();
        setCurrentStep(1);
        setSavedValues({
          fullName: '',
          dob: '',
          email: user?.email || '',
          phone: '',
          personalAddress: '',
          aadhaarNumber: '',
          panNumber: '',
          businessName: '',
          businessType: '',
          businessDescription: '',
          gstin: '',
          platformFee: '',
          accountHolder: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          bankBranch: '',
          upiId: '',
          aadhaarCard: null,
          panCard: null,
          businessLicense: null,
          businessLogo: null,
          profileImage: null
        });

        toast.success('Application submitted successfully!');
      } else {
        console.error('Registration failed:', result.error);
        toast.error('Registration failed: ' + (result.error || 'Please try again.'));
      }

    } catch (errors) {
      const formattedErrors = {};
      if (errors.inner) {
        errors.inner.forEach(error => {
          formattedErrors[error.path] = error.message;
        });
        actions.setTouched(formattedErrors);
      }
      console.error('Form validation error:', errors);
      toast.error('Please check all fields and correct the errors before submitting.');
    } finally {
      setIsSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  // Navigation handlers
  const handleGoToDashboard = () => {
    router.push('/seller/dashboard');
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  // Props for step components
  const stepProps = {
    onBack: handleBack,
    isSubmitting: isSubmitting
  };

  if (authLoading || isCheckingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Loading your account...' : 'Checking your application status...'}
          </p>
        </div>
      </div>
    );
  }

  // Handle different seller statuses
  if (showStatusPage && sellerStatus && sellerData) {
    // 🔴 SUSPENDED: Show suspension message
    if (sellerStatus === 'suspended') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Ban className="w-8 h-8 text-yellow-600" />
              <h3 className="text-yellow-800 font-semibold text-lg">
                Account Suspended
              </h3>
            </div>
            <p className="text-yellow-700 mb-3">
              {sellerData.sellerCredentials?.suspensionReason || 
               'Your seller account has been temporarily suspended due to policy violations.'}
            </p>
            <div className="text-sm text-yellow-600">
              <p><strong>Suspended on:</strong> {sellerData.sellerCredentials?.suspendedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</p>
              <p className="mt-2">
                If you believe this is a mistake, please contact support at support@flames.com
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    // 🟢 APPROVED but not activated: Show activation form
    if (sellerStatus === 'approved' && !sellerData.sellerCredentials?.isActivated) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center ">
          <SellerActivationForm 
            sellerData={sellerData}
            onActivationSuccess={() => {
              setSellerStatus('activated');
              router.push('/sellers/dashboard');
            }}
          />
        </div>
      );
    }
    
    // 🔵 ACTIVATED: Show success message (auto-redirect handled by useEffect)
    if (sellerStatus === 'activated') {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <div className="text-green-600 text-2xl font-bold mb-2">
              Account Activated Successfully!
            </div>
            <p className="text-gray-600">Redirecting to seller dashboard...</p>
          </div>
        </div>
      );
    }
    
    // 🔴 REJECTED: Show rejection message with form for reapplication
    if (sellerStatus === 'rejected') {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <h3 className="text-red-800 font-semibold text-lg mb-2">
              ⚠️ Previous Application Rejected
            </h3>
            <p className="text-red-700 mb-2">
              {sellerData.rejectionReason || 'Your previous application did not meet our criteria.'}
            </p>
            <p className="text-sm text-red-600">
              You can submit a new application below.
            </p>
          </div>
          
          <LoadingOverlay isVisible={isSubmitting} currentStep={loadingStep} />
          <FormProgress currentStep={currentStep} steps={STEPS} />
          
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
            <Formik
              initialValues={savedValues}
              validationSchema={stepSchemas[currentStep - 1]}
              onSubmit={currentStep === STEPS.length ? handleSubmit : handleNext}
              enableReinitialize
            >
              {(formikProps) => (
                <CurrentStepComponent 
                  {...formikProps}
                  {...stepProps}
                />
              )}
            </Formik>
          </div>
        </div>
      );
    }
    
    // 🟡 PENDING: Show status page
    return (
      <SellerStatusPage
        status={sellerStatus}
        sellerId={sellerData.sellerId || sellerData.id}
        onGoToDashboard={handleGoToDashboard}
        onGoToHome={handleGoToHome}
      />
    );
  }

  // Default: Show registration form
  return (
    <div className="max-w-4xl mx-auto">
      <LoadingOverlay isVisible={isSubmitting} currentStep={loadingStep} />
      <FormProgress currentStep={currentStep} steps={STEPS} />
      
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        <Formik
          initialValues={savedValues}
          validationSchema={stepSchemas[currentStep - 1]}
          onSubmit={currentStep === STEPS.length ? handleSubmit : handleNext}
          enableReinitialize
        >
          {(formikProps) => (
            <CurrentStepComponent 
              {...formikProps}
              {...stepProps}
            />
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SellerRegistrationForm;