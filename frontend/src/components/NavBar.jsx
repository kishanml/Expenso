import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import logo from "/logo.png";

const NavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'text-[#c6252b]' : 'text-gray-500';
  };

  return (
    <nav className="bg-white text-black p-4 mb-5 border-b-2 ">
      <div className="flex justify-between items-center">
      <Link to="/welcome">
        <div className='flex'>
        <img src={logo} alt="Logo" width={60} />
        <h1 className="text-3xl px-3 font-bold text-[#c6252b]">EXPENSO</h1>
        </div>
      </Link>

      <div className="flex flex-grow justify-center space-x-4">
        <Link to="/welcome" className={`mx-2 ${isActive('/welcome')} font-medium text-xl`}>Home</Link>
        <Link to="/contact-us" className={`mx-2 ${isActive('/contact-us')} font-medium text-xl`}>Contact Us</Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          <CgProfile className="text-2xl" />
          <span className="font-semibold text-lg px-1">Admin</span>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
            <Link to="/edit-profile" className="block px-4 py-2 text-black hover:bg-gray-100">Edit Profile</Link>
            <Link to="/sign-out" className="block px-4 py-2 text-black hover:bg-gray-100">Sign Out</Link>
          </div>
        )}
      </div>
    </div>
    </nav >
  );
};

export default NavBar;
