"use client";
import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaCheckCircle,
  FaWhatsapp
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { addFeedback } from "@/lib/firestore/suggestions/write";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState({
    sending: false,
    success: false,
    error: false,
    errorMessage: ""
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormStatus({
      sending: true,
      success: false,
      error: false,
      errorMessage: ""
    });

    try {
      const uid = "anonymous-user"; // Replace with actual auth.currentUser?.uid in production

      // Call the addSuggestion function to store data in Firestore
      await addFeedback({
        displayName: formData.name,
        message: formData.message,
        uid: uid,
        email: formData.email,
        phone: formData.phone, // Add phone number
        type: "feedback" // Set type to feedback as requested
      });

      // Reset form and show success
      setFormData({ name: "", email: "", phone: "", message: "" });
      setFormStatus({
        sending: false,
        success: true,
        error: false,
        errorMessage: ""
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setFormStatus({
          sending: false,
          success: false,
          error: false,
          errorMessage: ""
        });
      }, 3000);
    } catch (error) {
      setFormStatus({
        sending: false,
        success: false,
        error: true,
        errorMessage:
          error.message || "Failed to send your message. Please try again."
      });
    }
  };

  const contactDetails = [
    {
      Icon: FaPhone,
      text: "+91 9556508941",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500",
      hoverBg: "hover:bg-teal-100"
    },
    {
      Icon: FaEnvelope,
      text: "flames.support@gmail.com",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
      hoverBg: "hover:bg-purple-100"
    },
    {
      Icon: FaMapMarkerAlt,
      text: " Bangalore",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      hoverBg: "hover:bg-amber-100"
    }
  ];

  const socialLinks = [
    {
      Icon: FaFacebook,
      color: "text-blue-500 hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
      link: "#facebook"
    },
    {
      Icon: FaXTwitter,
      color: "text-gray-700 hover:text-gray-800",
      bgColor: "hover:bg-gray-100",
      link: "#twitter"
    },
    {
      Icon: FaInstagram,
      color: "text-pink-500 hover:text-pink-600",
      bgColor: "hover:bg-pink-50",
      link: "#instagram"
    },
    {
      Icon: FaLinkedin,
      color: "text-indigo-500 hover:text-indigo-600",
      bgColor: "hover:bg-indigo-50",
      link: "#linkedin"
    },
    {
      Icon: FaWhatsapp,
      color: "text-green-500 hover:text-green-600",
      bgColor: "hover:bg-green-50",
      link: "#whatsapp"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const formItemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {mounted &&
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-gray-100"
        >
          {/* Left section - Contact Information */}
          <div className="w-full md:w-2/5 p-6 sm:p-8 lg:p-10 bg-white relative">
            {/* Decorative element */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-teal-50 z-0" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-purple-50 z-0" />

            <div className="relative z-10 space-y-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-800 mb-4">
                  Let's Connect
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-purple-500 rounded-full mb-4" />
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  Have a question or want to collaborate? We'd love to hear from
                  you. Reach out using the form or contact us directly.
                </p>
              </motion.div>

              <div className="space-y-4 mt-8">
                {contactDetails.map(
                  ({ Icon, text, bgColor, iconColor, hoverBg }, index) =>
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`flex items-center space-x-4 p-4 ${bgColor} ${hoverBg} rounded-xl transition duration-300`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm ${iconColor}`}
                      >
                        <Icon className="text-xl" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-700">
                        {text}
                      </span>
                    </motion.div>
                )}
              </div>

              <motion.div
                variants={itemVariants}
                className="pt-6 mt-4 border-t border-gray-100"
              >
                <h3 className="text-base sm:text-lg font-heading font-semibold text-gray-700 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4 sm:space-x-5">
                  {socialLinks.map(({ Icon, color, bgColor, link }, index) =>
                    <a
                      key={index}
                      href={link}
                      className={`p-3 rounded-full ${color} ${bgColor} border border-gray-100 transition transform hover:scale-110 hover:shadow-sm`}
                    >
                      <Icon />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right section - Contact Form */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 lg:p-10 bg-gray-50 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-30 z-0 overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0H100V100H0V0Z"
                  fill="url(#paint0_radial)"
                  fillOpacity="0.1"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(50 50) rotate(90) scale(50)"
                  >
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots" />
            </div>

            <div className="relative z-10">
              <motion.h2
                variants={formItemVariants}
                className="text-2xl sm:text-3xl font-heading font-bold text-gray-800 mb-2"
              >
                Message Us
              </motion.h2>

              <motion.p
                variants={formItemVariants}
                className="text-gray-500 mb-6"
              >
                Fill out the form below and we'll respond within 24 hours
              </motion.p>

              {/* Centered success message with improved visibility */}
              {formStatus.success &&
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 bg-green-50 p-6 rounded-lg border border-green-100 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <FaCheckCircle className="text-3xl text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </motion.div>}

              {formStatus.error &&
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                  <p className="text-red-700">
                    {formStatus.errorMessage}
                  </p>
                </div>}

              {!formStatus.success &&
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                >
                  {/* Name field */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                      required
                    />
                  </motion.div>

                  {/* Email field with validation */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full p-3 sm:p-4 text-gray-800 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent text-sm sm:text-base transition duration-200 ${formData.email &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                        ? "border-red-400"
                        : "border-gray-200"}`}
                      required
                    />
                    {formData.email &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a valid email address
                      </p>}
                  </motion.div>

                  {/* Phone field with number validation */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={e => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange({
                          target: {
                            name: "phone",
                            value: value
                          }
                        });
                      }}
                      placeholder="Enter your phone number (10 digits)"
                      className={`w-full p-3 sm:p-4 text-gray-800 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent text-sm sm:text-base transition duration-200 ${formData.phone &&
                      formData.phone.length !== 10
                        ? "border-red-400"
                        : "border-gray-200"}`}
                      maxLength={10}
                      required
                    />
                    {formData.phone &&
                      formData.phone.length !== 10 &&
                      <p className="text-red-500 text-sm mt-1">
                        Phone number must be exactly 10 digits
                      </p>}
                  </motion.div>

                  {/* Message field */}
                  <motion.div variants={formItemVariants}>
                    <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter your message"
                      className="w-full p-3 sm:p-4 text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent text-sm sm:text-base transition duration-200"
                      required
                    />
                  </motion.div>

                  <motion.button
                    variants={formItemVariants}
                    type="submit"
                    disabled={
                      formStatus.sending ||
                      (formData.phone && formData.phone.length !== 10) ||
                      (formData.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                    }
                    className={`
            w-full p-3 sm:p-4 rounded-xl text-sm sm:text-base font-semibold transition duration-300
            ${formStatus.sending ||
            (formData.phone && formData.phone.length !== 10) ||
            (formData.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-400 to-purple-500 text-white shadow-md hover:shadow-lg"}
            flex items-center justify-center space-x-2
          `}
                    whileHover={{ scale: formStatus.sending ? 1 : 1.02 }}
                    whileTap={{ scale: formStatus.sending ? 1 : 0.98 }}
                  >
                    {formStatus.sending ? "Sending..." : "Send Message"}
                    {!formStatus.sending && <FaPaperPlane className="ml-2" />}
                  </motion.button>
                </form>}

              {/* Add a button to reset form after successful submission */}
              {formStatus.success &&
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => {
                    // Reset form status and data
                    setFormStatus({
                      sending: false,
                      success: false,
                      error: false,
                      errorMessage: ""
                    });
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      message: ""
                    });
                  }}
                  className="mt-6 p-3 w-full sm:w-auto bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition duration-200 font-medium flex items-center justify-center"
                >
                  Send Another Message
                </motion.button>}
            </div>
          </div>
        </motion.div>}
    </div>
  );
};

export default ContactUs;
