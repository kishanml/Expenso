import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { useVerifyEmailQuery } from '../../services/userAuthApi'; // Assuming the hook is correctly set up

const VerifyEmail = () => {
  const [status, setStatus] = useState(null);
  const location = useLocation();

  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  const token = getQueryParam('token');

  const { data, error, isLoading } = useVerifyEmailQuery(token, { skip: !token });

  console.log(error)
  useEffect(() => {
    if (isLoading) {
      setStatus('Verifying your email...');
    } else if (error) {
      setStatus("Verification failed !");
    } else if (data) {
      setStatus('Verification successful!');
    }
  }, [data, error, isLoading]);

  return (
    <div className="flex justify-center items-center h-full bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 mt-36 rounded-lg shadow-lg border-2 border-gray-200">
        <h1 className="text-3xl text-center font-semibold text-gray-900 mb-6">Email Verification</h1>

        {/* Status message */}
        <p className="text-lg text-center text-gray-700">{status}</p>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-gray-900 rounded-full" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {/* Error handling */}
        {error && (
          <>
            <div className="mt-4 p-4 text-white bg-red-600 rounded-md text-center">
              {error.data.error}.
            </div>

            <div className="mt-8 text-center">
              {/* Resend verification email link */}
              <p className="text-sm text-gray-500">
                <a href="/resend-email" className="pl-2 text-[#c6252b] text-[14px] ">
                  Resend Verification Email
                </a>
              </p>
            </div>
          </>
        )}

        {/* Success handling */}
        {data && !isLoading && !error && (
          <div className="mt-4 p-4 text-white bg-green-600 rounded-md text-center">
            Your email has been successfully verified! You can now log in.
          </div>
        )}



        {/* Go to Login Page button */}
        <div className="mt-6 text-center">
          <Link to="/login">
            <p className='text-[#c6252b] text-[14px]'>Go to Login Page</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
