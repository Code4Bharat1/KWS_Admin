"use client"
import React, { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";

const NonKws = () => {
  const [filters, setFilters] = useState({
    name: "",
    kwskwnId: "",
    isCompany: "all",
    address: "",
  });

  const [list, setList] = useState([
    {
      id: 1,
      name: "John Doe",
      address: "123 Street, Salmiya",
      zone: "Salmiya",
      contact: "1234567890",
    },
    {
      id: 2,
      name: "XYZ Company",
      address: "456 Avenue, Hawally",
      zone: "Hawally",
      contact: "9876543210",
    },
  ]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: "",
    kwskwnId: "",
    isCompany: "",
    address: "",
    contact: "",
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Filters applied:", filters);
  };

  const handleRefresh = () => {
    setFilters({ name: "", kwskwnId: "", isCompany: "all", address: "" });
    console.log("Refreshed filters.");
  };

  const handleAdd = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        id: list.length + 1,
        name: newEntry.name,
        address: newEntry.address,
        zone: "Unknown",
        contact: newEntry.contact,
      },
    ]);
    setNewEntry({ name: "", kwskwnId: "", isCompany: "", address: "", contact: "" });
    setIsFormVisible(false);
    console.log("New entry added:", newEntry);
  };

  const handleFormCancel = () => {
    setNewEntry({ name: "", kwskwnId: "", isCompany: "", address: "", contact: "" });
    setIsFormVisible(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Non-KWS Members
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">Name of Person/Company</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Enter Name"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">KWSKWN ID</label>
          <input
            type="text"
            name="kwskwnId"
            value={filters.kwskwnId}
            onChange={handleFilterChange}
            placeholder="Enter KWSKWN ID"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">Are they a Company?</label>
          <select
            name="isCompany"
            value={filters.isCompany}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold">Address</label>
          <input
            type="text"
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            placeholder="Enter Address"
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
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <AiOutlinePlus size={20} /> <span>Add</span>
        </button>
      </div>

      {/* Form Section */}
      {isFormVisible && (
        <form onSubmit={handleFormSubmit} className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-bold mb-4">Add New Entry</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Name</label>
              <input
                type="text"
                name="name"
                value={newEntry.name}
                onChange={handleFormChange}
                placeholder="Enter Name"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">KWSKWN ID</label>
              <input
                type="text"
                name="kwskwnId"
                value={newEntry.kwskwnId}
                onChange={handleFormChange}
                placeholder="Enter KWSKWN ID"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Are they a Company?</label>
              <select
                name="isCompany"
                value={newEntry.isCompany}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-bold">Address</label>
              <input
                type="text"
                name="address"
                value={newEntry.address}
                onChange={handleFormChange}
                placeholder="Enter Address"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Contact</label>
              <input
                type="text"
                name="contact"
                value={newEntry.contact}
                onChange={handleFormChange}
                placeholder="Enter Contact Number"
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleFormCancel}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* List Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Zone</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.address}</td>
                <td className="border px-4 py-2">{item.zone}</td>
                <td className="border px-4 py-2">{item.contact}</td>
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

export default NonKws;
