import React from 'react';

const FormStep = ({ 
  children, 
  isActive = false,
  
}) => {
  if (!isActive) return null;

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

export default FormStep;