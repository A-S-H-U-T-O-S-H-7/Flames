import React from 'react';
import { Form } from 'formik';
import { FileText, User, CreditCard, Camera, CheckCircle2 } from 'lucide-react';
import FileUploadField from '../fields/FileUploadField';

const DocumentUpload = ({ onBack }) => {
  return (
    <Form className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Upload Documents
        </h2>
        <p className="text-sm text-gray-600 mt-1">Please upload the required documents to complete your registration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <FileUploadField
          name="profileImage"
          label="Profile Image"
          icon={User}
          accept=".jpg,.jpeg,.png"
        />
        <FileUploadField
          name="businessLogo"
          label="Business Logo (Optional)"
          icon={Camera}
          accept=".jpg,.jpeg,.png"
        />
        <FileUploadField
          name="businessLicense"
          label="Business License / GST Certificate (Optional)"
          icon={FileText}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <FileUploadField
          name="aadhaarCard"
          label="Aadhaar Card *"
          icon={User}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <FileUploadField
          name="panCard"
          label="PAN Card *"
          icon={CreditCard}
          accept=".pdf,.jpg,.jpeg,.png"
        />

        

        
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200 mb-6">
        <p className="text-sm text-gray-700 flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <span>
            Your information is securely encrypted and will be reviewed within 24-48 hours. 
            We'll notify you via email once your seller account is approved.
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 rounded-xl text-teal-600 font-semibold border-2 border-teal-200 hover:bg-teal-50 transition-all duration-200"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Submit Registration ✓
        </button>
      </div>
    </Form>
  );
};

export default DocumentUpload;