import React from 'react';

export const WelcomeSlide = ({ onNext }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-6xl mb-4 font-extrabold">
        Energy Lab
      </h1>
      <p className="text-lg md:text-xl opacity-80 mb-8 max-w-2xl mx-auto">
        We monitor real-time pricing data from every major provider to guarantee you access to the market's best energy deals.
      </p>
      <button
        onClick={onNext}
        className="bg-[#000000] hover:bg-[#FFFFFF] text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors duration-200 pointer-events-auto"
      >
        Get Started
      </button>
    </div>
  );
};