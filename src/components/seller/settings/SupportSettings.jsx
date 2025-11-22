"use client";

import { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useSeller } from '@/lib/firestore/sellers/read';
import { createSupportTicket } from '@/lib/firestore/sellerSupport/write';

export default function SupportSettings() {
  const { user } = useAuth();
  const { data: seller } = useSeller({ email: user?.email });
  
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill seller details
  useEffect(() => {
    if (seller) {
      setSupportForm(prev => ({
        ...prev,
        name: seller.name || seller.businessName || user?.displayName || '',
        email: seller.email || user?.email || ''
      }));
    } else if (user) {
      setSupportForm(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [seller, user]);

  const handleInputChange = (field, value) => {
    setSupportForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const ticketData = {
        userId: user?.uid,
        userName: supportForm.name,
        userEmail: supportForm.email,
        subject: supportForm.subject,
        message: supportForm.message,
        category: supportForm.category,
        userType: 'seller'
      };

      const result = await createSupportTicket(ticketData);
      
      if (result.success) {
        toast.success(`Support ticket created successfully! Ticket Number: ${result.ticketNumber}`);
        
        // Reset form but keep auto-filled data
        setSupportForm(prev => ({
          ...prev,
          subject: '',
          message: '',
          category: 'general'
        }));
      } else {
        toast.error(`Failed to create support ticket: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to submit support request. Please try again.');
      console.error('Support form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+91 9556508941',
      action: 'Call Now',
      href: 'tel:+919556508941'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'ashutoshmohanty13703@gmail.com',
      action: 'Send Email',
      href: 'mailto:ashutoshmohanty13703@gmail.com'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: '+91 9556508941',
      action: 'Message on WhatsApp',
      href: 'https://wa.me/919556508941'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Support</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Get help and contact our support team
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600 text-center">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <method.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{method.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{method.description}</p>
            <a
              href={method.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200 text-sm font-medium"
            >
              {method.action}
            </a>
          </div>
        ))}
      </div>

      {/* Support Form */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Send us a Message
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={supportForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={supportForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={supportForm.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing & Payments</option>
                <option value="feature">Feature Request</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={supportForm.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Subject of your message"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Message
            </label>
            <textarea
              value={supportForm.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your issue or suggestion in detail..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}