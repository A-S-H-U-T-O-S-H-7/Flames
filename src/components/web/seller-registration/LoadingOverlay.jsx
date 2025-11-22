import React from 'react';
import { Loader, Upload, Database, CheckCircle2 } from 'lucide-react';
import './smooth-transitions.css';

const LoadingOverlay = ({ isVisible = false, currentStep = 0 }) => {
  if (!isVisible) return null;

  const steps = [
    { icon: Upload, text: 'Uploading documents...', color: 'text-blue-600' },
    { icon: Database, text: 'Saving your information...', color: 'text-purple-600' },
    { icon: CheckCircle2, text: 'Finalizing registration...', color: 'text-green-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scaleIn">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Processing Your Registration
          </h3>

          <div className="space-y-3 mb-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg loading-step-transition ${
                    isActive ? 'bg-blue-50 animate-slideUp' : isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                    } ${isActive ? 'animate-pulse-slow' : ''}`} />
                  </div>
                  <span className={`text-sm ${
                    isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {step.text}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="ml-auto">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-gray-600 text-sm">
            Please don't close this window. This may take a few moments...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;