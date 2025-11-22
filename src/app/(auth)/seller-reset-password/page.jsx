"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firestore/firebase';
import { getSellerByEmail } from '@/lib/firestore/sellers/read';
import toast from 'react-hot-toast';

function SellerResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validLink, setValidLink] = useState(false);
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  // Validate the reset code on component mount
  useEffect(() => {
    const validateResetCode = async () => {
      if (!oobCode) {
        setValidLink(false);
        setValidating(false);
        toast.error('Invalid reset link: missing reset code');
        return;
      }

      try {
        // Verify the reset code and get the associated email
        const email = await verifyPasswordResetCode(auth, oobCode);
        
        // Check if this email belongs to an approved seller
        const sellerResult = await getSellerByEmail(email);
        
        if (sellerResult.success) {
          const seller = sellerResult.data;
          if (seller.status === 'approved' && seller.sellerCredentials?.isActivated) {
            setEmail(email);
            setValidLink(true);
          } else {
            toast.error('Seller account not activated or approved');
            setValidLink(false);
          }
        } else {
          toast.error('No seller account found with this email');
          setValidLink(false);
        }
      } catch (error) {
        console.error('Reset code validation error:', error);
        
        if (error.code === 'auth/expired-action-code') {
          toast.error('Reset link has expired. Please request a new one.');
        } else if (error.code === 'auth/invalid-action-code') {
          toast.error('Invalid reset link. Please request a new one.');
        } else {
          toast.error('Invalid or expired reset link');
        }
        setValidLink(false);
      } finally {
        setValidating(false);
      }
    };

    validateResetCode();
  }, [oobCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!oobCode) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Confirm password reset
      await confirmPasswordReset(auth, oobCode, password);
      
      toast.success('Password reset successfully! Redirecting to login...');
      
      // Redirect to seller login after 2 seconds
      setTimeout(() => {
        router.push('/seller-login');
      }, 2000);

    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/expired-action-code') {
        toast.error('Reset link has expired. Please request a new one.');
      } else if (error.code === 'auth/invalid-action-code') {
        toast.error('Invalid reset link. Please request a new one.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!validLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid, expired, or your seller account is not activated.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/seller-forgot-password')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label="Request new password reset link"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => router.push('/seller-login')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Go back to seller login page"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
          <p className="text-gray-600 mt-2">
            Reset password for: <span className="font-semibold text-gray-800">{email}</span>
          </p>
        </div>
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter new password"
              minLength={6}
              required
              aria-label="Enter new password"
              aria-describedby="password-requirements"
            />
            <p id="password-requirements" className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters
            </p>
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              placeholder="Confirm new password"
              required
              aria-label="Confirm new password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={loading ? "Resetting password..." : "Reset password"}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/seller-login')}
            className="text-purple-600 hover:text-purple-700 hover:underline text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            aria-label="Back to seller login"
          >
            Back to Seller Login
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reset link...</p>
      </div>
    </div>
  );
}

export default function SellerResetPassword() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SellerResetPasswordContent />
    </Suspense>
  );
}