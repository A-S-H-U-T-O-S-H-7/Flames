import React from 'react';
import { useField } from 'formik';
import { AlertCircle } from 'lucide-react';

const InputField = ({ 
  label, 
  icon: Icon, 
  containerClass = '',
  as = 'input',
  ...props 
}) => {
  const [field, meta] = useField(props);
  
  const InputComponent = as;

  return (
    <div className={containerClass}>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        <InputComponent
          {...field}
          {...props}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-2 border-2 text-gray-800 rounded-xl transition-all duration-200 focus:outline-none ${
            meta.touched && meta.error
              ? 'border-red-300 focus:border-red-500 bg-red-50'
              : 'border-gray-200 focus:border-teal-500 focus:bg-teal-50/30'
          } ${as === 'textarea' ? 'resize-none' : ''}`}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{meta.error}</span>
        </div>
      ) : null}
    </div>
  );
};

export default InputField;