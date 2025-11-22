"use client";

import React from 'react';
import HeroSection from '@/components/web/seller-registration/HeroSection';
import SellerRegistrationForm from '@/components/web/seller-registration/SellerRegistrationForm';
const SellerRegistrationPage = () => {
  return (
    <div className="min-h-[55vh] pt-2 md:pt-5 bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <HeroSection />
      
      <section id="seller-form" className="max-w-6xl mx-auto -mt-2 sm:-mt-4 relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <SellerRegistrationForm />
      </section>
    </div>
  );
};

export default SellerRegistrationPage;