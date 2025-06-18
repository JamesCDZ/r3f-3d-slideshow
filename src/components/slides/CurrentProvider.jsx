import React from 'react';

export const CurrentProvider = ({ onNext, onSupplierSelected }) => {

const onButtonSelected = (e) => {
  const value = e.target.value;
  console.log(value)
  onSupplierSelected({CurrentProvider: value})
  onNext()
};

const providers = [
  "British Gas",
  "Eon",
  "Octopus",
  "Shell Energy",
  "ScottishPower",
  "EDF",
  "SSE",
  "Utility Warehouse",
  "nPower",
  "OVO Energy",
  "Utilita",
  "Other"
];

  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Compelling subheading */}
      <h2 className="text-lg md:text-xl mb-2 font-semibold text-gray-800">
        Your Current Provider
      </h2>
      
      {/* Main value proposition */}
      <p className="text-base md:text-lg opacity-90 mb-6 max-w-2xl mx-auto">
       <b> Who is your current energy provider?</b>
      </p>

      {/* Process Steps - Responsive Layout */}
      <div className="mb-2 px-4">
        {/* Mobile: Vertical Stack */}
        <div className="flex flex-col gap-3 md:hidden max-w-sm mx-auto">
          {providers.map((provider) => (
            <button
              key={provider}
              value={provider}
              onClick={onButtonSelected}
              className="w-full py-3 px-4 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {provider}
            </button>
          ))}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {providers.map((provider) => (
            <button
              key={provider}
              value={provider}
              onClick={onButtonSelected}
              className="py-4 px-6 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
            >
              {provider}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};