import React, { useEffect, useState } from 'react';
import { useGetAllExpenseQuery } from '../../services/expenseApi';
import { useSelector } from 'react-redux';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for the sidebar toggle

const Dashboard = () => {
    const { access_token } = useSelector((state) => state.auth);
    const [expenses, setExpenses] = useState([]);
    const [filter, setFilter] = useState('Weekly'); // Default filter value
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0); // Initialize to 0, will be dynamically set

    const { data, isSuccess, isError, isLoading } = useGetAllExpenseQuery({ access_token, filter });
    console.log("Expenses:", expenses, "Data:", data, "isSuccess:", isSuccess, "isError:", isError, "isLoading:", isLoading);

    useEffect(() => {
        if (data && isSuccess && !data.error) {
            setExpenses(data.data);
        } else if (data && isSuccess && data.error) {
            console.error("Error fetching expenses:", data.message);
        } else if (isError) {
            console.error("Error fetching expenses:", isError);
        }

        const nav = document.querySelector('nav'); 
        if (nav) {
            setNavbarHeight(nav.offsetHeight);
        }
    }, [data, isSuccess, isError]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gray-200 w-64 flex-shrink-0 h-screen p-4 transition-transform duration-300 ease-in-out fixed top-[${navbarHeight}px] left-0 h-[calc(100vh-${navbarHeight}px)] z-20 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* <div className="sidebar-header flex justify-end items-center mb-4">
                    <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div> */}
                <div className="sidebar-content">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Charts</h3>
                    <ul>
                        <li className="py-2 text-gray-600 cursor-pointer hover:text-gray-800">Overview</li>
                        <li className="py-2 text-gray-600 cursor-pointer hover:text-gray-800">Credit Breakdown</li>
                        <li className="py-2 text-gray-600 cursor-pointer hover:text-gray-800">Debit Breakdown</li>
                        <li className="py-2 text-gray-600 cursor-pointer hover:text-gray-800">Create Custom Chart</li>


                        {/* Add more filter options here */}
                    </ul>

                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                isSidebarOpen ? 'ml-64' : 'ml-0'
            }`}> 
                <div id='title' className='bg-white p-4 shadow-md flex items-center justify-between'>
                    <button onClick={toggleSidebar} className="text-gray-600 mr-4 focus:outline-none">
                        <FaBars className="h-6 w-6" />
                    </button>
                    <h1 className='text-xl font-semibold text-gray-800'>Overview</h1>
                    <select
                        name="time_range"
                        value={filter}
                        onChange={handleFilterChange}
                        className="p-2 border rounded text-gray-700 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        {/* Add more time range options if your backend supports them */}
                    </select>
                </div>

                {/* Content Area */}
                <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                  charts
                </main>
            </div>
        </div>
    );
};

export default Dashboard;