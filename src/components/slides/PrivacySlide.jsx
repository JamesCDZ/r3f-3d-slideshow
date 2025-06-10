import React, { useState, useEffect } from 'react';

// Mock deals data
const mockDeals = [
  {
    id: 1,
    supplier: 'Octopus Energy',
    tariff: 'Flexible Octopus',
    type: 'Variable',
    annualCost: 1247,
    savings: 312,
    greenEnergy: true,
    rating: 4.8,
    features: ['100% renewable', 'Smart meter included', 'Award-winning app']
  },
  {
    id: 2,
    supplier: 'British Gas',
    tariff: 'Simple Energy',
    type: 'Fixed 12 months',
    annualCost: 1289,
    savings: 270,
    greenEnergy: true,
    rating: 4.6,
    features: ['100% renewable', 'No exit fees', 'Simple pricing']
  },
  {
    id: 3,
    supplier: 'British Gas',
    tariff: 'HomeEnergy Fixed',
    type: 'Fixed 24 months',
    annualCost: 1334,
    savings: 225,
    greenEnergy: false,
    rating: 4.2,
    features: ['Price protection', 'UK call centers', 'Boiler cover available']
  }
];

const DealCard = ({ deal, index, isVisible }) => (
  <div 
    className={`bg-white/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/50 p-3 mb-3 transition-all duration-500 ${
      isVisible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4'
    }`}
    style={{ 
      transitionDelay: `${index * 150}ms`,
      animationDelay: `${index * 150}ms`
    }}
  >
    {/* Mobile-optimized header */}
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-gray-700 truncate">{deal.supplier}</h3>
        <p className="text-xs text-gray-500 truncate">{deal.tariff}</p>
      </div>
      <div className="flex flex-col items-end ml-2">
        <div className="flex items-center mb-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-xs font-medium ml-1 text-gray-600">{deal.rating}</span>
        </div>
        {deal.greenEnergy && (
          <span className="bg-green-100/80 text-green-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
            🌱 Green
          </span>
        )}
      </div>
    </div>
    
    {/* Mobile-optimized pricing section */}
    <div className="bg-gray-50/80 rounded p-2 mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Annual cost:</span>
        <span className="font-bold text-sm text-gray-700">£{deal.annualCost.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">You save:</span>
        <span className="font-bold text-sm text-green-600">£{deal.savings}/year</span>
      </div>
    </div>
    
    {/* Compact features for mobile */}
    <div className="flex flex-wrap gap-1">
      {deal.features.slice(0, 2).map((feature, idx) => (
        <div key={idx} className="flex items-center text-xs text-gray-500 bg-blue-50/60 px-2 py-1 rounded">
          <span className="text-green-400 mr-1 text-xs">✓</span>
          <span className="truncate">{feature}</span>
        </div>
      ))}
      {deal.features.length > 2 && (
        <div className="text-xs text-gray-400 px-2 py-1">
          +{deal.features.length - 2} more
        </div>
      )}
    </div>
  </div>
);

// Extract URL parameters for campaign tracking
const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    source: urlParams.get('source') || urlParams.get('utm_source') || 'energy-lab-website',
    click_id: urlParams.get('click_id') || urlParams.get('clickid') || urlParams.get('gclid') || '',
    mkwid: urlParams.get('mkwid') || '',
    cpgnid: urlParams.get('cpgnid') || '',
    gadSource: urlParams.get('gadsource') || urlParams.get('gad_source') || '',
    pcrid: urlParams.get('pcrid') || '',
    pdv: urlParams.get('pdv') || '',
    pkw: urlParams.get('pkw') || urlParams.get('keyword') || '',
    pmt: urlParams.get('pmt') || '',
    pgrid: urlParams.get('pgrid') || '',
    ptaid: urlParams.get('ptaid') || '',
    msclkid: urlParams.get('msclkid') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_term: urlParams.get('utm_term') || '',
    utm_content: urlParams.get('utm_content') || '',
    fbclid: urlParams.get('fbclid') || ''
  };
};

// Transform form data to match your existing Nuxt API format
const transformFormDataForAPI = (formData) => {
  const urlParams = getUrlParams();
  
  return {
    // Address information
    address: {
      postcode: formData.postcode,
      town: formData.town,
      county: formData.county || '',
      street: formData.street,
      buildingNumber: formData.house,
      buildingName: formData.house,
      ecoEligible: formData.ecoEligible || false,
      baxterKellyEligible: formData.baxterKellyEligible || false,
      epcData: formData.epcData || null
    },
    
    // Contact details
    consent: {
      contactDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        telephone: formData.phone
      },
      tm_prefs_phone: formData.marketingOptOut ? 'NO' : 'YES',
      tm_prefs_sms: formData.marketingOptOut ? 'NO' : 'YES',
      tm_prefs_email: formData.marketingOptOut ? 'NO' : 'YES'
    },
    
    // Service type - defaulting to 'both' for energy switching
    serviceType: 'both',
    electricitySupplier: 'Unknown',
    gasSupplier: 'Unknown',
    electricityPayment: 'Direct Debit',
    gasPayment: 'Direct Debit',
    residentialStatus: 'Owner',
    
    // Campaign tracking - now using URL parameters
    source: urlParams.source,
    keyword: urlParams.pkw || urlParams.utm_term || 'energy-comparison',
    
    // All tracking parameters from URL
    mkwid: urlParams.mkwid,
    cpgnid: urlParams.cpgnid,
    gadSource: urlParams.gadSource,
    pcrid: urlParams.pcrid,
    pdv: urlParams.pdv,
    pkw: urlParams.pkw,
    pmt: urlParams.pmt,
    pgrid: urlParams.pgrid,
    ptaid: urlParams.ptaid,
    msclkid: urlParams.msclkid,
    click_id: urlParams.click_id,
    
    // UTM parameters
    utm_campaign: urlParams.utm_campaign,
    utm_medium: urlParams.utm_medium,
    utm_source: urlParams.source,
    utm_term: urlParams.utm_term,
    utm_content: urlParams.utm_content,
    
    // Social media click IDs
    fbclid: urlParams.fbclid
  };
};

