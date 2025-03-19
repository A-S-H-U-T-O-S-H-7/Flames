"use client"
import React from 'react';
import { Award, Shield, Truck, Clock } from 'lucide-react';

const PremiumService = () => {
  const features = [
    { icon: Award, title: "Quality Guarantee", description: "Premium crafted products", color: "text-yellow-500" },
    { icon: Shield, title: "Secure Payments", description: "100% secure transaction", color: "text-blue-500" },
    { icon: Truck, title: "Free Shipping", description: "Free delivery on all orders", color: "text-green-500" },
    { icon: Clock, title: "24/7 Support", description: "Dedicated customer care", color: "text-red-500" }
  ];

  return (
    <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-6 border-y border-neutral-200">
      <div className="max-w-6xl mx-auto px-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {features.map(({ icon: Icon, title, description, color }, index) => (
            <div 
              key={`feature-${index}`}
              className="flex flex-col items-center text-center p-4 bg-white rounded-md shadow-md"
            >
              <div className="bg-neutral-100 p-3 rounded-full mb-2">
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <h4 className="text-sm font-medium text-neutral-900 mb-1">{title}</h4>
              <p className="text-xs text-neutral-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumService;
