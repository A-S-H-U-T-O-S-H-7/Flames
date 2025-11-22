"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firestore/firebase';
import { getSellerByEmail } from '@/lib/firestore/sellers/read';
import toast from 'react-hot-toast';

export default function SellerForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Check if email belongs to an approved seller
      const sellerResult = await getSellerByEmail(email);
      
      if (!sellerResult.success) {
        toast.error('No seller account found with this email');
        setLoading(false);
        return;
      }

      const seller = sellerResult.data;

      // 2. Check if seller is approved and activated
      if (seller.status !== 'approved' || !seller.sellerCredentials?.isActivated) {
        toast.error('Seller account not activated yet');
        setLoading(false);
        return;
      }

      if (seller.sellerCredentials?.isSuspended) {
        toast.error('Seller account is suspended. Please contact support.');
        setLoading(false);
        return;
      }

      // 3. Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');

    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No seller account found with this email');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-2">
            We've sent a password reset link to:
          </p>
          <p className="font-semibold text-purple-600 mb-4">{email}</p>
          <p className="text-sm text-gray-500 mb-6">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Resend Email
            </button>
            <Link
              href="/seller-login"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Reset Seller Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your seller email to receive a reset link
        </p>
        
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seller Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your registered email"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/seller-login"
            className="block text-purple-600 hover:underline text-sm"
          >
            Back to Seller Login
          </Link>
          <p className="text-xs text-gray-500">
            Don't have a seller account? <Link href="/seller/registration" className="text-purple-600 hover:underline">Apply here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}