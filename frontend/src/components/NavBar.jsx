import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({name}) => {
  return (
    <nav className="bg-[#c6252b] text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My App</h1>
        <div>
          <Link to="/" className="text-white hover:text-gray-300 mx-2">Home</Link>
          <Link to="/welcome" className="text-white hover:text-gray-300 mx-2">Welcome</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
