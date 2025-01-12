"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for navigation
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
  
    try {
      setError(""); // Clear previous errors
      setSuccess(""); // Clear success message
  
      const response = await axios.post("http://localhost:5786/api/auth/login", {
        username,
        password,
      }, { withCredentials: true }); // Ensure cookies are sent with the request
  
      if (response.status === 200) {
        setSuccess("Login successful!");
  
        // Log the entire response data to check the structure
        console.log("Backend Response:", response.data); // Log the response
  
        const { user } = response.data; // Get user data from the response
        console.log("User data:", user); // Check the user object structure
  
        // Ensure staffRoles is included in the response
        console.log("Staff Roles:", user.staffRoles);
  
        localStorage.setItem("userId", user.id); // Store user ID in localStorage
        localStorage.setItem("staffRoles", JSON.stringify(user.staffRoles)); // Store staff roles in localStorage
        router.push("/profile"); // Redirect to profile page
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
      <div className="absolute inset-0 bg-black bg-opacity-5"></div>

      {/* Login Form */}
      <div className="relative flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm bg-white p-4 shadow-2xl rounded-lg border border-gray-200 ">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <img src="/kws.png" alt="Logo" className="h-24 w-28" />
          </div>

          <h2 className="text-3xl font-montserrat font-bold text-center text-gray-800 mb-2">
            Welcome <br />
            <span className="font-syne text-blue-400">KWSKW Portal</span>
          </h2>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-blue-500 font-semibold hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
