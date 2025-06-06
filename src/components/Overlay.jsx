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
      marketingOptOut: marketingOptOut,
    };
    
    setFormData(prev => ({ ...prev, ...contactData }));
    
    // Handle form submission here (send to API, etc.)
    console.log("Form submitted:", { ...formData, ...contactData });
    alert("Thank you! We'll be in touch soon with your energy options.");
  };

  const nextSlide = () => {
    if (slide < scenes.length - 1) {
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
        // Contact Details
        return (
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl mb-4 font-extrabold text-center">
              Almost there!
            </h1>
            <p className="text-opacity-80 mb-6 text-center">
              Enter your details to get personalized energy recommendations
            </p>
            
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
              
              {/* Marketing opt-out checkbox */}
              <div className="flex items-start space-x-3 py-2">
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
              
              {/* Disclaimer */}
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="text-xs text-gray-600 leading-tight">
                  By clicking "Get My Deals", you confirm that you are over 18 years of age, responsible for paying your energy bills and agree to receive direct marketing by telephone from our partners listed in our Privacy Policy. You can opt-out of marketing at anytime by emailing "stop" to{" "}
                  <a href="mailto:dataprotection@tomorrowmediagroup.com" className="text-blue-600 underline">
                    dataprotection@tomorrowmediagroup.com
                  </a>
                  .
                </p>
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
                  Get My Deals
                </button>
              </div>
            </form>
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

        <div className="bg-gradient-to-t from-white/90 pt-20 pb-10 md:pb-24 p-4 flex items-center flex-col">
          {renderSlideContent()}
        </div>
      </div>
    </>
  );
};