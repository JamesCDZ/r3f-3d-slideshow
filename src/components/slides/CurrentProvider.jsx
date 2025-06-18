import React from 'react';

export const CurrentProvider = ({ onNext, onSupplierSelected }) => {

const onButtonSelected = (e) => {
  const value = e.target.value;
  console.log(value)
  onSupplierSelected({CurrentProvider: value})
  onNext()
};

  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Compelling subheading */}
      <h2 className="text-lg md:text-xl mb-2 font-semibold text-gray-800">
        Your Current Provider
      </h2>
      
      {/* Main value proposition */}
      <p className="text-base md:text-lg opacity-90 mb-2 max-w-2xl mx-auto">
        Who is your current energy provider?
      </p>

      {/* Process Steps - Responsive Layout */}
      <div className="mb-2 px-4">
        {/* Mobile: Vertical Stack */}
        <div className="flex flex-col gap-4 md:hidden max-w-sm mx-auto">

        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:flex items-center justify-center">

        <button value={"Scottish Power"} onClick={onButtonSelected}>
          Scottish Power
        </button>

        <button value={"British Gas"} onClick={onButtonSelected}>
          British Gas
        </button>

        </div>
      </div>
    </div>
  );
};
