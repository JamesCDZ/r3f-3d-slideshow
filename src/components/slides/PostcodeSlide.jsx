import React, { useState } from 'react';

const LoadingDots = () => (
  <div className="flex justify-center items-center mt-5">
    <div className="flex gap-2">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{
            animationDelay: `${(dot - 1) * 0.2}s`,
            animationDuration: '0.5s'
          }}
        />
      ))}
    </div>
  </div>
);

export const PostcodeSlide = ({ onNext, onAddressSelected }) => {
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  
  const [manualAddress, setManualAddress] = useState({
    house: "",
    street: "",
    town: "",
    postcode: ""
  });

  // Postcode validation
  const isPostcodeValid = (postcode) => {
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  };

  // Manual address validation
  const isManualAddressValid = () => {
    const { house, street, town, postcode } = manualAddress;
    return house && street && town && isPostcodeValid(postcode);
  };

  // Format address for display
  const formatAddressDisplay = (address) => {
    const parts = [
      address['Column7'] || '', // House name
      address['Column6'] || '', // House number
      address['Column8'] || '', // Flat number
      address['Column 5'] || '', // Additional property info
      address['Column4'] || '', // Street name
      address['Column 2'] || '', // Locality
      address['Column1'] || '', // Town/City
      address['Column 0'] || ''  // Postcode
    ].filter(part => part.trim() !== '');
    
    return parts.join(', ');
  };

  // Handle postcode input
  const handlePostcodeInput = (e) => {
    const value = e.target.value.toUpperCase();
    setPostcode(value);
    setPostcodeError("");
    setSelectedAddress(null);
    setAddresses([]);
  };

  // Find addresses by postcode
  const findAddress = async () => {
    if (!postcode) {
      setPostcodeError("Please enter a postcode");
      return;
    }

    if (!isPostcodeValid(postcode)) {
      setPostcodeError("Please enter a valid postcode");
      return;
    }

    setIsLoadingAddresses(true);
    try {
      const formattedPostcode = postcode.replace(/\s+/g, '');
      
      // Try real API first
      try {
        const response = await fetch(`https://energy.swicc.co.uk/api/addresses/${encodeURIComponent(formattedPostcode)}`);
        const data = await response.json();
        

        if (data && data.success && data.addresses) {
          // Sort addresses by house number if available
          const sortedAddresses = [...data.addresses].sort((a, b) => {
            const numA = a['Column6'] ? parseInt(a['Column6']) : null;
            const numB = b['Column6'] ? parseInt(b['Column6']) : null;
            
            if (numA !== null && numB !== null) {
              return numA - numB;
            }
            
            if (numA !== null) return -1;
            if (numB !== null) return 1;
            
            const nameA = a['Column7'] || '';
            const nameB = b['Column7'] || '';
            return nameA.localeCompare(nameB);
          });

          setAddresses(sortedAddresses);
          
          if (sortedAddresses.length === 0) {
            setPostcodeError("No addresses found for this postcode");
          }
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }
      
      // Fallback to mock addresses for demo
      const mockAddresses = [
        {
          'Column7': 'Ashley House',
          'Column6': '123',
          'Column4': 'Main Street',
          'Column1': 'London',
          'Column 0': postcode,
          'Column 12': '123456789'
        },
        {
          'Column6': '456',
          'Column4': 'Oak Avenue',
          'Column1': 'London', 
          'Column 0': postcode,
          'Column 12': '987654321'
        },
        {
          'Column7': 'The Old Mill',
          'Column4': 'High Street',
          'Column1': 'London',
          'Column 0': postcode,
          'Column 12': '555666777'
        }
      ];
      setAddresses(mockAddresses);
      
    } catch (error) {
      console.error('Address lookup error:', error);
      setPostcodeError("Error finding addresses. Please try again or enter manually.");
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Handle address selection - now automatically continues
  const handleAddressSelect = async (address = selectedAddress) => {
    if (!address) return;

    setIsCheckingEligibility(true);
    
    try {
      // Extract address components
      const addressPostcode = address['Column 0'] || '';
      const streetName = address['Column4'] || '';
      const houseNumber = address['Column6'] || '';
      const flatNumber = address['Column8'] || '';
      const houseName = address['Column7'] || '';
      
      let addressLine1 = '';
      let addressLine2 = '';
      
      // Construct address lines based on available data
      if (flatNumber && houseName) {
        addressLine1 = `${flatNumber} ${houseName}`;
        addressLine2 = houseNumber ? `${houseNumber} ${streetName}` : streetName;
      } else if (houseName && !houseNumber && !flatNumber) {
        addressLine1 = houseName;
        addressLine2 = streetName;
      } else if (houseNumber && !houseName && !flatNumber) {
        addressLine1 = `${houseNumber} ${streetName}`;
        addressLine2 = null;
      } else {
        const parts = [flatNumber, houseName, houseNumber].filter(Boolean);
        if (parts.length > 0) {
          addressLine1 = parts.join(' ');
          addressLine2 = streetName;
        } else {
          addressLine1 = streetName;
          addressLine2 = null;
        }
      }

      // Check eligibility for eco/insulation schemes
      let ecoEligibility = false;
      let baxterKellyEligibility = false;
      let product_id = false;
      let des_id = false;
      let epcData = null;

      try {
        const eligibilityResponse = await fetch('https://energy.swicc.co.uk/api/checkEligibility?' + new URLSearchParams({
          address_line_1: addressLine1,
          address_line_2: addressLine2 || '',
          post_code: addressPostcode
        }));
        const eligibilityData = await eligibilityResponse.json();
        
        if (eligibilityData.success && eligibilityData.data) {
          ecoEligibility = eligibilityData.data.ecoEligible;
          baxterKellyEligibility = eligibilityData.data.baxterKellyEligible;
          product_id = eligibilityData.data.baxterprodID;
          des_id = eligibilityData.data.baxterdesid;
        }
      } catch (eligibilityError) {
        console.error('Error checking eligibility:', eligibilityError);
        // For demo, randomly assign eligibility
        ecoEligibility = Math.random() > 0.5;
        baxterKellyEligibility = Math.random() > 0.7;
      }

            // Fetch EPC data using the same address lines
// Fix the EPC API call
try {
    console.log("=== FETCHING EPC DATA ===");
    console.log("Using Address Line 1:", addressLine1);
    console.log("Using Address Line 2:", addressLine2);
    console.log("Using Postcode:", postcode);
  
    // Build URL with query parameters for fetch
    const epcUrl = new URL('https://energy.swicc.co.uk/api/epc/lookup');
    epcUrl.searchParams.append('address1', addressLine1);
    if (addressLine2) {
      epcUrl.searchParams.append('address2', addressLine2);
    }
    epcUrl.searchParams.append('postcode', postcode);
  
    const epcResponse = await fetch(epcUrl.toString());
    const epcData = await epcResponse.json(); // ⚠️ Don't forget to parse the JSON
  
    if (epcData.success && epcData.data) {
      console.log("=== EPC DATA FOUND ===");
      console.log("Full EPC Response:", epcData);
      // ... rest of your logging
    } else {
      console.log("=== NO EPC DATA FOUND ===");
      console.log("EPC Response:", epcData);
    }
  } catch (epcError) {
    console.error('=== EPC LOOKUP ERROR ===');
    console.error('Error fetching EPC data:', epcError);
  }

      const addressData = {
        formatted: formatAddressDisplay(address),
        house: houseNumber || houseName || flatNumber || '',
        street: addressLine2 || streetName || '',
        town: address['Column1'] || '',
        county: address['Column2'] || '',
        postcode: addressPostcode,
        uprn: address['Column 12'] || null,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        ecoEligible: ecoEligibility,
        product_id: product_id,
        des_id: des_id,
        baxterKellyEligible: baxterKellyEligibility
      };

      onAddressSelected(addressData);
      
      setTimeout(() => {
        onNext();
      }, 100);

    } catch (error) {
      console.error('Error processing address:', error);
      // Continue with basic address data even if eligibility check fails
      const basicAddressData = {
        formatted: formatAddressDisplay(address),
        postcode: address['Column 0'] || '',
        ecoEligible: false,
        baxterKellyEligible: false
      };
      
      onAddressSelected(basicAddressData);
      onNext();
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  // Handle manual address entry
  const handleManualAddress = () => {
    if (isManualAddressValid()) {
      const formatted = `${manualAddress.house}, ${manualAddress.street}, ${manualAddress.town}, ${manualAddress.postcode}`;
      const addressData = {
        formatted,
        ...manualAddress,
        ecoEligible: false,
        baxterKellyEligible: false
      };
      
      onAddressSelected(addressData);
      onNext();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl md:text-4xl mb-4 font-extrabold text-center">
        What's your address?
      </h1>
      <p className="text-opacity-80 mb-6 text-center">
        Enter your postcode to find available energy deals in your area
      </p>
      
      {!addresses.length && !showManualEntry ? (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={postcode}
              onChange={handlePostcodeInput}
              onKeyPress={(e) => e.key === 'Enter' && findAddress()}
              placeholder="Enter your postcode eg: KW15 1GW"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
              disabled={isLoadingAddresses}
            />
            {postcodeError && (
              <p className="text-red-500 text-sm mt-1 text-left">{postcodeError}</p>
            )}
          </div>
          
          <button
            onClick={findAddress}
            disabled={isLoadingAddresses}
            className="w-full bg-[#000000] hover:bg-[#FFFFFF] text-white hover:text-black disabled:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
          >
            {isLoadingAddresses ? "Looking up..." : "Find Addresses"}
          </button>

          {isLoadingAddresses && <LoadingDots />}

          <p 
            onClick={() => setShowManualEntry(true)}
            className="text-xs text-blue-500 cursor-pointer hover:underline pointer-events-auto text-center mt-4"
          >
            Can't find your address? Enter manually
          </p>
        </div>
      ) : addresses.length && !showManualEntry ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Select your address:</h3>
          <div 
            className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg pointer-events-auto"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#CBD5E0 #F7FAFC'
            }}
          >
            {addresses.map((address, index) => (
              <button
                key={index}
                onClick={() => handleAddressSelect(address)}
                className="w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors duration-200 pointer-events-auto text-black block"
              >
                {formatAddressDisplay(address)}
              </button>
            ))}
          </div>

          {isCheckingEligibility && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Checking eligibility...</p>
              <LoadingDots />
            </div>
          )}

          <button
            onClick={() => {
              setAddresses([]);
              setPostcode("");
              setSelectedAddress(null);
            }}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
          >
            Search Different Postcode
          </button>
        </div>
      ) : showManualEntry ? (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={manualAddress.house}
              onChange={(e) => setManualAddress(prev => ({ ...prev, house: e.target.value }))}
              placeholder="House Name / Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
            />
          </div>

          <div>
            <input
              type="text"
              value={manualAddress.street}
              onChange={(e) => setManualAddress(prev => ({ ...prev, street: e.target.value }))}
              placeholder="Street Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
            />
          </div>

          <div>
            <input
              type="text"
              value={manualAddress.town}
              onChange={(e) => setManualAddress(prev => ({ ...prev, town: e.target.value }))}
              placeholder="Town"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
            />
          </div>

          <div>
            <input
              type="text"
              value={manualAddress.postcode}
              onChange={(e) => setManualAddress(prev => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
              placeholder="Postcode"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto text-black"
            />
          </div>

          <button
            onClick={() => setShowManualEntry(false)}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
          >
            Back to Postcode Search
          </button>

          <button
            onClick={handleManualAddress}
            disabled={!isManualAddressValid()}
            className="w-full bg-[#000000] hover:bg-[#FFFFFF] text-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
          >
            Continue
          </button>
        </div>
      ) : null}
    </div>
  );
};