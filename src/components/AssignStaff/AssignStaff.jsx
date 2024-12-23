"use client"
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineReload, AiOutlineEdit } from "react-icons/ai";

const AssignStaff = () => {
  const [filters, setFilters] = useState({
    search: "",
    roles: {
      all: false,
      registrar: false,
      treasurer: false,
      sandouqcha: false,
      fahaheel: false,
      farwaniya: false,
      jleeb: false,
      hawally: false,
      salmiya: false,
    },
  });

  const [list, setList] = useState([
    {
      username: "john_doe",
      name: "John Doe",
      currentRoles: ["Registrar", "Hawally"],
    },
    {
      username: "jane_smith",
      name: "Jane Smith",
      currentRoles: ["Treasurer", "Salmiya"],
    },
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFilters((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: !prev.roles[role] },
    }));
  };

  const handleSearch = () => {
    console.log("Filters applied:", filters);
    // Add logic to filter list based on filters
  };

  const handleRefresh = () => {
    setFilters({
      search: "",
      roles: {
        all: false,
        registrar: false,
        treasurer: false,
        sandouqcha: false,
        fahaheel: false,
        farwaniya: false,
        jleeb: false,
        hawally: false,
        salmiya: false,
      },
    });
    console.log("Filters reset.");
  };

  const handleEdit = (username) => {
    console.log(`Editing roles for username: ${username}`);
    // Logic for editing roles
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        KWS Portal Staff
      </h1>

      {/* Filters Section */}
      <div className="mb-6">
        <div className="mb-4">
          <label className="block mb-2 font-bold">KWS ID/Name</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Enter KWS ID or Name"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(filters.roles).map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.roles[role]}
                onChange={() => handleRoleChange(role)}
              />
              <span className="capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <AiOutlineSearch size={20} /> <span>Search</span>
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          <AiOutlineReload size={20} /> <span>Refresh</span>
        </button>
      </div>

      {/* List Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Current Roles</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.username}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.currentRoles.join(", ")}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(item.username)}
                    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    <AiOutlineEdit size={20} /> <span>Edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignStaff;
