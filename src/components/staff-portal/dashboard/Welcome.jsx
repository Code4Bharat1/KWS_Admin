import React from 'react';
 

const Welcome = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/login.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Container */}
      <div className="relative z-10 bg-white p-12 rounded-lg shadow-lg text-center z-5">
        {/* Logo */}
        <img
          src='./kws.png'
          alt="KWS Portal Logo"
          className="mx-auto mb-8 w-24" // Adjust width as needed
        />
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">Welcome to KWS Portal</h1>
        <p className="text-lg text-gray-600">We are glad to have you here. Explore and manage your tasks easily!</p>
      </div>
    </div>
  );
}

export default Welcome;
