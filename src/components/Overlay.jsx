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

  // Deal loading animation state
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState([]);
  const [completedProviders, setCompletedProviders] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentProviderIndex, setCurrentProviderIndex] = useState(-1);

  const ukEnergyProviders = [
    { name: "British Gas", delay: 800 },
    { name: "EDF Energy", delay: 1600 },
    { name: "E.ON Next", delay: 2400 },
    { name: "Scottish Power", delay: 3200 },
    { name: "SSE Energy", delay: 4000 },
    { name: "Octopus Energy", delay: 4800 },
    { name: "Shell Energy", delay: 5600 },
    { name: "Utility Warehouse", delay: 6400 },
    { name: "Bulb Energy", delay: 7200 },
    { name: "Pure Planet", delay: 8000 },
    { name: "Green Supplier", delay: 8800 },
    { name: "Together Energy", delay: 9600 },
  ];

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
    startDealLoadingAnimation();
  };

  const startDealLoadingAnimation = () => {
    setIsLoadingDeals(true);
    setLoadingProviders([]);
    setCompletedProviders([]);
    setShowContactForm(false);
    setCurrentProviderIndex(-1);
    
    // Move to slide 2
    setSlide(2);
    
    // Start loading animation for each provider with delays
    ukEnergyProviders.forEach((provider, index) => {
      setTimeout(() => {
        setCurrentProviderIndex(index);
        setLoadingProviders(prev => [...prev, provider.name]);
      }, provider.delay);
      
      setTimeout(() => {
        setCompletedProviders(prev => [...prev, provider.name]);
        setLoadingProviders(prev => prev.filter(name => name !== provider.name));
        
        // If this is the last provider, finish loading
        if (index === ukEnergyProviders.length - 1) {
          setTimeout(() => {
            setIsLoadingDeals(false);
            setShowContactForm(true);
          }, 1500); // Extended delay for celebration effect
        }
      }, provider.delay + 1500); // Each provider takes 1.5s to complete
    });
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
        // Deal Loading Animation or Contact Details
        if (isLoadingDeals || !showContactForm) {
          return (
            <div className="max-w-lg mx-auto text-center">
              {/* Simplified header */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl mb-3 font-bold text-gray-800">
                  Searching Providers
                </h1>
                <p className="text-base text-gray-600 mb-3">
                  Checking available energy deals in your area...
                </p>
              </div>
              
              {/* Clean progress indicator */}
              <div className="mb-6">
                <div className="bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${(completedProviders.length / ukEnergyProviders.length) * 100}%` 
                    }}
                  >
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {completedProviders.length} of {ukEnergyProviders.length} providers checked
                </p>
              </div>

              {/* Auto-scrolling provider list */}
              <div className="relative">
                <div 
                  className="space-y-2 h-48 overflow-hidden"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                  }}
                >
                  <div 
                    className="transition-transform duration-700 ease-out space-y-2"
                    style={{
                      transform: `translateY(-${Math.max(0, (currentProviderIndex - 2)) * 56}px)`
                    }}
                  >
                    {ukEnergyProviders.map((provider, index) => {
                      const isCompleted = completedProviders.includes(provider.name);
                      const isLoading = loadingProviders.includes(provider.name);
                      const isPending = !isCompleted && !isLoading;
                      const isCurrent = index === currentProviderIndex;

                      return (
                        <div 
                          key={provider.name}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-green-50 border border-green-200' 
                              : isLoading 
                              ? 'bg-blue-50 border border-blue-200 ring-2 ring-blue-100' 
                              : isCurrent
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-gray-50 border border-gray-100 opacity-70'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Small provider indicator */}
                            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                              isCompleted 
                                ? 'bg-green-500' 
                                : isLoading 
                                ? 'bg-blue-500 animate-pulse' 
                                : isCurrent
                                ? 'bg-yellow-500'
                                : 'bg-gray-300'
                            }`}></div>
                            
                            <span className={`font-medium text-sm transition-colors duration-300 ${
                              isCompleted 
                                ? 'text-green-700' 
                                : isLoading 
                                ? 'text-blue-700' 
                                : isCurrent
                                ? 'text-yellow-700'
                                : 'text-gray-500'
                            }`}>
                              {provider.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            {isCompleted && (
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            
                            {isLoading && (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            )}
                            
                            {(isPending || isCurrent) && !isLoading && (
                              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Fade effect indicators */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>

              {/* Simple completion message */}
              {completedProviders.length === ukEnergyProviders.length && !showContactForm && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium text-sm">
                    ✓ Search complete! Preparing your options...
                  </p>
                </div>
              )}
            </div>
          );
        }

        // Contact Details Form (shown after loading animation)
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
                  className="flex-1 bg-[#4A9B8E] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
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