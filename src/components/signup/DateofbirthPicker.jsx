import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DateOfBirthPicker = ({ dob, setDob }) => {
  // Initialize state from existing dob prop if available
  const [day, setDay] = useState(dob ? dob.getDate().toString() : "");
  const [month, setMonth] = useState(dob ? (dob.getMonth() + 1).toString() : "");
  const [year, setYear] = useState(dob ? dob.getFullYear().toString() : "");
  
  // Track when user has manually changed values
  const [isDirty, setIsDirty] = useState(false);

  // Update parent component's DOB only when values change manually
  useEffect(() => {
    if (!isDirty) return;
    
    if (day && month && year) {
      // Check if date is valid before setting
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(dateObj.getTime()) && 
          dateObj.getDate() === parseInt(day)) { // This checks for invalid dates like Feb 30
        setDob(dateObj);
      }
    }
  }, [day, month, year, isDirty]);

  // Update local state when prop changes, but don't trigger setDob
  useEffect(() => {
    if (dob && !isDirty) {
      setDay(dob.getDate().toString());
      setMonth((dob.getMonth() + 1).toString());
      setYear(dob.getFullYear().toString());
    }
  }, [dob]);

  // Handle field changes
  const handleDayChange = (e) => {
    setDay(e.target.value);
    setIsDirty(true);
  };
  
  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setIsDirty(true);
  };
  
  const handleYearChange = (e) => {
    setYear(e.target.value);
    setIsDirty(true);
  };

  // Generate options for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
      <div className="grid grid-cols-3 gap-2">
        {/* Day selector */}
        <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
          <select
            value={day}
            onChange={handleDayChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Month selector */}
        <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
          <select
            value={month}
            onChange={handleMonthChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Year selector */}
        <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
          <select
            value={year}
            onChange={handleYearChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DateOfBirthPicker;