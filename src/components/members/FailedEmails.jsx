"use client"
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineReload, AiOutlineEllipsis } from "react-icons/ai";

const FailedEmails = () => {
  const [filters, setFilters] = useState({
    resolved: "all",
    resolvedBy: "",
  });

  const [list, setList] = useState([
    {
      id: 1,
      date: "2023-12-01",
      emailTo: "example1@example.com",
      resolvedBy: "Admin",
    },
    {
      id: 2,
      date: "2023-12-02",
      emailTo: "example2@example.com",
      resolvedBy: "User",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Filters applied:", filters);
  };

  const handleRefresh = () => {
    setFilters({ resolved: "all", resolvedBy: "" });
    console.log("Filters reset.");
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Failed Emails
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">Resolved</label>
          <select
            name="resolved"
            value={filters.resolved}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold">Resolved By</label>
          <input
            type="text"
            name="resolvedBy"
            value={filters.resolvedBy}
            onChange={handleFilterChange}
            placeholder="Enter Name"
            className="border p-2 rounded w-full"
          />
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
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Email To</th>
              <th className="border px-4 py-2">Resolved By</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.emailTo}</td>
                <td className="border px-4 py-2">{item.resolvedBy}</td>
                <td className="border px-4 py-2 relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineEllipsis size={20} />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute bg-white border shadow-md right-0 mt-2 z-10">
                      <button className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left">
                        View
                      </button>
                      <button className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left">
                        Edit
                      </button>
                      <button className="block px-4 py-2 text-yellow-500 hover:bg-gray-100 w-full text-left">
                        Logs
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FailedEmails;
