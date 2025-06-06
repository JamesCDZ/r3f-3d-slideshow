import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { scenes } from "./Experience";
import { WelcomeSlide } from "./slides/WelcomeSlide";
import { PostcodeSlide } from "./slides/PostcodeSlide";
import { ContactSlide } from "./slides/ContactSlide";

export const slideAtom = atom(0);

// Form data atoms
export const formDataAtom = atom({
  postcode: "",
  address: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
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
    if (slide < scenes.length - 1) {
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
    const finalFormData = { ...formData, ...contactData };
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
        <img 
          src="/logo.png" 
          className="w-80 mx-auto mt-8"
          alt="Energy Lab"
        />
        
        {/* Navigation arrows - only show on welcome slide */}
        {displaySlide === 0 && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex-1 flex items-center justify-between p-4">
            <svg
              onClick={prevSlide}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 pointer-events-auto hover:opacity-60 transition-opacity cursor-pointer"
              onClick={nextSlide}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        )}

        <div className="bg-gradient-to-t from-white/90 pt-20 pb-10 md:pb-24 p-4 flex items-center flex-col">
          {renderSlideContent()}
        </div>
      </div>
    </>
  );
};