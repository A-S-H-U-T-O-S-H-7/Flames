import React from 'react';
import { Clock, CheckCircle, XCircle, Home, BarChart3, Mail, Ban, ArrowRight } from 'lucide-react';
import './smooth-transitions.css';

const SellerStatusPage = ({ status, sellerId, onGoToDashboard, onGoToHome }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          iconColor: 'text-amber-500',
          bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
          borderColor: 'border-amber-200',
          title: 'Application Under Review',
          message: 'Your seller application is currently under review. Our team will evaluate your submission and get back to you within 24-48 hours.',
          subMessage: `Application ID: ${sellerId}`,
          buttonText: 'Go to Home',
          buttonAction: onGoToHome,
          buttonIcon: Home,
          gradient: 'from-amber-500 to-orange-500',
          statusColor: 'text-amber-600'
        };

      case 'approved':
        return {
          icon: CheckCircle,
          iconColor: 'text-emerald-500',
          bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          title: 'Congratulations! Application Approved',
          message: 'Your seller application has been approved! Please set up your seller credentials to activate your account and access the seller dashboard.',
          subMessage: 'You will be redirected to the activation page automatically.',
          buttonText: 'Go to Dashboard',
          buttonAction: onGoToDashboard,
          buttonIcon: BarChart3,
          secondaryButtonText: 'Go to Home',
          secondaryButtonAction: onGoToHome,
          gradient: 'from-emerald-500 to-teal-500',
          statusColor: 'text-emerald-600'
        };

      case 'suspended':
        return {
          icon: Ban,
          iconColor: 'text-amber-500',
          bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
          borderColor: 'border-amber-200',
          title: 'Account Suspended',
          message: 'Your seller account has been temporarily suspended. Please contact support for more information and to resolve this issue.',
          subMessage: 'Support: support@flames.com | +1-800-FLAMES',
          buttonText: 'Contact Support',
          buttonAction: onGoToHome,
          buttonIcon: Mail,
          secondaryButtonText: 'Go to Home',
          secondaryButtonAction: onGoToHome,
          gradient: 'from-amber-500 to-orange-500',
          statusColor: 'text-amber-600'
        };

      case 'rejected':
        return {
          icon: XCircle,
          iconColor: 'text-rose-500',
          bgColor: 'bg-gradient-to-br from-rose-50 to-pink-50',
          borderColor: 'border-rose-200',
          title: 'Application Not Approved',
          message: "We appreciate your interest, but your application didn't meet our current criteria. Please review our seller guidelines and feel free to apply again in the future.",
          subMessage: 'Support: support@flames.com | +1-800-FLAMES',
          buttonText: 'Go to Home',
          buttonAction: onGoToHome,
          buttonIcon: Home,
          gradient: 'from-rose-500 to-pink-500',
          statusColor: 'text-rose-600'
        };

      default:
        return {
          icon: Clock,
          iconColor: 'text-slate-500',
          bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
          borderColor: 'border-slate-200',
          title: 'Status Unknown',
          message: 'We are checking your application status. Please refresh the page or contact support if this persists.',
          subMessage: '',
          buttonText: 'Go to Home',
          buttonAction: onGoToHome,
          buttonIcon: Home,
          gradient: 'from-slate-500 to-gray-500',
          statusColor: 'text-slate-600'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;
  const ButtonIcon = config.buttonIcon;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-0 md:p-6 bg-gradient-to-br from-slate-50 to-gray-100 animate-fadeIn">
      <div className={` w-full ${config.bgColor} rounded-3xl border ${config.borderColor} shadow-2x p-2 md:p-8 text-center animate-scaleIn relative overflow-hidden`}>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r via-transparent ${config.gradient}"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/20 blur-xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-white/20 blur-xl"></div>

        {/* Icon Container */}
        <div className="relative mb-8">
          <div className="relative w-22 h-22 md:w-28 md:h-28 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 transform rotate-3">
            <div className="absolute -inset-4 bg-white/50 rounded-2xl blur-sm transform -rotate-3"></div>
            <IconComponent className={`w-12 h-12 ${config.iconColor} relative z-10 transform -rotate-3`} />
          </div>
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border ${config.borderColor} shadow-sm mt-4 ${config.statusColor}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            <span className="text-sm font-semibold capitalize">{status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative space-y-6">
          {/* Title */}
          <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {config.title}
          </h2>

          {/* Main Message */}
          <p className="text-gray-600 leading-relaxed text-base md:text-lg font-medium">
            {config.message}
          </p>

          {/* Sub Message */}
          {config.subMessage && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500 font-medium">
                {config.subMessage}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {/* Primary Button */}
            {config.buttonText && config.buttonAction && (
              <button
                onClick={config.buttonAction}
                className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r ${config.gradient} hover:brightness-110 min-w-[180px]`}
              >
                {ButtonIcon && <ButtonIcon className="w-5 h-5" />}
                {config.buttonText}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Secondary Button (Go to Home) */}
            {config.secondaryButtonText && config.secondaryButtonAction && (
              <button
                onClick={config.secondaryButtonAction}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-white hover:border-gray-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
              >
                <Home className="w-5 h-5" />
                {config.secondaryButtonText}
              </button>
            )}

            {/* Fallback Home Button for cases without secondary button */}
            {!config.secondaryButtonText && config.buttonText !== 'Go to Home' && (
              <button
                onClick={onGoToHome}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-white hover:border-gray-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </button>
            )}
          </div>

          {/* Additional Info for Specific Statuses */}
          {(status === 'pending' || status === 'approved') && (
            <div className="mt-8 pt-6 border-t border-gray-200/60">
              <p className="text-sm text-gray-500 font-medium">
                {status === 'pending' 
                  ? 'You will receive an email notification once your application is reviewed.'
                  : 'Check your email for detailed activation instructions.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerStatusPage;