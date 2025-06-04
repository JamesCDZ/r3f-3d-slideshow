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
        // Welcome Screen - Tesla/Modern Style
        return (
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-thin tracking-wide text-white mb-6 leading-tight">
                BROADBAND
                <br />
                <span className="font-extralight text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text">
                  REIMAGINED
                </span>
              </h1>
              <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8"></div>
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                Experience the future of connectivity. Our AI-powered platform finds optimal broadband solutions 
                tailored to your digital lifestyle.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={nextSlide}
                className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-lg tracking-wide rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 pointer-events-auto transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10">BEGIN JOURNEY</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              
              <div className="flex items-center text-gray-400 text-sm">
                <div className="w-8 h-px bg-gray-500 mr-3"></div>
                <span className="font-light tracking-wider">3 STEPS TO OPTIMIZED INTERNET</span>
              </div>
            </div>
          </div>
        );

      case 1:
        // Address Collection - Tesla/Modern Style
        return (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-thin text-white mb-4 tracking-wide">
                YOUR
                <br />
                <span className="text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text">
                  LOCATION
                </span>
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300 font-light">
                Enter your postcode to discover available networks and speeds in your area
              </p>
            </div>
            
            {!addresses.length ? (
              <form onSubmit={handlePostcodeSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="POSTCODE"
                    className="w-full px-6 py-5 bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 pointer-events-auto text-white placeholder-gray-400 text-lg font-light tracking-widest text-center"
                    disabled={isLoadingAddresses}
                  />
                  {postcodeError && (
                    <p className="text-red-400 text-sm mt-2 text-center font-light">{postcodeError}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoadingAddresses}
                  className="w-full py-5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium text-lg tracking-wide rounded-2xl transition-all duration-300 pointer-events-auto transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 disabled:hover:scale-100"
                >
                  {isLoadingAddresses ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      SCANNING NETWORKS...
                    </div>
                  ) : (
                    "SCAN LOCATION"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <h3 className="font-light text-2xl text-white text-center mb-6 tracking-wide">SELECT YOUR ADDRESS</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {addresses.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(address)}
                      className="w-full text-left px-6 py-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 pointer-events-auto text-gray-200 font-light transform hover:scale-102"
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
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-gray-300 font-light tracking-wide rounded-xl transition-all duration-300 pointer-events-auto border border-white/20"
                >
                  ← SEARCH DIFFERENT LOCATION
                </button>
              </div>
            )}
          </div>
        );

      case 2:
        // Contact Details - Tesla/Modern Style
        return (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-6xl font-thin text-white mb-4 tracking-wide">
                FINAL
                <br />
                <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
                  DETAILS
                </span>
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-300 font-light">
                Complete your profile to receive personalized broadband recommendations
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="FIRST NAME"
                  required
                  className="px-6 py-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 pointer-events-auto text-white placeholder-gray-400 font-light tracking-wide"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="LAST NAME"
                  required
                  className="px-6 py-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 pointer-events-auto text-white placeholder-gray-400 font-light tracking-wide"
                />
              </div>
              
              <input
                type="email"
                name="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full px-6 py-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 pointer-events-auto text-white placeholder-gray-400 font-light tracking-wide"
              />
              
              <input
                type="tel"
                name="phone"
                placeholder="PHONE NUMBER"
                required
                className="w-full px-6 py-4 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 pointer-events-auto text-white placeholder-gray-400 font-light tracking-wide"
              />
              
              {selectedAddress && (
                <div className="bg-black/30 backdrop-blur-sm border border-white/20 p-4 rounded-xl">
                  <p className="text-sm text-gray-400 font-light tracking-wide mb-1">SELECTED LOCATION:</p>
                  <p className="text-white font-light">{selectedAddress}</p>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-gray-300 font-medium tracking-wide rounded-xl transition-all duration-300 pointer-events-auto border border-white/20"
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  className="flex-2 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium tracking-wide rounded-xl transition-all duration-300 pointer-events-auto transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                >
                  DISCOVER DEALS →
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
        className={`fixed z-10 top-0 left-0 bottom-0 right-0 flex flex-col justify-between pointer-events-none ${
          visible ? "" : "opacity-0"
        } transition-opacity duration-1000`}
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,10,30,0.95) 50%, rgba(0,0,0,0.95) 100%)'
        }}
      >
        {/* Header with Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="relative">
            <img 
              src="https://broadband.swicc.co.uk/images/broadbandlab.webp" 
              className="w-72 md:w-80 opacity-90 hover:opacity-100 transition-opacity duration-300"
              alt="Broadband Lab"
            />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
        </div>
        
        {/* Navigation arrows - minimal style */}
        {displaySlide === 0 && (
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-8 transform -translate-y-1/2">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 pointer-events-auto group"
            >
              <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300 pointer-events-auto group"
            >
              <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-6xl">
            {renderSlideContent()}
          </div>
        </div>
        
        {/* Footer with Progress and Branding */}
        <div className="pb-8 px-6">
          {/* Progress indicator */}
          <div className="flex justify-center gap-3 mb-6">
            {scenes.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === displaySlide 
                    ? "w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                    : "w-1 h-1 bg-white/30 rounded-full hover:bg-white/50"
                }`}
              />
            ))}
          </div>
          
          {/* Step indicator */}
          <div className="text-center">
            <p className="text-white/40 text-sm font-light tracking-[0.2em] uppercase">
              Step {displaySlide + 1} of {scenes.length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </>
  );
};