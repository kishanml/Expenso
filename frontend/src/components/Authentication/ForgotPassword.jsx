import React, { useState } from "react";
import LoginHeader from "./LoginHeader";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope ,FaSpinner} from "react-icons/fa";

import { useSendPasswordResetEmailMutation } from "../../services/userAuthApi";


const ForgotPassword = () => {


    const [email, setemail] = useState("")
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const isButtonDisabled = !email


    const [ForgotPassword, { isForgotPasswordLoading }] = useSendPasswordResetEmailMutation();


    const handleForgetPasswordSubmit = async (e) => {

        e.preventDefault();

        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        const res = await ForgotPassword({ email: email });
        setIsLoading(false);

        console.log(res);
        if (res.error) {
            setErrorMessage(res.error.data.errors.email[0]);
        }
        if (res.data) {
            setSuccessMessage(res.data.msg);
        }
        if (res.data) {
            setTimeout(() => {
                navigate("/")
            }, 3000);
        }
    };
    return (
        <div className="flex flex-col gap-y-6 w-full max-w-md">
            <LoginHeader />
            <form className="flex flex-col gap-y-5" onSubmit={handleForgetPasswordSubmit}>

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
                <h1 className="font-bold text-2xl justify-start">
                    Reset your password
                </h1>
                <p className="text-xl justify-start text-gray-700">
                    Enter your email address, we'll send you
                    instructions to reset your password.
                </p>
                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="email"
                        id="email"
                        className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`${isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-700 hover:bg-red-600"
                        } text-white text-lg font-semibold rounded-lg p-2.5 w-full transition duration-200`}
                    disabled={isButtonDisabled}
                >
                    {isLoading ? (
                        <FaSpinner className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                        "Reset Password"
                    )}
                </button>

                <span className="ml-2 text-center">
                    <Link to="/">
                        <button
                            className="text-[#c6252b]  cursor-pointer hover:underline text-[#c6252b"

                        >
                            Back to login page
                        </button>
                    </Link>
                </span>
            </form>



        </div>
    )
}

export default ForgotPassword
