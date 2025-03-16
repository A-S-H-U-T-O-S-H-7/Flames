import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

const TimeRangeSelector = ({ timeRange, setTimeRange, startDate, endDate, onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDateLocal, endDateLocal] = dateRange;
  const dropdownRef = useRef(null);
  
  const options = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom Range' }
  ];

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
    if (value === 'custom') {
      setShowDatePicker(true);
    } else {
      setTimeRange(value);
      setShowDatePicker(false);
    }
    setIsOpen(false);
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      onDateRangeChange(update[0], update[1]);
      setTimeRange('custom');
    }
  };

  // Find current label
  const getCurrentLabel = () => {
    if (timeRange === 'custom' && startDate && endDate) {
      return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
    }
    return options.find(option => option.value === timeRange)?.label || 'Select time range';
  };

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
          <span className="text-white">{getCurrentLabel()}</span>
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

      {showDatePicker && (
        <div className="absolute z-20 mt-1 right-0">
          <div className="bg-gray-800 p-4 rounded-md shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white">Select Date Range</span>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <DatePicker
              selectsRange={true}
              startDate={startDateLocal}
              endDate={endDateLocal}
              onChange={handleDateRangeChange}
              inline
              className="bg-gray-800"
              calendarClassName="bg-gray-800 border-gray-700"
              dayClassName={() => "text-white hover:bg-blue-600"}
              monthClassName={() => "text-white"}
              wrapperClassName="bg-gray-800"
              popperPlacement="bottom-end"
              popperModifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                    altAxis: true,
                  },
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;