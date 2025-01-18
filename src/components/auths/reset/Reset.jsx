"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for navigation
import axios from "axios";

const Reset = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // For showing loading state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !newPassword) {
      setError("Token and new password are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    setSuccess(""); // Clear success message

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/forgot/resetpassword`, { token, newPassword });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {/* Reset Password Form */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm bg-white p-4 shadow-2xl rounded-lg border border-gray-200 ">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <img src="/kws.png" alt="Logo" className="h-24 w-28" />
          </div>

          <h2 className="text-3xl font-montserrat font-bold text-center text-gray-800 mb-2">
            Reset Password <br />
            <span className="font-syne text-blue-400">KWSKW Portal</span>
          </h2>
          <p className="text-center text-black mb-4">Enter your token and new password</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="token" className="block text-black font-semibold">
                Reset Token
              </label>
              <input
                type="text"
                id="token"
                name="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter reset token"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="block text-black font-semibold">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

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

export default Reset;
