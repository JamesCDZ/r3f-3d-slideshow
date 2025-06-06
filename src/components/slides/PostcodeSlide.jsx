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
     try {
        console.log("=== FETCHING EPC DATA ===");
        console.log("Using Address Line 1:", addressLine1);
        console.log("Using Address Line 2:", addressLine2);
        console.log("Using Postcode:", postcode);

        const epcResponse = await $fetch('https://energy.swicc.co.uk/api/epc/lookup', {
          params: {
            address1: addressLine1,
            address2: addressLine2,
            postcode: postcode
            // Removed UPRN - always use address matching
          }
        });

        if (epcResponse.success && epcResponse.data) {
          epcData = epcResponse.data;
          console.log("=== EPC DATA FOUND ===");
          console.log("Full EPC Response:", epcResponse);
          console.log("Search Criteria Used:", epcResponse.searchCriteria);
          console.log("Total Matches Found:", epcResponse.totalMatches);
          console.log("");
          console.log("--- ENERGY RATINGS ---");
          console.log("Current Energy Rating:", epcData.energyRating.current);
          console.log("Potential Energy Rating:", epcData.energyRating.potential);
          console.log("Current Energy Efficiency:", epcData.energyRating.currentEfficiency);
          console.log("Potential Energy Efficiency:", epcData.energyRating.potentialEfficiency);
          console.log("");
          console.log("--- PROPERTY DETAILS ---");
          console.log("Property Type:", epcData.property.type);
          console.log("Built Form:", epcData.property.builtForm);
          console.log("Construction Age Band:", epcData.property.constructionAgeBand);
          console.log("Total Floor Area:", epcData.property.totalFloorArea);
          console.log("Tenure:", epcData.property.tenure);
          console.log("Habitable Rooms:", epcData.property.numberHabitableRooms);
          console.log("Heated Rooms:", epcData.property.numberHeatedRooms);
          console.log("");
          console.log("--- ENERGY COSTS (Annual) ---");
          console.log("Current Heating Cost: £", epcData.costs.heating.current);
          console.log("Potential Heating Cost: £", epcData.costs.heating.potential);
          console.log("Current Lighting Cost: £", epcData.costs.lighting.current);
          console.log("Potential Lighting Cost: £", epcData.costs.lighting.potential);
          console.log("Current Hot Water Cost: £", epcData.costs.hotWater.current);
          console.log("Potential Hot Water Cost: £", epcData.costs.hotWater.potential);
          console.log("");
          console.log("--- ENVIRONMENTAL IMPACT ---");
          console.log("Current Environmental Impact:", epcData.environmental.currentImpact);
          console.log("Potential Environmental Impact:", epcData.environmental.potentialImpact);
          console.log("Current CO2 Emissions:", epcData.environmental.co2EmissionsCurrent);
          console.log("Potential CO2 Emissions:", epcData.environmental.co2EmissionsPotential);
          console.log("Current Energy Consumption:", epcData.environmental.energyConsumptionCurrent);
          console.log("Potential Energy Consumption:", epcData.environmental.energyConsumptionPotential);
          console.log("");
          console.log("--- PROPERTY FEATURES ---");
          console.log("Main Fuel Type:", epcData.features.mainFuel);
          console.log("Mains Gas Available:", epcData.features.mainsGas);
          console.log("Solar Water Heating:", epcData.features.solarWaterHeating);
          console.log("Wind Turbine Count:", epcData.features.windTurbineCount);
          console.log("Low Energy Lighting %:", epcData.features.lowEnergyLighting);
          console.log("Open Fireplaces:", epcData.features.numberOpenFireplaces);
          console.log("Multi Glaze Proportion:", epcData.features.multiGlazeProportion);
          console.log("");
          console.log("--- BUILDING ELEMENTS ---");
          console.log("Walls:", epcData.buildingElements.walls.description);
          console.log("Walls Energy Efficiency:", epcData.buildingElements.walls.energyEfficiency);
          console.log("Roof:", epcData.buildingElements.roof.description);
          console.log("Roof Energy Efficiency:", epcData.buildingElements.roof.energyEfficiency);
          console.log("Floor:", epcData.buildingElements.floor.description);
          console.log("Floor Energy Efficiency:", epcData.buildingElements.floor.energyEfficiency);
          console.log("Windows:", epcData.buildingElements.windows.description);
          console.log("Windows Energy Efficiency:", epcData.buildingElements.windows.energyEfficiency);
          console.log("Main Heating:", epcData.buildingElements.mainHeating.description);
          console.log("Main Heating Energy Efficiency:", epcData.buildingElements.mainHeating.energyEfficiency);
          console.log("Hot Water:", epcData.buildingElements.hotWater.description);
          console.log("Hot Water Energy Efficiency:", epcData.buildingElements.hotWater.energyEfficiency);
          console.log("");
          console.log("--- CERTIFICATE INFO ---");
          console.log("Inspection Date:", epcData.certificate.inspectionDate);
          console.log("Lodgement Date:", epcData.certificate.lodgementDate);
          console.log("Transaction Type:", epcData.certificate.transactionType);
          console.log("Building Reference Number:", epcData.certificate.buildingReferenceNumber);
          console.log("UPRN:", epcData.certificate.uprn);
          console.log("Local Authority:", epcData.administrative.localAuthorityLabel);
          console.log("======================");
        } else {
          console.log("=== NO EPC DATA FOUND ===");
          console.log("EPC Response:", epcResponse);
          console.log("Search Criteria:", epcResponse?.searchCriteria);
          console.log("Message:", epcResponse?.message);
          console.log("========================");
          epcData = null;
        }
      } catch (epcError) {
        console.error('=== EPC LOOKUP ERROR ===');
        console.error('Error fetching EPC data:', epcError);
        console.log("EPC lookup failed, continuing without EPC data");
        console.log("========================");
        epcData = null;
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