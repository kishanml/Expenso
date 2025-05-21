import React, { useEffect, useState } from 'react';

import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Overview from "./Overview"


const Dashboard = () => {
    const [filter, setFilter] = useState('Weekly');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [activeTopic, setActiveTopic] = useState('Overview'); 
    const [arrowIcon, setArrowIcon] = useState(<MdOutlineKeyboardArrowRight className="h-10 w-10" />); 


    useEffect(() => {
        const nav = document.querySelector('nav');
        if (nav) {
            setNavbarHeight(nav.offsetHeight);
        }
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setArrowIcon(isSidebarOpen ? <MdOutlineKeyboardArrowRight className="h-10 w-10" /> : <MdOutlineKeyboardArrowLeft className="h-10 w-10" />);

    };

    const handleTopicClick = (topic) => {
        setActiveTopic(topic);
        // Optionally close the sidebar after selecting a topic
        // setIsSidebarOpen(false);
    };

    return (
        <div className="dashboard-container flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gray-200 w-64 flex-shrink-0 h-screen p-4 transition-transform duration-300 ease-in-out fixed top-[${navbarHeight}px] left-0 h-[calc(100vh-${navbarHeight}px)] z-20 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="sidebar-content">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Charts</h3>
                    <ul>
    <li
        className={`py-2 pl-4 text-gray-600 cursor-pointer hover:bg-gray-300 hover:rounded-lg ${activeTopic === 'Overview' ? 'font-bold bg-gray-300' : ''}`}
        onClick={() => handleTopicClick('Overview')}
    >
        Overview
    </li>
    <li
        className={`py-2 pl-4 text-gray-600 cursor-pointer hover:bg-gray-300 hover:rounded-lg ${activeTopic === 'Credit Breakdown' ? 'font-bold bg-gray-300' : ''}`}
        onClick={() => handleTopicClick('Credit Breakdown')}
    >
        Credit Breakdown
    </li>
    <li
        className={`py-2 pl-4 text-gray-600 cursor-pointer hover:bg-gray-300 hover:rounded-lg ${activeTopic === 'Debit Breakdown' ? 'font-bold bg-gray-300' : ''}`}
        onClick={() => handleTopicClick('Debit Breakdown')}
    >
        Debit Breakdown
    </li>
    <li
        className={`py-2 pl-4 text-gray-600 cursor-pointer hover:bg-gray-300 hover:rounded-lg ${activeTopic === 'Custom Chart' ? 'font-bold bg-gray-300' : ''}`}
        onClick={() => handleTopicClick('Custom Chart')}
    >
        Custom Chart
    </li>
</ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'ml-64' : 'ml-0'
            }`}>
               <div id='title' className='bg-white p-4 shadow-md flex items-center justify-between'>
                    <button onClick={toggleSidebar} className="text-gray-600 mr-4 focus:outline-none flex items-center">
                        {arrowIcon}
                    </button>
                    <h1 className='text-xl font-semibold text-gray-800'>{activeTopic}</h1> 
                    <select
                        name="time_range"
                        value={filter}
                        onChange={handleFilterChange}
                        className="p-2 border rounded text-gray-700 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>

                {/* Content Area */}
                <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                  {activeTopic === 'Overview' && (
                        <Overview  />
                    )}
                  {activeTopic === 'Credit Breakdown' && <div>Credit Breakdown Charts Go Here</div>}
                  {activeTopic === 'Debit Breakdown' && <div>Debit Breakdown Charts Go Here</div>}
                  {activeTopic === 'Custom Chart' && <div>Custom Chart Builder Go Here</div>}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;