import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-300 px-6 md:px-10 py-6 text-white">
          <h1 className="text-2xl md:text-3xl font-medium">Terms of Service</h1>
          <p className="mt-1 text-purple-100 text-sm">Effective Date: 02-04-25 </p>
        </div>
        
        {/* Content area */}
        <div className="p-6 md:p-8 bg-white">
          <p className="text-gray-700 leading-relaxed">
            These Terms of Service govern your use of Flames' website, mobile app, and services. By using our platform, you agree to these terms.
          </p>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">1. Use of Our Services</h2>
            <div className="mt-3 text-gray-700 space-y-2">
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">You must be at least 18 years old or have parental consent to use our services.</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">You agree to provide accurate and complete information when creating an account.</div>
              </div>
            </div>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">2. Orders and Payments</h2>
            <div className="mt-3 text-gray-700 space-y-2">
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Prices and availability of products are subject to change without notice.</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">We reserve the right to refuse or cancel any order for reasons such as fraud, pricing errors, or stock unavailability.</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Payments must be made through our accepted methods (e.g., Razorpay, credit/debit cards, UPI, etc.).</div>
              </div>
            </div>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">3. Shipping and Returns</h2>
            <div className="mt-3 text-gray-700 space-y-2">
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">We aim to deliver products within the estimated time, but delays may occur.</div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 text-purple-400">•</div>
                <div className="ml-3">Return and exchange policies are available at [Insert Return Policy Link].</div>
              </div>
            </div>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">4. Intellectual Property</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              All content on our website, including logos, images, and text, is the property of Flames and may not be used without permission.
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">5. Limitation of Liability</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Flames is not responsible for any indirect or consequential damages arising from the use of our services.
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">6. Termination</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your access if you violate these terms.
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">7. Governing Law</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              These terms are governed by the laws of [Your Country/State]. Any disputes will be resolved in the courts of [Your Location].
            </p>
          </section>
          
          <section className="mt-6">
            <h2 className="text-lg md:text-xl font-medium text-purple-700 border-b border-purple-100 pb-2">8. Contact Us</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              For any questions regarding these policies, contact us at flames.support@gmail.com .
            </p>
          </section>
          
          {/* Footer with subtle gradient */}
          <div className="mt-10 pt-4 border-t border-purple-100">
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-4 text-center">
              <p className="text-purple-700 text-sm">© {new Date().getFullYear()} Flames. All rights reserved.</p>
              <p className="text-purple-500 text-xs mt-1">Made with ♥ in Bangalore</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;