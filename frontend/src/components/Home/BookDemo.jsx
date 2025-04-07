import React, { useState, useCallback } from 'react';
import hero from "../../../public/demo.png";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BookDemo = () => {
    const userData = useSelector(state => state.user_info);
    const navigate = useNavigate(); // Initialize useNavigate
    const [inputform, setInputform] = useState({
        name: userData.name || "",
        phone: "",
        email: userData.email || "",
    });
    // Derived state
    const isDisabled = !inputform.name || !inputform.phone || !inputform.email;
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // More concise input change handler using useCallback for potential memoization
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setInputform(prevInputform => ({ ...prevInputform, [name]: value }));
    }, [setInputform]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("http://0.0.0.0:5000/api/addUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputform),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result['status'] === 200) {
                setSuccess("Successfully booked your demo session! An agent will contact you soon.");
                setError("");
                setTimeout(() => {
                    navigate('/welcome'); // Use navigate here
                }, 4000);
            } else {
                setError("Some error occurred. Please try again.");
                setSuccess("");
            }

        } catch (error) {
            console.error("Error submitting form data:", error);
            setError("An unexpected error occurred. Please try again.");
            setSuccess("");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setInputform(prevInputform => ({
                    name: userData.name || "",
                    phone: "",
                    email: userData.email || "",
                }));
                setSuccess("");
                setError("");
            }, 5000);
        }
    };

    return (
        <div className="py-5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="text-center md:text-left md:w-1/2 flex flex-col items-center justify-center">
                        <img
                            src={hero}
                            alt="Expense Analysis Demo"
                            className="mb-6 max-w-full md:max-w-[350px] lg:max-w-[400px]"
                            loading="lazy" // Add lazy loading for the image
                        />
                        <p className="text-xl font-medium text-gray-700">Experience <span className='text-[#c6252b]'>Expenso</span> live. Request your demo and discover its benefits.</p>
                    </div>

                    <div className="bg-white shadow-xl rounded-2xl p-8 md:w-1/2 border-2 border-red-500">
                        <h1 className="text-3xl font-bold text-center text-[#c6252b] mb-6">
                            Request a Demo
                        </h1>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2">Full Name</label>
                                <input type="text" id="name" value={inputform.name} onChange={handleInputChange} className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your full name" required />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-gray-700 text-lg font-semibold mb-2">Contact Number</label>
                                <input type="tel" id="phone" value={inputform.phone} onChange={handleInputChange} className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your contact number" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2">Email Address</label>
                                <input type="email" id="email" value={inputform.email} onChange={handleInputChange} className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your email address" required />
                            </div>

                            <div className="min-h-[2rem]">
                                {success && (
                                    <div className="text-green-500 text-lg font-semibold flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {success}
                                    </div>
                                )}
                                {error && (
                                    <div className="text-red-500 text-lg font-semibold flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {error}
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={isDisabled || isSubmitting} className={`${isDisabled || isSubmitting ? "bg-red-300" : "bg-[#c6252b]"} text-white font-semibold py-3 px-6 rounded-md w-full`}>
                                {isSubmitting ? <div className="w-6 h-6 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-white mx-auto"></div> : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDemo;