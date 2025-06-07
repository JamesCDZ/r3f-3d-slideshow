import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { scenes } from "./Experience";
import { WelcomeSlide } from "./slides/WelcomeSlide";
import { PostcodeSlide } from "./slides/PostcodeSlide";
import { ContactSlide } from "./slides/ContactSlide";
import { PrivacySlide } from "./slides/PrivacySlide";

export const slideAtom = atom(0);

// Form data atoms
export const formDataAtom = atom({
  postcode: "",
  address: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  marketingOptOut: false,
  // Additional address fields from Vue component
  house: "",
  street: "",
  town: "",
  county: "",
  uprn: "",
  addressLine1: "",
  addressLine2: "",
  ecoEligible: false,
  baxterKellyEligible: false,
  product_id: false,
  des_id: false,
});

export const Overlay = () => {
  const [slide, setSlide] = useAtom(slideAtom);
  const [displaySlide, setDisplaySlide] = useState(slide);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useAtom(formDataAtom);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    setVisible(false);
    setTimeout(() => {
      setDisplaySlide(slide);
      setVisible(true);
    }, 2600);
  }, [slide]);

  const nextSlide = () => {
    if (slide < 3) { // Allow up to slide 3 (4 total slides: 0,1,2,3)
      setSlide(slide + 1);
    }
  };

  const prevSlide = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  const handleAddressSelected = (addressData) => {
    setFormData(prev => ({ ...prev, ...addressData }));
  };

  const handleContactSubmit = (contactData) => {
    setFormData(prev => ({ ...prev, ...contactData }));
    nextSlide(); // Move to privacy slide
  };

  const handleFinalSubmit = (finalFormData) => {
    setFormData(finalFormData);
    
    // Handle form submission here (send to API, etc.)
    console.log("Form submitted:", finalFormData);
    alert("Thank you! We'll be in touch soon with your energy options.");
  };

  const renderSlideContent = () => {
    switch (displaySlide) {
      case 0:
        return <WelcomeSlide onNext={nextSlide} />;

      case 1:
        return (
          <PostcodeSlide 
            onNext={nextSlide} 
            onAddressSelected={handleAddressSelected}
          />
        );

      case 2:
        return (
          <ContactSlide 
            onSubmit={handleContactSubmit}
            onBack={prevSlide}
            addressData={formData}
          />
        );

      case 3:
        return (
          <PrivacySlide 
            onSubmit={handleFinalSubmit}
            onBack={prevSlide}
            formData={formData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`fixed z-10 top-0 left-0 bottom-0 right-0 flex flex-col justify-between pointer-events-none text-black ${
          visible ? "" : "opacity-0"
        } transition-opacity duration-1000`}
      >
        {/* Logo with backdrop blur */}
        <div className="relative mt-8 flex justify-center">
          <div className="rounded-xl p-4">
            <img 
              src="/logo.png" 
              className="w-80 mx-auto"
              alt="Energy Lab"
            />
          </div>
        </div>
        
        {/* Navigation arrows - only show on welcome slide */}


        {/* Main content area with enhanced backdrop blur */}
        <div className="relative">
          {/* Backdrop blur background */}
          <div className="absolute inset-0"></div>
          
          {/* Content container */}
          <div className="relative pt-4 md:pt-16 pb-8 md:pb-24 p-4 flex items-center flex-col">
            {/* Additional content background for better readability */}
            <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-2 md:p-8 shadow-xl border border-white/40 max-w-4xl w-full">
              {renderSlideContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};