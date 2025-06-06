import React, { useState } from 'react';

export const ContactSlide = ({ onSubmit, onBack, addressData }) => {
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    const { firstName, lastName, email, phone } = contactForm;
    
    if (!firstName || !lastName || !email || !phone) {
      alert("Please fill in all fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    
    onSubmit(contactForm);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl md:text-4xl mb-4 font-extrabold text-center">
        Almost there!
      </h1>
      <p className="text-opacity-80 mb-6 text-center">
        Enter your details to get personalized energy recommendations
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={contactForm.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="First Name"
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
          />
          <input
            type="text"
            value={contactForm.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Last Name"
            required
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
          />
        </div>
        
        <input
          type="email"
          value={contactForm.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Email Address"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
        />
        
        <input
          type="tel"
          value={contactForm.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Phone Number"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
        />
        
        {addressData && addressData.formatted && (
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Selected address:</p>
            <p className="font-medium text-black">{addressData.formatted}</p>
            {addressData.ecoEligible && (
              <p className="text-sm text-green-600 mt-1">✓ ECO Scheme Eligible</p>
            )}
            {addressData.baxterKellyEligible && (
              <p className="text-sm text-green-600 mt-1">✓ Baxter Kelly Eligible</p>
            )}
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#4A9B8E] hover:bg-[#3d8a7b] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
          >
            Get My Deals
          </button>
        </div>
      </div>
    </div>
  );
};