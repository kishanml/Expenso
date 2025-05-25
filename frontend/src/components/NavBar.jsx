import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";

import logo from "/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useGetLoggedUserQuery } from "../services/userAuthApi";
import { getToken, removeToken } from "../services/LocalStorage";
import { unSetUserToken } from "../features/authSlice";

const NavBar = ({ show }) => {
    const { access_token } = getToken();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const dropdownRef = useRef(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userData = useSelector((state) => state.user_info);

    const isActive = useCallback(
        (path) => {
            return location.pathname === path
                ? "text-[#c6252b]"
                : "text-gray-500";
        },
        [location.pathname]
    );

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, [setIsMenuOpen]);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    }, [dropdownRef, setIsMenuOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    const { data, isSuccess } = useGetLoggedUserQuery(access_token);

    return (
        <nav className="bg-white text-black p-4 mb-5 border-b-2 sticky top-0 z-50">
            <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Logo" width={60} />
                    <h1 className="text-3xl px-3 font-bold text-[#c6252b]">
                        EXPENSO
                    </h1>
                </Link>

                <div className="flex flex-grow justify-center space-x-6">
                    <Link
                        to="/welcome"
                        className={`mx-2 ${isActive(
                            "/welcome"
                        )} font-medium text-xl transition duration-150 ease-in-out hover:text-[#a61e23]`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/contact"
                        className={`mx-2 ${isActive(
                            "/contact"
                        )} font-medium text-xl transition duration-150 ease-in-out hover:text-[#a61e23]`}
                    >
                        Contact
                    </Link>
                   
                    <Link
                        to="/book-demo"
                        className={`mx-2 ${isActive(
                            "/book-demo"
                        )} font-medium text-xl transition duration-150 ease-in-out hover:text-[#a61e23]`}
                    >
                        Book Demo
                    </Link>
                </div>

                {show && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={toggleMenu}
                            className="flex flex-col items-center px-4 py-2 gap-y-1 bg-gray-200 hover:bg-gray-300 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md"
                        >
                            <div className="flex flex-row items-center gap-x-2">
                                <FaUser className="text-lg text-gray-600 h-4 w-4" />
                                <span className="font-semibold text-sm text-gray-700">
                                    {data?.name ? data.name : "User"}
                                </span>
                                <FaAngleDown />
                            </div>
                            <span
                                className={`text-xs font-regular px-2 py-0.5 rounded-full `}
                            >
                                {`${data?.is_admin ? "ADMIN" : "BASIC"}`} -
                                EXPENSO
                            </span>
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-10">
                                <Link
                                    to="/edit-profile"
                                    className="block px-4 w-full text-start py-2  text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Edit Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        removeToken();
                                        dispatch(
                                            unSetUserToken({
                                                access_token: null,
                                            })
                                        );
                                        navigate("/");
                                    }}
                                    className="block px-4 w-full text-start py-2  text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;