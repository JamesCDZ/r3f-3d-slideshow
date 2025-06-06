import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { scenes } from "./Experience";

export const slideAtom = atom(0);

// Form data atoms
export const formDataAtom = atom({
  postcode: "",
  address: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  marketingOptOut: false,
});

export const Overlay = () => {
  const [slide, setSlide] = useAtom(slideAtom);
  const [displaySlide, setDisplaySlide] = useState(slide);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useAtom(formDataAtom);
  
  // Form state
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [postcodeError, setPostcodeError] = useState("");
  const [marketingOptOut, setMarketingOptOut] = useState(false);
  
  // Contact form state
  const [contactDetails, setContactDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setVisible(false);
    setTimeout(() => {
      setDisplaySlide(slide);
      setVisible(true);
    }, 2600);
  }, [slide]);

  // Mock postcode lookup function (replace with real API)
  const lookupPostcode = async (postcode) => {
    setIsLoadingAddresses(true);
    setPostcodeError("");
    
    // Simulate API call
    try {
      // Mock addresses - replace with real postcode lookup API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddresses = [
        "123 Main Street, London, " + postcode,
        "456 Oak Avenue, London, " + postcode,
        "789 High Street, London, " + postcode,
        "321 Park Road, London, " + postcode,
      ];
      
      setAddresses(mockAddresses);
    } catch (error) {
      setPostcodeError("Failed to lookup postcode. Please try again.");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handlePostcodeSubmit = (e) => {
    e.preventDefault();
    if (postcode.length < 5) {
      setPostcodeError("Please enter a valid postcode");
      return;
    }
    lookupPostcode(postcode);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData(prev => ({ ...prev, postcode, address }));
    setSlide(2); // Move to contact details slide
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formElement = e.target;
    const contactData = {
      firstName: formElement.firstName.value,
      lastName: formElement.lastName.value,
      email: formElement.email.value,
      phone: formElement.phone.value,
    };
    
    setContactDetails(contactData);
    setFormData(prev => ({ ...prev, ...contactData }));
    setSlide(3); // Move to data preferences slide
  };

  const handleFinalSubmit = () => {
    const finalData = {
      ...formData,
      ...contactDetails,
      marketingOptOut: marketingOptOut,
    };
    
    // Handle form submission here (send to API, etc.)
    console.log("Form submitted:", finalData);
    alert("Thank you! We'll be in touch soon with your energy options.");
  };

  const nextSlide = () => {
    if (slide < 3) { // Updated to account for 4 slides (0,1,2,3)
      setSlide(slide + 1);
    }
  };

  const prevSlide = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  const renderSlideContent = () => {
    switch (displaySlide) {
      case 0:
        // Welcome Screen
        return (
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl mb-4 font-extrabold">
              Energy Lab
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-2xl mx-auto">
            We monitor real-time pricing data from every major provider to guarantee you access to the market's best energy deals.
            </p>
            <button
              onClick={nextSlide}
              className="bg-[#000000] hover:bg-[#FFFFFF] text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
            >
              Get Started
            </button>
          </div>
        );

      case 1:
        // Address Collection
        return (
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl mb-4 font-extrabold text-center">
              What's your address?
            </h1>
            <p className="text-opacity-80 mb-6 text-center">
              Enter your postcode to find available energy deals in your area
            </p>
            
            {!addresses.length ? (
              <form onSubmit={handlePostcodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="Enter your postcode eg:KW15 1GW"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
                    disabled={isLoadingAddresses}
                  />
                  {postcodeError && (
                    <p className="text-red-500 text-sm mt-1">{postcodeError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoadingAddresses}
                  className="w-full bg-[#000000] hover:bg-[#FFFFFF] text-white hover:text-black  disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
                >
                  {isLoadingAddresses ? "Looking up..." : "Find Addresses"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Select your address:</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {addresses.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors duration-200 pointer-events-auto text-black"
                    >
                      {address}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setAddresses([]);
                    setPostcode("");
                  }}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
                >
                  Search Different Postcode
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        // Contact Details - First Part
        return (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h1 className="text-3xl md:text-4xl font-extrabold">
                  Your Account
                </h1>
              </div>
              <p className="text-opacity-80">
                Complete your account to unlock exclusive energy deals
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
              />
              
              {selectedAddress && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Selected address:</p>
                  <p className="font-medium text-black">{selectedAddress}</p>
                </div>
              )}
              
              {/* Trust signals */}
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <div className="flex items-center text-green-800">
                  <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">We will never spam you</p>
                    <p className="text-xs text-green-700">Secure data that's only used to find deals that save you money</p>
                    
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
                >
                  Back
                </button>
              
                <button
                  type="submit"
                  className="flex-1 bg-[#4A9B8E] hover:bg-[#3A8B7E] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        );

      case 3:
        // Data Preferences - Final Step
        return (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h1 className="text-3xl md:text-4xl font-extrabold">
                  Privacy Settings
                </h1>
              </div>
              <p className="text-opacity-80">
                Manage your data preferences and complete your registration
              </p>
            </div>
            
            {/* GDPR Compliant Data Preferences Section */}
            <div className="border border-blue-200 rounded-lg bg-blue-50/30 p-4 mb-6">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Your Data Preferences</h3>
                <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">GDPR Compliant</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
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
                    <label htmlFor="marketingOptOut" className="text-sm text-gray-700 leading-tight">
                      Tomorrow Media Group would like to send you information by email, telephone and SMS on our other products & services which may be of interest. Tick here if you would rather not receive these.
                    </label>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 flex items-center">
                  <svg className="w-3 h-3 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your privacy matters to us. You can change these preferences anytime.
                </div>
              </div>
            </div>
            
            {/* Legal Requirements Section */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-medium text-gray-800">Legal Requirements</h4>
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
                onClick={prevSlide}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 bg-[#4A9B8E] hover:bg-[#3A8B7E] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Get My Deals
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`fixed z-10 top-0 left-0 bottom-0 right-0 flex flex-col justify-between pointer-events-none text-black ${
          visible ? "" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        <img 
          src="/logo.png" 
          className="w-80 mx-auto mt-8"
          alt="Energy Lab"
        />
        
        {/* Navigation arrows - only show if not on form slides */}
        {displaySlide === 0 && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex-1 flex items-center justify-between p-4">
            <svg
              onClick={prevSlide}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
            >
              {/* Left arrow path can be added here if needed */}
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
              onClick={nextSlide}
            >
              {/* Right arrow path can be added here if needed */}
            </svg>
          </div>
        )}

        <div className="bg-gradient-to-t from-white/90 pt-20 pb-24 md:pb-24 p-4 flex items-center flex-col">
          {renderSlideContent()}
        </div>
      </div>
    </>
  );
};