export const PrivacySlide = ({ onSubmit, onBack, formData }) => {
  const [marketingOptOut, setMarketingOptOut] = useState(false);
  const [showDeals, setShowDeals] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [dealsVisible, setDealsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show deals animation sequence
    const timer1 = setTimeout(() => {
      setDealsVisible(true);
    }, 300);

    // Start fading out deals and showing privacy
    const timer2 = setTimeout(() => {
      setDealsVisible(false);
    }, 3000);

    const timer3 = setTimeout(() => {
      setShowDeals(false);
      setShowPrivacy(true);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const finalFormData = {
        ...formData,
        marketingOptOut: marketingOptOut,
      };
      
      // Transform data to match your existing Nuxt API format
      const apiPayload = transformFormDataForAPI(finalFormData);
      
      console.log('Submitting to Nuxt API:', apiPayload);
      
      // Submit to your existing Nuxt API endpoint
      const response = await fetch('https://energy.swicc.co.uk/api/submitLead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
          'Accept': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });
      
      const result = await response.json();
      
      // Always show success screen regardless of actual result
      // This prevents users from knowing if they were rejected by leadbyte
      console.log('API Response (for debugging):', result);
      
      // Show success animation regardless of result
      setShowPrivacy(false);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      
      // Even on network errors, show success screen
      // The actual error is logged for debugging
      setShowPrivacy(false);
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto relative">
      {/* Success Screen */}
      {showSuccess && (
        <div className="animate-fade-in-up text-center py-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-600 mb-2">
              Thank You!
            </h1>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="text-lg font-semibold text-blue-800">We'll Call You Shortly</h3>
            </div>
            <p className="text-blue-700 text-base">
              One of our energy experts will contact you at
            </p>
            <p className="text-xl font-bold text-blue-800 mt-1">
              {formData.phone}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              Usually within the next 30 minutes during business hours
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-green-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                We'll discuss the best energy deals for your property
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                Compare prices from top UK energy suppliers
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                Help you switch to a better deal (if suitable)
              </li>
              {formData.ecoEligible && (
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  Discuss your ECO scheme eligibility
                </li>
              )}
              {formData.baxterKellyEligible && (
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  Explore additional energy efficiency options
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Deals Display */}
      {showDeals && !showSuccess && (
        <div>
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-3xl font-extrabold text-green-600 mb-2">
              🎉 Great News!
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              We found {mockDeals.length} amazing deals for your home
            </p>
            <div className="flex items-center justify-center mt-2">
              <div className="bg-green-100/80 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Potential savings: up to £{Math.max(...mockDeals.map(d => d.savings))}/year
              </div>
            </div>
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {mockDeals.map((deal, index) => (
              <DealCard 
                key={deal.id} 
                deal={deal} 
                index={index}
                isVisible={dealsVisible}
                className={`transition-opacity duration-800 ${dealsVisible ? 'opacity-60' : 'opacity-0'}`}
              />
            ))}
          </div>
          
          <div className="text-center mt-3">
            <div className="animate-pulse text-xs text-gray-500">
              Finalizing your personalized recommendations...
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Overlay */}
      {showPrivacy && !showSuccess && (
        <div className="animate-fade-in-up">
          <div className="text-center mb-2">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h1 className="text-2xl md:text-4xl font-extrabold">
                Privacy Settings
              </h1>
            </div>
          </div>
          
          {/* GDPR Compliant Data Preferences Section */}
          <div className="border border-blue-200 rounded-lg bg-blue-50/30 p-4 mb-2">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="font-semibold text-gray-800 text-[14px]">Your Data Preferences</h3>
              <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">GDPR Compliant</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center text-[14px]">
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
                    disabled={isSubmitting}
                  />
                  <label htmlFor="marketingOptOut" className="text-sm text-gray-700 leading-tight text-[14px]">
                    Tomorrow Media Group would like to send you information by email, telephone and SMS on our other products & services which may be of interest. Tick here if you would rather not receive these.
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legal Requirements Section */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-2">
            <div className="flex items-center mb-2">
              <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-medium text-gray-800 text-[14px]">Legal Requirements</h4>
            </div>
            <p className="text-xs text-gray-600 leading-tight">
              By clicking "Get My Deals", you confirm that you are over 18 years of age, responsible for paying your energy bills and agree to receive direct marketing by telephone from our partners listed in our{" "}
              <a href="https://energy.swicc.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Privacy Policy</a>. 
              You can opt-out of marketing at anytime by emailing "stop" to{" "}
              <a href="mailto:dataprotection@tomorrowmediagroup.com" className="text-blue-600 underline hover:text-blue-800">
                dataprotection@tomorrowmediagroup.com
              </a>.
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-[12px] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              className="flex-1 bg-[#4A9B8E] text-[12px] hover:bg-[#3A8B7E] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Get My Deals
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};