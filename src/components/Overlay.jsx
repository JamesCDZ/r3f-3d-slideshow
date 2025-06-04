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
    
    setFormData(prev => ({ ...prev, ...contactData }));
    
    // Handle form submission here (send to API, etc.)
    console.log("Form submitted:", { ...formData, ...contactData });
    alert("Thank you! We'll be in touch soon with your broadband options.");
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
              Welcome to Broadband Lab
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-2xl mx-auto">
              Find the best broadband deals for your home. We'll help you compare prices, 
              speeds, and providers to save you money and time.
            </p>
            <button
              onClick={nextSlide}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
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
              Enter your postcode to find available broadband deals in your area
            </p>
            
            {!addresses.length ? (
              <form onSubmit={handlePostcodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="Enter your postcode"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
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
              Enter your details to get personalized broadband recommendations
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
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
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
        className={`fixed z-10 top-0 left-0 bottom-0 right-0 flex flex-col pointer-events-none text-black ${
          visible ? "" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        {/* Logo at the top */}
        <div className="flex-shrink-0 p-8">
          <img 
            src="https://broadband.swicc.co.uk/images/broadbandlab.webp" 
            className="w-80 mx-auto"
            alt="Broadband Lab"
          />
        </div>
        
        {/* Navigation arrows - only show if not on form slides */}
        {displaySlide === 0 && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-between p-4 z-20">
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

        {/* Main content area - centered */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="rounded-2xl p-8 max-w-2xl w-full">
            {renderSlideContent()}
          </div>
        </div>
      </div>
    </>
  );
};