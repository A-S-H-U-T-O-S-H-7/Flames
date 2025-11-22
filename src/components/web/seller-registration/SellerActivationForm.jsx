import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { activateSellerAccount } from '@/lib/firestore/sellers/write';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight, Info, Sparkles } from 'lucide-react';

const activationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const SellerActivationForm = ({ sellerData, onActivationSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleActivation = async (values, actions) => {
    setIsSubmitting(true);
    
    try {
      console.log('Starting activation for seller:', sellerData.id);
      console.log('Seller email:', sellerData.personalInfo?.email);
      
      const result = await activateSellerAccount(sellerData.id, values.password);
      
      console.log('Activation result:', result);
      
      if (result.success) {
        toast.success('Welcome to Flames! Your seller account is now active! 🎉');
        console.log('✓ Activation successful - you can now login with your credentials');
        onActivationSuccess();
      } else {
        console.error('Activation failed:', result.error);
        toast.error(result.error || 'Activation failed. Please try again.');
      }
    } catch (error) {
      console.error('Activation error:', error);
      toast.error('An error occurred during activation.');
    } finally {
      setIsSubmitting(false);
      actions.setSubmitting(false);
    }
  };

  return (
    <div className=" max-w-full md:max-w-lg mx-auto px-1 md:px-4">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-200 p-2 md:p-6">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Welcome to Flames!
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            Set up your secure credentials to ignite your seller dashboard
          </p>
        </div>

        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={activationSchema}
          onSubmit={handleActivation}
        >
          {({ isSubmitting: formikSubmitting, errors, touched }) => (
            <Form className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`w-full px-3 py-3 border-2 text-gray-700 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.password && touched.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Create your secure password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-3 py-3 border-2 text-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword && touched.confirmPassword 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || formikSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg group"
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Igniting Your Account...
                    </>
                  ) : (
                    <>
                      Ignite Your Seller Journey
                      <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </Form>
          )}
        </Formik>

        {/* Compact Information Card */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <strong>Pro Tip:</strong> These credentials give you exclusive access to your Flames seller dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerActivationForm;