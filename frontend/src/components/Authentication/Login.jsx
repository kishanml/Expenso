import React, { useState } from "react";
import logo from "/logo.png";
import { useNavigate } from "react-router";

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaInfoCircle,
} from "react-icons/fa";
import { storeToken } from "../../services/LocalStorage";
import { useDispatch } from "react-redux";

import { setUserToken } from "../../features/authSlice";
import {
    useLoginUserMutation,
    useRegisterUserMutation,
    useSendPasswordResetEmailMutation,
} from "../../services/userAuthApi";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const LoginHeader = () => {
    return (
        <>
            {" "}
            <div className="flex items-center gap-x-3 justify-center">
                <img className="h-16 md:h-20" src={logo} alt="Expenso Logo" />
                <p className="font-bold text-4xl md:text-7xl">Expenso</p>
            </div>
            <p className="text-center text-lg md:text-2xl text-gray-700">
                Know Your Spending, Grow Your Savings
            </p>
        </>
    );
};

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setrepassword] = useState("");
    const [state, setstate] = useState(0);
    const [hidePassword, sethidePassword] = useState(true);

    const isRePassword = repassword && password != repassword;

    const isButtonDisabled =
        (state == 0 && (!email || !password)) ||
        (state == 2 && (!email || email == "")) ||
        (state == 1 && isRePassword);

    const [loginUser, { isLoginLoading }] = useLoginUserMutation();
    const [registerUser, { isRegistrationLoading }] = useRegisterUserMutation();

    const [sendPasswordResetEmail, { isPasswordResetLoading }] =
        useSendPasswordResetEmailMutation();

    let navigate = useNavigate();

    console.log(
        email,
        state,
        !email || email == "",
        "password",
        password,
        repassword,
        isRePassword
    );

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setrepassword("");
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const requestData = {
            email: email,
            password: password,
        };
        const response = await loginUser(requestData);
        console.log(response);
        if (response.error) {
            // Show error message
        }

        if (response.data) {
            storeToken(response.data.token);
            let { access_token } = getToken();
            dispatch(setUserToken({ access_token: access_token }));
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);
            navigate("/welcome", { state: { data: response_data } });
        }
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        // const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(register_data.password);
        const res = await registerUser(register_data);
        console.log(res);
        if (res.error) {
            console.log(res.error.data.errors.email);
            // navigate("/message", {
            //   state: { server_msg: res.error.data.errors.email[0] },
            // });
        }
        if (res.data) {
            console.log(res.data);
            // navigate("/message", { state: { server_msg: res.data.msg } });
        }
    };

    const handleForgetPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await sendPasswordResetEmail(form);
        // console.log(res);
        if (res.error) {
            console.log(res.error.data.errors);
        }

        if (res.data) {
            console.log(res.data);
            document.getElementById("password-reset-form").reset();
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

                {/* Form Section */}
                {state === 0 ? (
                    <form className="flex flex-col gap-y-6">
                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                id="email"
                                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                />
                                Remember Me
                            </label>
                            <button
                                className="text-[#c6252b]  cursor-pointer hover:underline text-[#c6252b"
                                onClick={() => setstate(2)}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={handleLoginSubmit}
                            className={`${
                                isButtonDisabled
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
                                <button
                                    className="text-[#c6252b]  cursor-pointer hover:underline text-[#c6252b"
                                    onClick={() => setstate(1)}
                                >
                                    Create an account
                                </button>
                            </span>
                        </h1>
                    </form>
                ) : state === 1 ? (
                    <form className="flex flex-col gap-y-6">
                        <p className="text-xl text-center">
                            Create new account
                        </p>
                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                id="email"
                                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type={hidePassword ? "password" : "text"}
                                id="repassword"
                                className="outline-none bg-gray-50 border text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Re-enter your password"
                                value={repassword}
                                onChange={(e) => setrepassword(e.target.value)}
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
                        {isRePassword && (
                            <div className="flex flex-row items-center gap-x-1">
                                <FaInfoCircle className="w-4 h-4 text-red-700" />
                                <h1 className="text-red-700">
                                    The password and confirmation password do
                                    not match.
                                </h1>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`${
                                isButtonDisabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-700 hover:bg-red-600"
                            } text-white text-lg font-semibold rounded-lg p-2.5 w-full transition duration-200`}
                            disabled={isButtonDisabled}
                        >
                            Create Account
                        </button>

                        {/* Back to Login Page */}
                        <span className="ml-2 text-center">
                            <button
                                className="text-[#c6252b]  cursor-pointer hover:underline text-[#c6252b"
                                onClick={() => {
                                    setstate(0), resetForm();
                                }}
                            >
                                Back to login page
                            </button>
                        </span>
                    </form>
                ) : state === 2 ? (
                    <form className="flex flex-col gap-y-5">
                        <h1 className="font-bold text-2xl justify-start">
                            Reset your password
                        </h1>
                        <p className="text-xl justify-start text-gray-700">
                            Enter your email address, we'll send you
                            instructions to reset your password.
                        </p>
                        {/* Email Input */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="email"
                                id="email"
                                className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`${
                                isButtonDisabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-700 hover:bg-red-600"
                            } text-white text-lg font-semibold rounded-lg p-2.5 w-full transition duration-200`}
                            disabled={isButtonDisabled}
                        >
                            Reset password
                        </button>

                        {/* Account Creation Link */}
                        <span className="ml-2 text-center">
                            <button
                                className="text-[#c6252b]  cursor-pointer hover:underline text-[#c6252b"
                                onClick={() => {
                                    setstate(0), resetForm();
                                }}
                            >
                                Back to login page
                            </button>
                        </span>
                    </form>
                ) : null}
            </div>
        </>
    );
};

export default Login;
