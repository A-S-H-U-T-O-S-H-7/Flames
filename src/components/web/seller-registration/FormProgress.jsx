import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const FormProgress = ({ currentStep, steps }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="my-6 sm:my-8 px-2 md:px-6 sm:px-8">
      <div className="relative max-w-2xl mx-auto">
        {/* Steps positioned at start, middle, and end */}
        <div className="relative flex justify-between items-start">
          {/* Background line - connects center of first and last step */}
          <div 
            className="absolute h-1 bg-gray-200 rounded z-0"
            style={{
              top: '20px', // Half of step circle height (40px/2)
              left: '43px', // Half of first circle (40px/2)
              right: '20px' // Half of last circle (40px/2)
            }}
          />

          {/* Progress line */}
          <div
            className="absolute h-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded transition-all duration-300 z-0"
            style={{ 
              top: '20px',
              left: '43px',
              right: '20px',
              width: `${progressWidth}%`,
              maxWidth: 'calc(100% - 60px)'
            }}
          />

          {/* Steps */}
          {steps.map((step) => (
            <div 
              key={step.number} 
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium text-center whitespace-nowrap ${
                  currentStep >= step.number ? 'text-teal-600' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormProgress;