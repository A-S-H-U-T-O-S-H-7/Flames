import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, Instagram, Twitter, Youtube, 
  Mail, Phone, MapPin, Send, Award, 
  Shield, Truck, Clock, Heart 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const socialLinks = [
    { icon: Facebook, link: "#", color: "text-blue-600" },
    { icon: Instagram, link: "#", color: "text-pink-600" },
    { icon: Twitter, link: "#", color: "text-sky-500" },
    { icon: Youtube, link: "#", color: "text-red-600" }
  ];

  const features = [
    { icon: Award, title: "Quality Guarantee", description: "Premium crafted products" },
    { icon: Shield, title: "Secure Payments", description: "100% secure transaction" },
    { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
    { icon: Clock, title: "24/7 Support", description: "Dedicated customer care" }
  ];

  const handleSubscribe = () => {
    if (email) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-800 shadow-2xl">
      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/60 backdrop-blur-sm py-8"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4 p-4 bg-purple-50/50 rounded-lg shadow-md"
            >
              <Icon className="h-8 w-8 text-purple-600" />
              <div>
                <h4 className="font-semibold text-purple-800">{title}</h4>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-purple-700 flex items-center">
              <Heart className="mr-2 text-red-500" /> BohuRani
            </h2>
            <p className="text-sm text-gray-600">Discover unique cultural jewelry and artisan gifts</p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, link, color }, index) => (
                <motion.a 
                  key={index} 
                  href={link}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${color} hover:opacity-80 transition`}
                >
                  <Icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links & Customer Service */}
          {[
            { 
              title: "Quick Links", 
              links: [
                { name: "About Us", href: "/about" },
                { name: "Our Partners", href: "/partners" },
                { name: "Blog", href: "/blog" },
                { name: "Contact", href: "/contact" }
              ]
            },
            { 
              title: "Customer Service", 
              links: [
                { name: "Shipping", href: "/shipping" },
                { name: "Returns", href: "/returns" },
                { name: "FAQ", href: "/faq" },
                { name: "Track Order", href: "/track" }
              ]
            }
          ].map(({ title, links }, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-lg text-purple-700">{title}</h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    whileHover={{ x: 10, color: "#7c3aed" }}
                    className="text-gray-600 hover:text-purple-600 transition"
                  >
                    <a href={link.href}>{link.name}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-lg text-purple-700">Stay Connected</h3>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email for updates"
                className="w-full px-4 py-2 rounded-full border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
              <motion.button 
                onClick={handleSubscribe}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-green-100 text-green-800 p-2 rounded-lg text-sm mt-2"
                >
                  Thanks for subscribing!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-purple-100/50 py-6 border-t border-purple-200"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">© 2024 BohuRani. All cultural treasures reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {["Privacy", "Terms", "Sitemap"].map((item, index) => (
              <motion.a 
                key={index}
                href={`/${item.toLowerCase()}`}
                whileHover={{ scale: 1.1 }}
                className="text-purple-700 hover:text-purple-900 text-sm"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;