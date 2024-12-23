"use client"; // If using Next.js for Client Components
import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await axios.post("http://localhost:5786/api/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        setSuccess("Login successful!");
        console.log("User details:", response.data.user);
        // Handle successful login (e.g., store token, redirect, etc.)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
      <div className="absolute inset-0"></div>

      {/* Login Form */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm bg-white p-4 shadow-2xl rounded-lg border border-gray-200 ">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <img src="/kws.png" alt="Logo" className="h-24 w-28" />
          </div>

          <h2 className="text-3xl font-montserrat font-bold text-center text-gray-800 mb-2">Welcome <br /><span className="font-syne text-blue-400">KWSKW Portal</span></h2>
          <p className="text-center text-black mb-4">Login to your account</p>

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

            <div className="form-group">
              <label htmlFor="password" className="block text-black font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

            <button
              type="submit"
              className="w-full py-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don&apos;t have an account? <a href="/register" className="text-blue-500 font-semibold hover:underline">Register</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
