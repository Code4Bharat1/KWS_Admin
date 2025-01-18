"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for navigation
import axios from "axios";

const Forgot = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTokenSent, setIsTokenSent] = useState(false); // To track if the token is sent
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setError("Please enter your username");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(""); // Clear success message

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/forgot/forgotpassword`,
        { username }
      );
      setSuccess(response.data.message);
      setIsTokenSent(true); // Show the token input once token is sent
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    // Redirect to reset password page with the token entered by the user
    router.push(`/reset-password?token=${username}`); // Pass the token as a query parameter
  };

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/login.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-5"></div>

      {/* Forgot Password Form */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm bg-white p-4 shadow-2xl rounded-lg border border-gray-200 ">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <img src="/kws.png" alt="Logo" className="h-24 w-28" />
          </div>

          <h2 className="text-3xl font-montserrat font-bold text-center text-gray-800 mb-2">
            Forgot Password <br />
            <span className="font-syne text-blue-400">KWSKW Portal</span>
          </h2>
          <p className="text-center text-black mb-4">
            Enter your username to reset password
          </p>

          {!isTokenSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label htmlFor="username" className="block text-black font-semibold">
                  KWS ID
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

              <button
                type="submit"
                className="w-full py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Token"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="form-group">
                <label htmlFor="token" className="block text-black font-semibold">
                  Enter Token
                </label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your reset token"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Reset Page
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              <a href="/" className="text-blue-500 font-semibold hover:underline">
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
