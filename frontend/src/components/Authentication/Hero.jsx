import React from 'react';
import hero_img from '../../assets/hero_1.png';

const Hero = () => {
  console.log("hero here")
  return (
    <div className="bg-gray-50 flex flex-col items-center text-center py-12">
      <img
        src={hero_img}
        className="w-full h-[600px] hidden md:block"  
        alt="Hero"
      />
    </div>
  );
};

export default Hero;
