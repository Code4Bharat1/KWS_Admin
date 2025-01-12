"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import axios from 'axios';  // Import axios
import {
  AiOutlineSearch,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";
import { FaBuilding } from "react-icons/fa";

const NonKws = () => {
  const [filters, setFilters] = useState({
    name: "",
    isCompany: "all",
  });

  const [list, setList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter(); // Initialize useRouter hook

  // Fetch the non-KWS list from the backend when search is clicked
  const fetchNonKwsList = async () => {
    try {
      const params = { ...filters };
      const response = await axios.get('http://localhost:5786/api/nonkws/getlist', { params });
      console.log("Fetched Data:", response.data);
      setList(response.data);
    } catch (error) {
      console.error("Error fetching non-KWS list:", error);
      setList([]);
    }
  };

  useEffect(() => {
    fetchNonKwsList();
  }, []); // Initial fetch when component mounts

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value })); // Update filters state
  };

  const handleSearch = () => {
    fetchNonKwsList(); // Fetch the filtered list when the search button is clicked
  };

  const handleRefresh = () => {
    setFilters({ name: "", isCompany: "all" });
    fetchNonKwsList(); // Refresh the list from the backend
  };

  // Navigate to the AddNonKws page when Add button is clicked
  const handleAdd = () => {
    router.push("/members/non-kws/add-non-kws"); // Redirect to Add page
  };

  // Handle the dropdown click event to show the options
  const handleDropdownClick = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index); 
  };

  const handleOptionClick = (option, id) => {
    if (option === "view") {
      router.push(`/members/non-kws/view-non-kws?id=${id}`);
    } else if (option === "edit") {
      router.push(`/members/non-kws/edit-non-kws?id=${id}`);
    } else if (option === "log") {
      router.push(`/members/non-kws/log-non-kws?id=${id}`);
    } else if (option === "delete") {
      handleDelete(id); 
    }
    setActiveDropdown(null); // Close the dropdown after selecting an option
  };

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5786/api/nonkws/deletenonkws/${id}`);
      setList((prevList) => prevList.filter(item => item.ID !== id)); // Remove the deleted item from the list
      console.log(`Item with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting the item:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Non-KWS Members
      </h1>

      <p className="text-sm text-gray-600 mb-4">Note*: Accounts with a company icon in front of their names are Companies</p>

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
          onClick={handleAdd} // Route to Add page
          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <AiOutlinePlus size={20} /> <span>Add</span>
        </button>
      </div>

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
            {list && list.length > 0 ? (
              list.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{item.ID}</td>
                  <td className="border px-4 py-2 flex items-center justify-center">
                    {item.IsCompany && <FaBuilding size={20} className="mr-2" />}
                    {item.Name}
                  </td>
                  <td className="border px-4 py-2">{item.Address}</td>
                  <td className="border px-4 py-2">{item.Zone}</td>
                  <td className="border px-4 py-2">{item.Contact}</td>
                  <td className="border px-4 py-2 relative">
                    <button
                      onClick={() => handleDropdownClick(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <AiOutlineEllipsis size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === index && (
                      <div className="absolute right-0 z-20 mt-2 w-40 bg-white border shadow-md rounded-md">
                        <ul>
                          <li
                            onClick={() => handleOptionClick("view", item.ID)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            View
                          </li>
                          <li
                            onClick={() => handleOptionClick("edit", item.ID)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            Edit
                          </li>
                          <li
                            onClick={() => handleOptionClick("log", item.ID)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            Log
                          </li>
                          <li
                            onClick={() => handleOptionClick("delete", item.ID)}
                            className="px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
                          >
                            Delete
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonKws;
