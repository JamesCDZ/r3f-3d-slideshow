import React, { useState } from 'react';

export const PrivacySlide = ({ onSubmit, onBack, formData }) => {
  const [marketingOptOut, setMarketingOptOut] = useState(false);

  const handleFinalSubmit = () => {
    const finalFormData = {
      ...formData,
      marketingOptOut: marketingOptOut,
    };
    
    onSubmit(finalFormData);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-xl md:text-4xl font-extrabold">
            Privacy Settings
          </h1>
        </div>
      </div>
      
      {/* GDPR Compliant Data Preferences Section */}
      <div className="border border-blue-200 rounded-lg bg-blue-50/30 p-4 mb-6">
        <div className="flex items-center mb-3">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="font-semibold text-gray-800 text-[12px]">Your Data Preferences</h3>
          <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">GDPR Compliant</span>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center text-[14px]">
              <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Marketing Communications
            </h4>
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketingOptOut"
                checked={marketingOptOut}
                onChange={(e) => setMarketingOptOut(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-auto"
              />
              <label htmlFor="marketingOptOut" className="text-sm text-gray-700 leading-tight text-[11px]">
                Tomorrow Media Group would like to send you information by email, telephone and SMS on our other products & services which may be of interest. Tick here if you would rather not receive these.
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legal Requirements Section */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-medium text-gray-800 text-[14px]">Legal Requirements</h4>
        </div>
        <p className="text-xs text-gray-600 leading-tight">
          By clicking "Get My Deals", you confirm that you are over 18 years of age, responsible for paying your energy bills and agree to receive direct marketing by telephone from our partners listed in our{" "}
          <a href="/privacy-policy" className="text-blue-600 underline hover:text-blue-800">Privacy Policy</a>. 
          You can opt-out of marketing at anytime by emailing "stop" to{" "}
          <a href="mailto:dataprotection@tomorrowmediagroup.com" className="text-blue-600 underline hover:text-blue-800">
            dataprotection@tomorrowmediagroup.com
          </a>.
        </p>
      </div>
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-500  text-[12px] hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
        >
          Back
        </button>
        <button
          onClick={handleFinalSubmit}
          className="flex-1 bg-[#4A9B8E] text-[12px] hover:bg-[#3A8B7E] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Get My Deals
        </button>
      </div>
    </div>
  );
};