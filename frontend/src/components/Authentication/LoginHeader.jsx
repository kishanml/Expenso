import React from 'react'
import logo from "/logo.png";


const LoginHeader = () => {
    return (
        <>
            <div className="flex items-center gap-x-3 justify-center">
                <img className="h-16 md:h-20" src={logo} alt="Expenso Logo" />
                <p className="font-bold text-4xl md:text-7xl">Expenso</p>
            </div>
            <p className="text-center text-lg md:text-xl text-gray-700">
                Know Your Spending, Grow Your Savings.
            </p>
        </>
    );
};


export default LoginHeader
