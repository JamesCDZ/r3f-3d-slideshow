import React from 'react';

export const WelcomeSlide = ({ onNext }) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Compelling subheading */}
      <h2 className="text-lg md:text-xl mb-2 font-semibold text-gray-800">
        Data Driven Energy Deals
      </h2>
      
      {/* Main value proposition */}
      <p className="text-base md:text-lg opacity-90 mb-2 max-w-2xl mx-auto">
        We use EPC certificates and real-time pricing data to find deals tailored to your home.
        <span className="font-semibold text-green-700"> Save up to £500+ per year.</span>
      </p>

      {/* Process Steps - Responsive Layout */}
      <div className="mb-2 px-4">
        {/* Mobile: Vertical Stack */}
        <div className="flex flex-col gap-4 md:hidden max-w-sm mx-auto">
          {/* Step 1 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-black md:border-white/40 relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div className="text-lg mb-1 w-[30px] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Data Analysis</h3>
            <p className="text-gray-700 text-xs">EPC & property data from postcode</p>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-black md:border-white/40 relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div className="text-lg mb-1 w-[30px] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Contact Details</h3>
            <p className="text-gray-700 text-xs">Name, email & phone number</p>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-black md:border-white/40 relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div className="text-lg mb-1 w-[30px] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Privacy Settings</h3>
            <p className="text-gray-700 text-xs">Choose your data preferences in accordance with GDPR</p>
          </div>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:flex items-center justify-center">
          {/* Step 1 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 relative flex-1 max-w-[200px]">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div className="text-lg mb-1 w-[30px] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c-.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Data Analysis</h3>
            <p className="text-gray-700 text-xs">EPC & property data from postcode</p>
          </div>
          
          {/* Arrow between step 1 and 2 */}
          <div className="flex-shrink-0 mx-4">
            <svg className="w-6 h-6 text-[#4a9b8d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Step 2 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 relative flex-1 max-w-[200px]">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div className="text-lg mb-1 w-[30px] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Contact Details</h3>
            <p className="text-gray-700 text-xs">Name, email & phone number</p>
          </div>
          
          {/* Arrow between step 2 and 3 */}
          <div className="flex-shrink-0 mx-4">
            <svg className="w-6 h-6 text-[#4a9b8d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          
          {/* Step 3 */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 relative flex-1 max-w-[200px]">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div className="text-lg mb-1 w-[30px] mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Privacy Settings</h3>
            <p className="text-gray-700 text-xs">Choose your data preferences in accordance with GDPR</p>
          </div>
        </div>
      </div>

      {/* Enhanced CTA */}
      <div className="space-y-2">
        <button
          onClick={onNext}
          className="bg-[#4a9b8d] hover:from-green-700 hover:to-green-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 pointer-events-auto shadow-lg hover:shadow-xl"
        >
          Start Step 1: Find My Property
        </button>
        
        <p className="text-xs text-gray-600">
          ✓ Takes 2 minutes  ✓ No payment needed  ✓ Completely free
        </p>
      </div>

      {/* Process indicator */}
      <div className="mt-4 inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="font-medium text-blue-800">3 simple steps to savings</span>
      </div>
    </div>
  );
};