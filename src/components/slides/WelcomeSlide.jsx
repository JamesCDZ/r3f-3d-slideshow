import React from 'react';

export const WelcomeSlide = ({ onNext }) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Main heading */}
      
      {/* Compelling subheading */}
      <h2 className="text-lg md:text-xl mb-4 font-semibold text-gray-800">
        Find the UK's Best Energy Deals in Minutes
      </h2>
      
      {/* Main value proposition */}
      <p className="text-base md:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
        We have access to EPC certificates and real-time pricing data to find deals tailored to your home.
        <span className="font-semibold text-green-700"> Save up to £500+ per year.</span>
      </p>

      {/* Process Steps - Updated */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-xs md:text-sm">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </div>
          <div className="text-lg mb-1">🏠</div>
          <h3 className="font-semibold text-gray-800">Data Analysis</h3>
          <p className="text-gray-700">EPC & property data from postcode</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
            2
          </div>
          <div className="text-lg mb-1">📞</div>
          <h3 className="font-semibold text-gray-800">Contact Details</h3>
          <p className="text-gray-700">Name, email & phone number</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40 relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#4a9b8d] text-white rounded-full flex items-center justify-center text-xs font-bold">
            3
          </div>
          <div className="text-lg mb-1">🔒</div>
          <h3 className="font-semibold text-gray-800">Privacy Settings</h3>
          <p className="text-gray-700">Choose your data preferences</p>
        </div>
      </div>

      {/* Trust indicators - compact */}
      <div className="flex justify-center gap-4 mb-6 text-xs opacity-80">
        <span>✓ 500k+ customers</span>
        <span>✓ 4.8/5 rated</span>
        <span>✓ Avg. £420 saved</span>
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