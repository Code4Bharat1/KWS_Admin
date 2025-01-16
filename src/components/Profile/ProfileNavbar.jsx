"use client";
import React, { useEffect, useState } from "react";
import { FaIdCard, FaUserAlt, FaEdit, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ProfileNavbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to track login status
  const [staffRoles, setStaffRoles] = useState(null); // State to track staff roles

  // Check authentication and staffRoles on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const roles = localStorage.getItem("staffRoles");

    if (!userId || !roles) {
      setIsLoggedIn(false);
      router.push("/"); // Redirect to login if not logged in or no roles found
    } else {
      setStaffRoles(JSON.parse(roles)); // Parse roles from localStorage
    }
  }, [router]);

  const handleId = () => {
    if (!isLoggedIn) return;
    router.push("/profile");
  };

  const handleDetail = () => {
    if (!isLoggedIn) return;
    router.push("/profile/all-details");
  };

  const handleUpdate = () => {
    if (!isLoggedIn) return;
    router.push("/profile/update");
  };

  const handleStaff = () => {
    if (!isLoggedIn) return;
    router.push("/welcome");
  };

  const handleLogout = () => {
    // Clear localStorage or other storage
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("staffRoles");

    window.history.replaceState(null, "", "/");
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", "/");
    });

    // Set login state to false
    setIsLoggedIn(false);

    // Redirect to login page
    router.push("/");
  };

  if (!staffRoles) return null; // Wait until roles are loaded

  // Check if any role is true
  const hasAnyRole = Object.values(staffRoles).some((role) => role === true);

  return (
    <div className="bg-green-700 text-white py-4">
      <div className="container mx-auto flex justify-around">
        {/* ID Card */}
        <div
          className={`flex flex-col items-center ${!isLoggedIn ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-400 cursor-pointer"}`}
          onClick={handleId}
        >
          <FaIdCard size={24} />
          <span className="mt-2 text-sm">ID Card</span>
        </div>

        {/* All Details */}
        <div
          className={`flex flex-col items-center ${!isLoggedIn ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-400 cursor-pointer"}`}
          onClick={handleDetail}
        >
          <FaUserAlt size={24} />
          <span className="mt-2 text-sm">All Details</span>
        </div>

        {/* Update */}
        <div
          className={`flex flex-col items-center ${!isLoggedIn ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-400 cursor-pointer"}`}
          onClick={handleUpdate}
        >
          <FaEdit size={24} />
          <span className="mt-2 text-sm">Update</span>
        </div>

        {/* Staff (Only show if any role is true in staffRoles) */}
        {hasAnyRole && (
          <div
            className={`flex flex-col items-center ${!isLoggedIn ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-400 cursor-pointer"}`}
            onClick={handleStaff}
          >
            <FaUsers size={24} />
            <span className="mt-2 text-sm">Staff</span>
          </div>
        )}

        {/* Log Out */}
        <div
          className={`flex flex-col items-center ${!isLoggedIn ? "text-gray-400 cursor-not-allowed" : "hover:text-red-400 cursor-pointer"}`}
          onClick={handleLogout}
        >
          <FaSignOutAlt size={24} />
          <span className="mt-2 text-sm">Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
