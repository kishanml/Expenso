import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import logo from "/logo.png";
import { useSelector } from 'react-redux';

const NavBar = ({ show }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userData = useSelector(state => state.user_info);

  const isActive = useCallback((path) => {
    return location.pathname === path ? 'text-[#c6252b]' : 'text-gray-500';
  }, [location.pathname]);

  const adminStatus = useMemo(() => {
    return userData?.is_admin === false ? 'BASIC' : 'ADMIN';
  }, [userData?.is_admin]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, [setIsMenuOpen]);

  return (
    <nav className="bg-white text-black p-4 mb-5 border-b-2 ">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" width={60} />
          <h1 className="text-3xl px-3 font-bold text-[#c6252b]">EXPENSO</h1>
        </Link>

        <div className="flex flex-grow justify-center space-x-4">
          <Link to="/welcome" className={`mx-2 ${isActive('/welcome')} font-medium text-xl transition duration-150 ease-in-out hover:text-[#a61e23]`}>Home</Link>
          <Link to="/contact" className={`mx-2 ${isActive('/contact')} font-medium text-xl transition duration-150 ease-in-out hover:text-[#a61e23]`}>Contact</Link>
          <Link to="/book-demo" className={`mx-2 ${isActive('/book-demo')} font-medium text-xl transition duration-150 ease-in-out hover:text-[#a61e23]`}>Demo</Link>
        </div>

        {show && (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex flex-col items-center px-4 py-2 gap-y-1 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
            >
              <div className='flex flex-row items-center gap-x-2'>
                <FaUser className="text-lg text-gray-600 h-4 w-4" />
                <span className="font-semibold text-sm text-gray-700 truncate max-w-[100px]">
                  {userData?.name ? userData.name : 'User'}
                </span>
                <FaAngleDown className={`text-sm text-gray-600 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              {userData?.is_admin !== false && (
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full bg-opacity-60 ${adminStatus === 'ADMIN' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700'}`}>
                  {adminStatus} - EXPENSO
                </span>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-10">
                <Link
                  to="/edit-profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/sign-out"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;