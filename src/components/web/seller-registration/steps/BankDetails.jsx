import React from 'react';
import { Form } from 'formik';
import { CreditCard, Building2, MapPin, User } from 'lucide-react';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';
import { PLATFORM_FEES } from '@/utils/constants';

const BankDetails = ({ onBack }) => {
  return (
    <Form className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Bank & Tax Details
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            name="gstin"
            label="GSTIN (Optional)"
            placeholder="22AAAAA0000A1Z5"
            className="uppercase"
          />

          <SelectField
            name="platformFee"
            label="Platform Fee *"
            options={PLATFORM_FEES}
          />
        </div>

        <div className="bg-teal-50 rounded-2xl p-4 border-2 border-teal-200">
          <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Bank Account Information
          </h3>

          <div className="space-y-4">
            <InputField
              name="accountHolder"
              label="Account Holder Name *"
              icon={User}
              placeholder="As per bank records"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                name="accountNumber"
                label="Account Number *"
                placeholder="XXXXXXXXXX"
                inputMode="numeric"
              />

              <InputField
                name="ifscCode"
                label="IFSC Code *"
                placeholder="SBIN0001234"
                className="uppercase"
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <InputField
              name="bankName"
              label="Bank Name *"
              icon={Building2}
              placeholder="e.g., State Bank of India"
            />

            <InputField
              name="bankBranch"
              label="Bank Branch *"
              icon={MapPin}
              placeholder="e.g., Mumbai Main Branch"
            />
            </div>

            <InputField
              name="upiId"
              label="UPI ID (Optional)"
              placeholder="username@upi"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
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
          Next Step →
        </button>
      </div>
    </Form>
  );
};

export default BankDetails;