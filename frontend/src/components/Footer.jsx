import React from 'react';
import logo from "/logo.png";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-white border-t-2 text-black p-6 mt-5 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Link to="/welcome">
            <div className='flex'>
              <img src={logo} alt="Logo" width={60} />
              <h1 className="text-3xl px-3 font-bold text-[#c6252b]">EXPENSO</h1>
            </div>
          </Link>
        </div>

        <div className="flex space-x-6">
          <a href="https://facebook.com" className="text-gray-600 hover:text-[#c6252b]">Facebook</a>
          <a href="https://twitter.com" className="text-gray-600 hover:text-[#c6252b]">Twitter</a>
          <a href="https://linkedin.com" className="text-gray-600 hover:text-[#c6252b]">LinkedIn</a>
          <a href="https://instagram.com" className="text-gray-600 hover:text-[#c6252b]">Instagram</a>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>© 2025 EXPENSO. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
