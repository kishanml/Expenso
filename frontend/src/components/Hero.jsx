import React from 'react';
import hero_img from '/hero.png';

const Hero = () => {
  return (
    <div className="bg-gray-50 flex flex-col items-center text-center py-12">
      <img
        src={hero_img}
        className="w-full h-[600px] hidden md:block"  // Hide on mobile (default) and show on medium screens and above
        alt="Hero"
      />
    </div>
  );
};

export default Hero;
