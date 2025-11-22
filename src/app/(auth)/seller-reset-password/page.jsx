"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firestore/firebase';
import { getSellerByEmail } from '@/lib/firestore/sellers/read';
import toast from 'react-hot-toast';

export default function SellerResetPassword() {
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
            toast.error('Seller account not activated');
            setValidLink(false);
          }
        } else {
          toast.error('No seller account found');
          setValidLink(false);
        }
      } catch (error) {
        console.error('Reset code validation error:', error);
        toast.error('Invalid or expired reset link');
        setValidLink(false);
      } finally {
        setValidating(false);
      }
    };

    validateResetCode();
  }, [oobCode]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
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
      
      toast.success('Password reset successfully!');
      
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
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/seller-forgot-password')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => router.push('/seller-login')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Set New Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Reset password for: <span className="font-semibold">{email}</span>
        </p>
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/seller-login')}
            className="text-purple-600 hover:underline text-sm"
          >
            Back to Seller Login
          </button>
        </div>
      </div>
    </div>
  );
}