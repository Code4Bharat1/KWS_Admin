"use client"; // For Next.js Client Components
import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);      

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage

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
              // Include authentication headers if required
              // "Authorization": `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data.user); // Set only the user object
        setLoading(false);
      } catch (err) {
        if (err.response) {
          // Server responded with a status code outside 2xx range
          if (err.response.status === 404) {
            setError("User not found.");
          } else if (err.response.status === 400) {
            setError("Invalid user ID.");
          } else {
            setError("Failed to fetch profile data.");
          }
        } else if (err.request) {
          // Request was made but no response received
          setError("Server is not responding. Please try again later.");
        } else {
          // Something else caused an error
          setError(err.message);
        }
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

  const { username, core_kwsmember } = userData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        <div className="mb-2">
          <span className="font-semibold"></span> {username}
        </div>

        {core_kwsmember ? (
          <div className="mt-4">
            
            <p>
              <span className="font-semibold"></span> {core_kwsmember.typeOfMember || "N/A"}
            </p>
            <p>
              <span className="font-semibold"></span> {core_kwsmember.firstName || "N/A"}
            </p>
            <p>
              <span className="font-semibold"></span> {core_kwsmember.middleName || "N/A"}
            </p>
            <p>
              <span className="font-semibold"></span> {core_kwsmember.lastName || "N/A"}
            </p>
          </div>
        ) : (
          <div className="mt-4 text-gray-600">No membership details available.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
