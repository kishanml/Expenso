import React, { useState } from "react";
import LoginHeader from "./LoginHeader";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";


const ForgotPassword = () => {


    const [email, setemail] = useState("")
    const isButtonDisabled = !email

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
    return (
        <div className="flex flex-col gap-y-6 w-full max-w-md">
            <LoginHeader />
            <form className="flex flex-col gap-y-5">
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
                    Reset password
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
