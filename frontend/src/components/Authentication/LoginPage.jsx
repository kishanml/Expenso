import React from 'react';
import Hero from './Hero';
import mobtail from "../../assets/mob_tail.png";
import { Outlet } from 'react-router-dom';

const LoginPage = () => {
  return (
    <>
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-4">
        <Outlet />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-4 relative">
        <Hero />
      </div>

      {/* Mobile Footer: Render only on mobile screens */}
    </div>
      {/* <div className="md:hidden absolute bottom-0 left-0 w-full flex mt-56 justify-center">
        <img 
          src={mobtail} 
          alt="Mobile Tail" 
          className="w-full object-contain" // Stretch across full width but keep height small
        />
      </div> */}
      </>
  );
};

export default LoginPage;
