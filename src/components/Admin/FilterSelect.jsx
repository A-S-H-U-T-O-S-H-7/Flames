"use client";

import { Filter } from "lucide-react";

export default function FilterSelect({ 
  value, 
  onChange, 
  options,
  displayField = "label",
  valueField = "value",
  defaultOptionLabel = "All",
  icon = <Filter size={18} />,
  className = ""
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#283548] text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#22c7d5] shadow-sm appearance-none"
      >
        {options.map((option) => {
          // Handle both object options and string options
          const optionValue = typeof option === 'object' ? option[valueField] : option;
          const optionLabel = typeof option === 'object' ? option[displayField] : 
            (optionValue === 'all' ? defaultOptionLabel : option);
          
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
        {icon}
      </div>
    </div>
  );
}