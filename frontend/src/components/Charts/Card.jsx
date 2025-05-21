import React from 'react';

const Card = ({ title, data }) => {
    const isIncreased = data.current > data.previous;
    const diffAmount = Math.abs(data.difference).toLocaleString();
    const diffText = data.difference === 0
        ? 'No change'
        : `${isIncreased ? '↑' : '↓'} ₹${diffAmount}`;

    return (
        <div className="bg-white rounded-lg shadow-md p-5">
            <h2 className="text-gray-700 text-lg font-semibold mb-2">{title}</h2>
            <p className="text-3xl font-bold text-gray-900">₹{data.current.toLocaleString()}</p>
            <p className={`text-sm mt-1 ${isIncreased ? 'text-red-600' : 'text-green-600'}`}>
                {diffText} compared to last period
            </p>
            <p className="text-xs text-gray-500 mt-2">Previous: ₹{data.previous.toLocaleString()}</p>
        </div>
    );
};

export default Card
