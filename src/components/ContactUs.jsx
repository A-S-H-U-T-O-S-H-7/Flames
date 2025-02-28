'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form Submitted:', form);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 px-6 py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-purple-500 text-4xl font-heading font-bold">Get in Touch</h1>
        <p className="text-gray-600 text-lg font-body mt-2">We would love to hear from you!</p>
      </motion.div>

      {/* Contact Form */}
      <motion.form 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Message</label>
          <textarea 
            name="message" 
            rows="4" 
            value={form.message} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 transition duration-300"
        >
          Send Message
        </button>
      </motion.form>

      {/* Contact Info */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-700 font-body">Email: contact@flamesfashion.com</p>
        <p className="text-gray-700 font-body">Phone: +91 98765 43210</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="text-purple-500 hover:text-purple-700 text-xl">🔗 Facebook</a>
          <a href="#" className="text-purple-500 hover:text-purple-700 text-xl">🔗 Instagram</a>
          <a href="#" className="text-purple-500 hover:text-purple-700 text-xl">🔗 Twitter</a>
        </div>
      </motion.div>
    </div>
  );
}
