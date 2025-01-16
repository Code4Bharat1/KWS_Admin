"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const EditStaff = () => {
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [roles, setRoles] = useState({
    All: false,
    Registrar: false,
    Treasurer: false,
    Sandouqcha: false,
    Fahaheel: false,
    Farwaniya: false,
    Jleeb: false,
    Hawally: false,
    Salmiya: false,
    Auditor: false,
  });
  const [username, setUsername] = useState(null);

  // Using useEffect to access window only in client-side
  useEffect(() => {
    // Ensure that window is available
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const usernameFromParams = params.get("username"); // Get the username from the search params

      if (usernameFromParams) {
        setUsername(usernameFromParams);
      }
    }
  }, []);

  // Fetch staff details if username is available
  useEffect(() => {
    if (username) {
      const fetchStaff = async () => {
        try {
          const response = await axios.get("http://localhost:5786/api/staff/getlist");
          const staffData = response.data.find((staff) => staff.username === username);
          if (staffData) {
            setStaff(staffData);
            const updatedRoles = { ...roles };
            staffData.roles && Object.keys(staffData.roles).forEach(role => {
              if (staffData.roles[role]) updatedRoles[role] = true;
            });
            setRoles(updatedRoles);
          }
        } catch (err) {
          console.error("Error fetching staff details:", err);
        }
      };
      fetchStaff();
    }
  }, [username]);

  const handleRoleChange = (role) => {
    setRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedStaff = { username: staff.username, roles };
      // Send PUT request to update roles
      await axios.put(`http://localhost:5786/api/staff/edit/${staff.username}`, updatedStaff);
      router.push("/assign-staff"); 
    } catch (err) {
      console.error("Error updating staff roles:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-syne font-bold text-center mb-6">Edit Staff Roles</h1>
      {staff ? (
        <form onSubmit={handleSubmit}>
          <h3>{staff.fullName} ({staff.username})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.keys(roles).map((role) => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={roles[role]}
                  onChange={() => handleRoleChange(role)}
                />
                <span className="capitalize">{role}</span>
              </label>
            ))}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Changes
          </button>
        </form>
      ) : (
        <p>Loading staff details...</p>
      )}
    </div>
  );
};

export default EditStaff;
