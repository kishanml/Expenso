import React, { useState } from 'react';

const CustomCharts = () => {
    const [prompt, setPrompt] = useState('');

    return (
        <div className='mt-10  px-4 max-w-3xl mx-auto'>
            <h1 className='text-4xl text-[#c6252b] text-center font-bold mb-5'>
                Visualize your financial data, your way
            </h1>
            <h3 className='text-2xl text-center font-bold mb-8'>
                Expenso AI crafts personalized charts on demand.
            </h3>

            {/* Chart Area - This can later be replaced with an actual chart */}
            <div className='bg-white shadow-md rounded-md p-6' id='chart-area'>
                <div className='mb-6'>
                    <label className='block mb-2 text-lg font-medium'>What you want to visualize?</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className='w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6252b]'
                        rows={5}
                    placeholder="e.g., 'Show me my spending breakdown for the last 3 months by category', 'Compare my income vs expenses for the last year', 'Visualize my monthly savings trend'."
                    />
                </div>

             <div className="text-center">
                <button
                    className="px-6 py-2 bg-[#c6252b] text-white font-bold text-xl rounded-full shadow-lg hover:bg-[#a61e23] focus:outline-none focus:ring-4 focus:ring-[#c6252b]/50 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate
                </button>
            </div>

            </div>
        </div>
    );
};

export default CustomCharts;
