import React from 'react';
import { useField } from 'formik';

const SelectField = ({ 
  label, 
  options, 
  containerClass = '',
  ...props 
}) => {
  const [field, meta] = useField(props);

  return (
    <div className={containerClass}>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-800 transition-all duration-200 focus:outline-none ${
          meta.touched && meta.error
            ? 'border-red-300 focus:border-red-500 bg-red-50'
            : 'border-gray-200 focus:border-teal-500 focus:bg-teal-50/30'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <span>{meta.error}</span>
        </div>
      ) : null}
    </div>
  );
};

export default SelectField;