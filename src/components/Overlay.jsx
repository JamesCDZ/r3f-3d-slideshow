import React, { useState } from 'react';
import { WelcomeSlide } from './slides/WelcomeSlide';
import { PostcodeSlide } from './slides/PostcodeSlide';
import { ContactSlide } from './slides/ContactSlide';
import { PrivacySlide } from './slides/PrivacySlide';

export const Overlay = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    postcode: "",
    address: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    marketingOptOut: false,
    house: "",
    street: "",
    town: "",
    county: "",
    uprn: "",
    addressLine1: "",
    addressLine2: "",
    ecoEligible: false,
    baxterKellyEligible: false,
    product_id: false,
    des_id: false,
    epcData: null
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleAddressSelected = (addressData) => {
    setFormData(prev => ({ ...prev, ...addressData }));
  };

  const handleContactSubmit = (contactData) => {
    setFormData(prev => ({ ...prev, ...contactData }));
    nextStep();
  };

  const handleFinalSubmit = (finalFormData) => {
    setFormData(finalFormData);
    console.log("Form submitted:", finalFormData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeSlide onNext={nextStep} />;

      case 1:
        return (
          <PostcodeSlide 
            onNext={nextStep} 
            onAddressSelected={handleAddressSelected}
          />
        );

      case 2:
        return (
          <ContactSlide 
            onSubmit={handleContactSubmit}
            onBack={prevStep}
            addressData={formData}
          />
        );

      case 3:
        return (
          <PrivacySlide 
            onSubmit={handleFinalSubmit}
            onBack={prevStep}
            formData={formData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <img 
              src="/logo.png" 
              className="h-12"
              alt="Energy Lab"
            />
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-4 mb-0">
          {[0, 1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                currentStep >= step 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step + 1}
              </div>
              {step < 3 && (
                <div className={`w-12 h-1 mx-2 transition-colors duration-300 ${
                  currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-lg p-2 min-h-[400px]">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};