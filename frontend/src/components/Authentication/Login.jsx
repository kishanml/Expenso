import React, { useState,useEffect } from "react";
import LoginHeader from "./LoginHeader";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaInfoCircle,
    FaEnvelopeOpenText,
} from "react-icons/fa";


import { getToken, storeToken } from "../../services/LocalStorage";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../features/authSlice";
import {
    useLoginUserMutation,
} from "../../services/userAuthApi";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {

    const [form, setform] = useState({ email: "", password: "", remember_me: false });
    const [hidePassword, sethidePassword] = useState(true);

    // const [openErrorModal, setopenErrorModal] = useState(false)
    const [Error, setError] = useState("")

    // const closeErrorModal = () => {
    //     setopenErrorModal(false);
    // };

    useEffect(() => {
        if (Error) {
            // setform({ email: "", password: "", remember_me: false });
        }
    }, [Error]); 
    const HandleErrorMsg = () => {
        return (
            <div className="bg-red-500 text-white p-2 rounded-lg text-center mb-4">
                {Error}
            </div>
        );
    };

    const dispatch = useDispatch();

    const isButtonDisabled = !form.email || !form.password;

    const navigate = useNavigate();

    const [loginUser, { isLoginLoading }] = useLoginUserMutation();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            email: form.email,
            password: form.password,
        };

        const response = await loginUser(requestData);
        console.log(response);

        if (response.error) {

            console.log('here', response.error.data.errors.non_field_errors[0])
            setError(response.error.data.errors.non_field_errors[0])
        }

        if (response.data) {
            storeToken(response.data.token);
            let { access_token } = getToken(); 

            dispatch(setUserToken({ access_token: access_token }));
            console.log('here_already')
            setTimeout(() => {
                navigate("/welcome", {replace :true });
            }, 3000);
            console.log('done')
        }
    };

    const passwordVisibility = () => {
        sethidePassword((prevState) => !prevState);
    };

    return (
        <>
            <div className="flex flex-col gap-y-6 w-full max-w-md">
                {/* Logo and Title */}
                <LoginHeader />
                <form className="flex flex-col gap-y-6" onSubmit={handleLoginSubmit}>
                    {/* Email Input */}

                    {Error && HandleErrorMsg()}

                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="email"
                            id="email"
                            className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => setform({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type={hidePassword ? "password" : "text"}
                            id="password"
                            className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setform({ ...form, password: e.target.value })}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            onClick={passwordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {hidePassword ? (
                                <FaEye className="w-5 h-5" />
                            ) : (
                                <FaEyeSlash className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="flex justify-between text-gray-700 text-lg">
                        <label className="flex items-center gap-x-2">
                            <input
                                type="checkbox"
                                className="rounded h-5 w-5"
                                checked={form.remember_me}
                                onChange={(e) => setform({ ...form, remember_me: e.target.checked })}
                            />
                            Remember Me
                        </label>
                        <Link to="/reset-password">
                            <button
                                className="text-[#c6252b] cursor-pointer hover:underline">
                                Forgot Password?
                            </button>
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`${isButtonDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-700 hover:bg-red-600"
                            } text-white text-lg font-semibold rounded-lg p-2.5 w-full transition duration-200`}
                        disabled={isButtonDisabled}
                    >
                        Login
                    </button>

                    {/* Account Creation Link */}
                    <h1 className="text-lg md:text-lg tracking-wide text-center mt-4">
                        Not an Expenso user?{" "}
                        <span className="ml-2 ">
                            <Link to="/create-account">

                                <button
                                    className="text-[#c6252b] cursor-pointer hover:underline" >
                                    Create an account
                                </button>
                            </Link>
                        </span>
                    </h1>
                </form>
               
            </div>
        </>
    );
};

export default Login;
