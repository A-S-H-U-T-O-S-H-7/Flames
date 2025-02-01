"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Truck, Clock } from 'lucide-react';

const ShortService = () => {
  const features = [
    { icon: Award, title: "Quality Guarantee", description: "Premium crafted products" },
    { icon: Shield, title: "Secure Payments", description: "100% secure transaction" },
    { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
    { icon: Clock, title: "24/7 Support", description: "Dedicated customer care" }
  ];

  return (
    <section className="bg-gradient-to-r from-purple-100/50 to-purple-200/50 backdrop-blur-sm py-12 border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center p-6 bg-white/80 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <Icon className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-heading text-base font-semibold text-purple-800 mb-2">{title}</h4>
              <p className="font-body text-sm text-gray-600">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShortService;