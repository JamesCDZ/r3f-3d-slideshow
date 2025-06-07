import React from 'react';

export const WelcomeSlide = ({ onNext }) => {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Main heading */}
      {/* <div className="rounded-xl p-4">
            <img 
              src="/logo.png" 
              className="w-80 mx-auto"
              alt="Energy Lab"
            />
          </div> */}
      
      {/* Compelling subheading */}
      <h2 className="text-lg md:text-xl mb-4 font-semibold text-gray-800">
        Find the UK's Best Energy Deals in Minutes
      </h2>
      
      {/* Main value proposition */}
      <p className="text-base md:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
        We use EPC certificates and real-time pricing data to find deals tailored to your home.
        <span className="font-semibold text-green-700"> Save up to £500+ per year.</span>
      </p>

      {/* Key benefits - compact grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-xs md:text-sm">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40">
          <div className="text-lg mb-1">📊</div>
          <h3 className="font-semibold text-gray-800">Precision Data</h3>
          <p className="text-gray-700">EPC + real-time pricing</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40">
          <div className="text-lg mb-1">💰</div>
          <h3 className="font-semibold text-gray-800">Guaranteed Savings</h3>
          <p className="text-gray-700">Better deal or money back</p>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/40">
          <div className="text-lg mb-1">🔒</div>
          <h3 className="font-semibold text-gray-800">100% Free</h3>
          <p className="text-gray-700">No hidden fees ever</p>
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
          Find My Best Deal Now
        </button>
        
        <p className="text-xs text-gray-600">
          ✓ Takes 2 minutes  ✓ No details needed yet  ✓ Completely free
        </p>
      </div>

      {/* Urgency element - compact */}
      <div className="mt-4 inline-flex items-center gap-2 bg-orange-100/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="font-medium text-orange-800">Total market visibility</span>
      </div>
    </div>
  );
};