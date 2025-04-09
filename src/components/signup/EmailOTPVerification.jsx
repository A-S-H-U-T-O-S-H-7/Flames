import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

const EmailOTPVerification = ({ email, verifyEmail, setVerifyEmail, isVerified, setIsVerified }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRefs = useRef([]);

  // Handle resend timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Function to generate and send OTP
  const handleSendOTP = () => {
    if (!email) {
      toast.error("Please enter an email address first");
      return;
    }
    setSendingOtp(true);
    
    // TODO: Replace with your actual OTP sending logic
    // Mock sending OTP to email
    setTimeout(() => {
      // Generate a random 6-digit OTP (for demo purposes)
      const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
      console.log("Generated OTP (for testing):", generatedOtp); // For testing only, remove in production
      toast.success(`OTP sent to ${email}`);
      setOtpSent(true);
      setSendingOtp(false);
      setTimeLeft(60); // Set 60-second cooldown for resend
      
      // In a real implementation, you would send this OTP to the user's email
      // via your backend service
    }, 1500);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle paste event for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
    }
  };

  // Handle keydown for backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    
    setVerificationLoading(true);
    
    // TODO: Replace with your actual OTP verification logic
    // Mock OTP verification process
    setTimeout(() => {
      // For demo, we're assuming the OTP is correct
      // In production, you would verify against the sent OTP
      toast.success("Email verified successfully!");
      setVerificationLoading(false);
      setIsVerified(true);
      setVerifyEmail(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-purple-50 p-4 rounded-2xl border border-purple-100 shadow-sm"
    >
      <div className="flex items-start mb-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-2">
          <h3 className="text-sm font-medium text-purple-800">Email Verification</h3>
          <p className="text-xs text-purple-600 mt-0.5">We'll send a 6-digit code to verify your email</p>
        </div>
      </div>

      {!otpSent ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2"
        >
          <Button
            isLoading={sendingOtp}
            isDisabled={!email || sendingOtp}
            onClick={handleSendOTP}
            className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            {sendingOtp ? "Sending OTP..." : "Send Verification Code"}
          </Button>
        </motion.div>
      ) : isVerified ? (
        <div className="flex items-center justify-between bg-green-50 py-2 px-3 rounded-xl border border-green-100">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-sm font-medium text-green-700">Email Verified</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="my-2 flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-12 text-center text-lg font-bold text-purple-700 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300"
                  whileFocus={{ scale: 1.05 }}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                />
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-gray-500 mt-2"
            >
              Enter the 6-digit code sent to {email}
            </motion.p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                isLoading={verificationLoading}
                isDisabled={verificationLoading || otp.join('').length !== 6}
                onClick={handleVerifyOTP}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center justify-center"
              >
                {verificationLoading ? "Verifying..." : "Verify"}
              </Button>
            </motion.div>
            
            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={handleSendOTP}
                disabled={timeLeft > 0 || sendingOtp}
                className={`text-xs font-medium ${
                  timeLeft > 0 || sendingOtp
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-purple-600 hover:text-purple-700"
                }`}
                whileHover={timeLeft > 0 ? {} : { scale: 1.05 }}
              >
                {timeLeft > 0
                  ? `Resend in ${timeLeft}s`
                  : sendingOtp
                  ? "Sending..."
                  : "Resend Code"}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmailOTPVerification;