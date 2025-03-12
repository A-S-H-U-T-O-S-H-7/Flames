import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const TimeRangeSelector = ({ timeRange, setTimeRange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const options = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (value) => {
    setTimeRange(value);
    setIsOpen(false);
  };

  // Find current label
  const currentLabel = options.find(option => option.value === timeRange)?.label || 'Select time range';

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex items-center justify-between bg-gray-900 rounded-md p-2 border border-cyan-500/30 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="mr-2 text-cyan-500">
            <Calendar size={16} />
          </div>
          <span className="text-white">{currentLabel}</span>
        </div>
        <ChevronDown size={16} className={`text-cyan-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-600 ${timeRange === option.value ? 'bg-blue-700 text-white' : 'text-white'}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;