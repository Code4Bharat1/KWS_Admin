"use client"; // For Next.js Client Components
import React, { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code"; // Import QRCode component

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5786/api/profile/getprofile/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setUserData(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const { username, core_kwsmember } = userData || {};
  const profilePic = core_kwsmember?.profilePicture;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen mt-8 bg-gray-100 flex flex-col items-center justify-center">
      {/* Desktop View */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-700 h-40"></div>
        <div className="relative -mt-20 flex justify-center">
          <img
            src={
              profilePic || "https://via.placeholder.com/150?text=No+Image"
            }
            alt="Profile Picture"
            className="w-56 h-56 rounded-full border-4 border-white object-cover"
          />
        </div>
        <div className="p-6 bg-gray-100 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {core_kwsmember?.firstName || "N/A"} {core_kwsmember?.middleName || ""} {core_kwsmember?.lastName || ""}
          </h1>
          <p className="text-black text-xl font-semibold mt-4">{core_kwsmember?.typeOfMember || "Member"}</p>
          <p className="text-black text-xl font-semibold mt-4">{username || "Member"}</p>
        </div>
        {/* QR Code Section */}
        <div className="p-6 bg-white text-center">
          <div className="mt-4 flex justify-center">
            {username ? (
              <QRCode
                value={username} // QR code will encode the username
                size={172} // Size of the QR code
                bgColor="#FFFFFF" // Background color
                fgColor="#000000" // Foreground color
              />
            ) : (
              <p className="text-gray-500">No username available for QR code.</p>
            )}
          </div>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="mt-4 bg-green-700 text-white px-4 py-2 rounded shadow-md hover:bg-green-800 print:hidden"
      >
        Print ID Card
      </button>

      {/* Styles for Printing */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #id-card {
            visibility: visible;
            margin: auto;
            width: 320px;
            height: 480px;
          }
          .print:hidden {
            display: none !important;
          }
        }

        /* ID Card for Printing */
        #id-card {
          width: 320px;
          height: 480px;
          font-family: Arial, sans-serif;
        }

        #id-card .id-card-header {
          background-color: #2d7a2d;
          color: white;
          text-align: center;
          padding: 10px;
        }

        #id-card .id-card-body {
          text-align: center;
          margin-top: 10px;
        }

        #id-card img {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 2px solid #2d7a2d;
        }

        #id-card .id-card-footer {
          position: absolute;
          bottom: 10px;
          width: 100%;
          text-align: center;
          font-size: 12px;
          color: #555;
        }

        #id-card .id-card-top {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
