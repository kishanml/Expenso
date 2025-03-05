import React, { useState } from "react";
import LoginHeader from "./LoginHeader";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaInfoCircle, FaUser,FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/userAuthApi";


const CreateAccount = () => {
    const [form, setform] = useState({ name: "", email: "", password: "", password2: "" });
    const [hidePassword, sethidePassword] = useState(true);
    const [hideCPassword, sethideCPassword] = useState(true);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState({ email: "", password: "", password2: "" });

    const isButtonDisabled = !form.email || !form.password || !form.password2 || !form.name;
    const isRePassword = form.password != form.password2;

    const passwordVisibility = () => {
        sethidePassword(prevState => !prevState);
    };

    const passwordVisibility2 = () => {
        sethideCPassword(prevState => !prevState);
    };
    const PWD_REGEX = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setform(prev => ({ ...prev, [id]: value }));

        if (id === "email") {
            const emailError = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? "" : "Invalid email format.";
            setErrors(prev => ({ ...prev, email: emailError }));
        }

        if (id === "password") {
            const passwordError = PWD_REGEX.test(value) ? "" : "Password must be at least 6 characters, contain a number, a special character, and an uppercase letter.";
            setErrors(prev => ({ ...prev, password: passwordError }));
        }

        if (id === "password2") {
            const repasswordError = value === form.password ? "" : "Passwords do not match.";
            setErrors(prev => ({ ...prev, password2: repasswordError }));
        }
    };

    const navigate = useNavigate()

    // Handle Registration APIs

    const [registerUser, { isRegistrationLoading }] = useRegisterUserMutation();

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();

        // console.log(form)
        setIsLoading(true);  
        setSuccessMessage(""); 
        setErrorMessage("");  

        const res = await registerUser(form);
        // console.log(res);
        setIsLoading(false);

        if (res.error) {
            // console.log(res.error.data.errors.email);
            setErrorMessage(res.error.data.errors.email[0]);
        }
        if (res.data) {
            // console.log(res.data);
            setSuccessMessage(res.data.msg);
        }
        if (res.data) {
            setTimeout(() => {
                navigate("/")
            },3000);
        }

    }


return (
    <div className="flex flex-col gap-y-6 w-full max-w-md">
        <LoginHeader />
        <form className="flex flex-col gap-y-6" onSubmit={handleRegistrationSubmit} >
            <p className="text-xl text-center">Create new account</p>


            <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    id="name"
                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Enter your username"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Email Input */}
            <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type="email"
                    id="email"
                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>
            {(errors.email && form.email) && (
                <div className="flex flex-row items-center gap-x-2 mt-[-10px] mb-[-10px]">
                    <FaInfoCircle className="w-4 h-4 text-red-700" />
                    <h1 className="text-red-700">{errors.email}</h1>
                </div>)}

            {/* Password Input */}
            <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type={hidePassword ? "password" : "text"}
                    id="password"
                    className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                />
                <button
                    type="button"
                    onClick={passwordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                    {hidePassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                </button>
            </div>
            {(errors.password && form.password) && (
                <div className="flex flex-row items-center gap-x-2 mt-[-10px] mb-[-10px]">
                    <div className="flex mb-5"><FaInfoCircle className="w-4 h-4 text-red-700" /></div>
                    <h1 className="text-red-700">{errors.password}</h1>
                </div>)}
            {/* Re-enter Password */}
            <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type={hideCPassword ? "password" : "text"}
                    id="password2"
                    className="outline-none bg-gray-50 border text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Re-enter your password"
                    value={form.password2}
                    onChange={handleChange}
                    required
                    minLength="6"
                />
                <button
                    type="button"
                    onClick={passwordVisibility2}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                >
                    {hideCPassword ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                </button>
            </div>

            {(isRePassword && form.password2) && (
                <div className="flex flex-row items-center gap-x-2 mt-[-10px] mb-[-10px]">
                    <div className="flex "><FaInfoCircle className="w-4 h-4 text-red-700" /></div>
                    <h1 className="text-red-700">{errors.password2}</h1>
                </div>
            )}
            {/* Show error message */}
            {errorMessage && (
                <div className="bg-red-500 text-white p-4 rounded-lg mt-4 text-center">
                    {errorMessage}
                </div>
            )}

            {/* Show success message */}
            {successMessage && (
                <div className="bg-green-500 text-white p-4 rounded-lg mt-4 text-center">
                    {successMessage}
                </div>
            )}
            {/* Submit Button */}
            <button
                type="submit"
                className={`${isButtonDisabled || errors.email || errors.password || errors.password2
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-600"
                    } text-white text-lg font-semibold rounded-lg p-2.5 w-full transition duration-200`}
                disabled={isButtonDisabled || errors.email || errors.password || errors.password2}
            >
                {isLoading ? (
                    <FaSpinner className="w-5 h-5 animate-spin mx-auto" />  // Show spinner while loading
                ) : (
                    "Create Account"
                )}
            </button>

            {/* Back to Login Page */}
            <span className="ml-2 text-center">
                <Link to='/'>
                    <button className="text-[#c6252b] cursor-pointer hover:underline">Back to login page</button>
                </Link>
            </span>
        </form>
    </div>
);
}

export default CreateAccount;
