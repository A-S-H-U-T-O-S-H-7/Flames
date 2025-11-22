import { useEffect } from 'react';
import { Form } from 'formik';
import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import InputField from '../fields/InputField';
import SelectField from '../fields/SelectField';
import { BUSINESS_TYPES } from '@/utils/constants';
import { useFormikContext } from 'formik';
import { useAuth } from '@/context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';

const BusinessPersonalInfo = () => {
  const { setFieldValue, values } = useFormikContext();
  const { user } = useAuth();

  // Phone Number Input Handler
  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFieldValue('phone', value);
    }
  };

  // PAN Number Input Handler
  const handlePanInput = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 10);
    setFieldValue('panNumber', value);
  };

  // Date of Birth Handler
  const handleDateChange = (date) => {
    setFieldValue('dob', date);
  };

  useEffect(() => {
    if (user && user.email) {
      setFieldValue('email', user.email);
    }
  }, [user, setFieldValue]);

  return (
    <Form className="p-4 sm:p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Business & Personal Information
        </h2>
        <p className="text-gray-600 mt-2">Tell us about yourself and your business</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl p-3 border-2 border-teal-100">
          <h3 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Details
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                name="fullName"
                label="Full Name *"
                icon={User}
                placeholder="Enter your full name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <DatePicker
                  selected={values.dob}
                  onChange={handleDateChange}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select your date of birth"
                  className="w-full px-1 py-3 pl-4 border text-gray-800 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-200"
                  wrapperClassName="w-full"
                  popperClassName="react-datepicker-popper"
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="flex items-center justify-between px-4 py-2">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        type="button"
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        ‹
                      </button>
                      
                      <div className="flex gap-2">
                        <select
                          value={date.getMonth()}
                          onChange={({ target: { value } }) => changeMonth(parseInt(value))}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                              {new Date(0, i).toLocaleString('en', { month: 'long' })}
                            </option>
                          ))}
                        </select>
                        
                        <select
                          value={date.getFullYear()}
                          onChange={({ target: { value } }) => changeYear(parseInt(value))}
                          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - 80 + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        type="button"
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                      >
                        ›
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative">
                <InputField
                  name="email"
                  label="Email Address (Verified) *"
                  type="email"
                  icon={Mail}
                  placeholder="you@example.com"
                  disabled={true}
                  readOnly={true}
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  Using your verified account email
                </p>
              </div>

              <InputField
                name="phone"
                label="Phone Number *"
                icon={Phone}
                placeholder="9876543210"
                onInput={handlePhoneInput}
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                <InputField
                  name="personalAddress"
                  as="textarea"
                  rows={3}
                  placeholder="Enter your complete address"
                  containerClass="mb-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                name="aadhaarNumber"
                label="Aadhaar Number *"
                placeholder="1234 5678 9012"
                maxLength={12}
              />

              <InputField
                name="panNumber"
                label="PAN Number *"
                placeholder="ABCDE1234F"
                maxLength={10}
                onInput={handlePanInput}
                className="uppercase"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white rounded-2xl p-3 border-2 border-purple-100">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Business Details
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputField
                name="businessName"
                label="Business Name *"
                icon={Building2}
                placeholder="Your Business Name"
              />

              <SelectField
                name="businessType"
                label="Type of Business *"
                options={BUSINESS_TYPES}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Your Business * (max 50 words)
              </label>
              <InputField
                name="businessDescription"
                as="textarea"
                rows={4}
                placeholder="Describe your business, products, or services..."
                containerClass="mb-0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
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

export default BusinessPersonalInfo;