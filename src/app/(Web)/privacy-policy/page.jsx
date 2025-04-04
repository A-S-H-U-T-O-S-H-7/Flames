import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-300 px-6 md:px-10 py-6 text-white">
          <h1 className="text-2xl md:text-3xl font-medium">Privacy Policy</h1>
          <p className="mt-1 text-purple-100 text-sm">Effective Date: 02-04-25</p>
        </div>
        
        {/* Content area */}
        <div className="p-6 md:p-8 bg-white">
          <p className="text-gray-700 leading-relaxed">
            Welcome to Flames! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, mobile application, or services.
          </p>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">1. Information We Collect</h2>
            <div className="mt-3 text-gray-700 space-y-2">
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3"><span className="font-medium">Personal Information:</span> Name, email, phone number, billing/shipping address, payment details, and any other details provided during purchase or account registration.</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3"><span className="font-medium">Non-Personal Information:</span> Browser type, IP address, cookies, and analytics data to enhance user experience.</div>
              </div>
            </div>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">2. How We Use Your Information</h2>
            <div className="mt-3 text-gray-700 space-y-2">
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Processing orders and payments</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Providing customer support</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Sending promotional emails and offers</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Improving our website and services</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Ensuring security and fraud prevention</div>
              </div>
            </div>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">3. Sharing Your Information</h2>
            <div className="mt-3 text-gray-700 space-y-2">
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3"><span className="font-medium">Service Providers:</span> Payment processors, shipping partners, and marketing tools</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3"><span className="font-medium">Legal Requirements:</span> If required by law, fraud prevention, or protecting our rights</div>
              </div>
            </div>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">4. Cookies and Tracking Technologies</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We use cookies to improve your experience, analyze traffic, and personalize content. You can manage cookie preferences in your browser settings.
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">5. Security of Your Data</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We implement security measures to protect your data, but no online transmission is 100% secure. Use our services at your own risk.
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">6. Your Rights</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              You may request to access, update, or delete your personal data by contacting us at flames.support@gmail.com
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">7. Changes to This Policy</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be posted on this page with the updated date.
            </p>
          </section>
          
          {/* Footer with subtle gradient */}
          <div className="mt-10 pt-4 border-t border-purple-100">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4 text-center">
              <p className="text-purple-700 text-sm">© {new Date().getFullYear()} Flames. All rights reserved.</p>
              <p className="text-purple-500 text-xs mt-1">Your data, our priority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;