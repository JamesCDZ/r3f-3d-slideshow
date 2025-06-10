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

const EPCCard = ({ epcData, onConfirm, onBack }) => {
    const getEnergyRatingColor = (rating) => {
      const colors = {
        'A': 'bg-green-600',
        'B': 'bg-green-500', 
        'C': 'bg-yellow-500',
        'D': 'bg-orange-500',
        'E': 'bg-red-500',
        'F': 'bg-red-600',
        'G': 'bg-red-700'
      };
      return colors[rating] || 'bg-gray-500';
    };
  
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    };
  
    const calculateTotalAnnualCost = () => {
      if (!epcData.costs) return null;
      
      const heating = epcData.costs.heating?.current || 0;
      const lighting = epcData.costs.lighting?.current || 0;
      const hotWater = epcData.costs.hotWater?.current || 0;
      
      return heating + lighting + hotWater;
    };
  
    const calculatePotentialSavings = () => {
      if (!epcData.costs) return null;
      
      const currentTotal = calculateTotalAnnualCost();
      const potentialHeating = epcData.costs.heating?.potential || epcData.costs.heating?.current || 0;
      const potentialLighting = epcData.costs.lighting?.potential || epcData.costs.lighting?.current || 0;
      const potentialHotWater = epcData.costs.hotWater?.potential || epcData.costs.hotWater?.current || 0;
      
      const potentialTotal = potentialHeating + potentialLighting + potentialHotWater;
      
      return currentTotal && potentialTotal ? currentTotal - potentialTotal : null;
    };

    // Helper function to check if built date should be shown
    const shouldShowBuiltDate = () => {
      const constructionAge = epcData.property?.constructionAgeBand;
      return constructionAge && 
             constructionAge !== 'NO DATA!' && 
             constructionAge !== 'Unknown' && 
             constructionAge.trim() !== '';
    };
  
    return (
      <div className="animate-fade-in-up space-y-4" style={{ paddingTop: '2rem' }}>
        {/* Property Overview & Key Details */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-3 text-center">Property Overview</h3>
          
          {/* Property Type & Size */}
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-blue-600 mb-1">
              {epcData.property?.type || 'Property Type Unknown'}
            </div>
            <p className="text-sm text-gray-600">
              {epcData.property?.totalFloorArea || 'N/A'} m² 
            </p>
            {/* Only show built date if it exists and is not "NO DATA!" */}
            {shouldShowBuiltDate() && (
              <p className="text-xs text-gray-500 mt-1">
                Built: {epcData.property.constructionAgeBand}
              </p>
            )}
          </div>
  
          {/* Key Property Features */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Energy Rating */}
            <div className="text-center bg-blue-50 rounded p-2">
              <p className="text-gray-600">Energy Rating</p>
              <div className={`w-8 h-8 mx-auto mt-1 rounded-full flex items-center justify-center text-white font-bold text-sm ${getEnergyRatingColor(epcData.energyRating?.current)}`}>
                {epcData.energyRating?.current || 'N/A'}
              </div>
            </div>
            
            {/* Fuel Type */}
            {epcData.features?.mainFuel && (
              <div className="text-center bg-green-50 rounded p-2">
                <p className="text-gray-600">Main Fuel</p>
                <p className="font-semibold text-green-700 mt-1">{epcData.features.mainFuel}</p>
              </div>
            )}
            
            {/* Mains Gas Available */}
            {epcData.features?.mainsGas && (
              <div className="text-center bg-purple-50 rounded p-2">
                <p className="text-gray-600">Mains Gas</p>
                <p className="font-semibold text-purple-700 mt-1">Available</p>
              </div>
            )}
            
            {/* Property Tenure */}
            {epcData.property?.tenure && (
              <div className="text-center bg-orange-50 rounded p-2">
                <p className="text-gray-600">Tenure</p>
                <p className="font-semibold text-orange-700 mt-1">{epcData.property.tenure}</p>
              </div>
            )}
          </div>
        </div>
  
  
        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto text-sm"
          >
            Search Again
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#4A9B8E] hover:bg-[#3d8a7b] text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto text-sm"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    );
  };

export const PostcodeSlide = ({ onNext, onAddressSelected }) => {
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [epcData, setEpcData] = useState(null);
  const [showEpcDetails, setShowEpcDetails] = useState(false);
  const [pendingAddressData, setPendingAddressData] = useState(null);
  
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
    setShowEpcDetails(false);
    setEpcData(null);
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
      let fetchedEpcData = null;

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

      // Fetch EPC data
      try {
        console.log("=== FETCHING EPC DATA ===");
        console.log("Using Address Line 1:", addressLine1);
        console.log("Using Address Line 2:", addressLine2);
        console.log("Using Postcode:", addressPostcode);
      
        const epcUrl = new URL('https://energy.swicc.co.uk/api/epc/lookup');
        epcUrl.searchParams.append('address1', addressLine1);
        if (addressLine2) {
          epcUrl.searchParams.append('address2', addressLine2);
        }
        epcUrl.searchParams.append('postcode', addressPostcode);
      
        console.log("EPC URL:", epcUrl.toString());
      
        const epcResponse = await fetch(epcUrl.toString());
        const epcResponseData = await epcResponse.json();
      
        console.log("Raw EPC Response:", epcResponseData);
      
        if (epcResponseData.success && epcResponseData.data) {
          fetchedEpcData = epcResponseData.data;
          console.log("=== EPC DATA FOUND ===");
          console.log("Full EPC Response:", epcResponseData);
        } else {
          console.log("=== NO EPC DATA FOUND ===");
          fetchedEpcData = null;
        }
      } catch (epcError) {
        console.error('=== EPC LOOKUP ERROR ===');
        console.error('Error fetching EPC data:', epcError);
        fetchedEpcData = null;
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
        baxterKellyEligible: baxterKellyEligibility,
        epcData: fetchedEpcData
      };

      // Store the address data and EPC data
      setPendingAddressData(addressData);
      setEpcData(fetchedEpcData);

      // If EPC data found, show EPC details screen
      if (fetchedEpcData) {
        setShowEpcDetails(true);
      } else {
        // No EPC data, proceed directly
        onAddressSelected(addressData);
        setTimeout(() => {
          onNext();
        }, 100);
      }

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

  // Handle EPC confirmation
  const handleEpcConfirm = () => {
    if (pendingAddressData) {
      onAddressSelected(pendingAddressData);
      setTimeout(() => {
        onNext();
      }, 100);
    }
  };

  // Handle EPC back button (return to address selection)
  const handleEpcBack = () => {
    setShowEpcDetails(false);
    setEpcData(null);
    setPendingAddressData(null);
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

  // If showing EPC details, render that screen
  if (showEpcDetails && epcData) {
    return (
      <div className="max-w-2xl mx-auto">
        <EPCCard 
          epcData={epcData} 
          onConfirm={handleEpcConfirm}
          onBack={handleEpcBack}
        />
      </div>
    );
  }

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
              placeholder="Enter your postcode eg: WS8 6BB"
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
              <p className="text-sm text-gray-600 mb-2">Checking eligibility and property details...</p>
              <LoadingDots />
            </div>
          )}

          <button
            onClick={() => {
              setAddresses([]);
              setPostcode("");
              setSelectedAddress(null);
              setShowEpcDetails(false);
              setEpcData(null);
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