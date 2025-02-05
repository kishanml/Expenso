import React from 'react';
import Login from './Login';
import Hero from './Hero';

const LoginPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-4">
        <Login />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-4">
        <Hero />
      </div>
    </div>
  );
};

export default LoginPage;
