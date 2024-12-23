import React, { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlineEllipsis,
} from "react-icons/ai";

const Search = () => {
  const [filters, setFilters] = useState({
    kwsId: "",
    lookUp: "",
    zone: "all",
    membershipType: "all",
    membershipStatus: "all",
  });

  const [list, setList] = useState([
    {
      kwsId: "KWS123",
      civilId: "123456789",
      name: "John Doe",
      zone: "Salmiya",
      contact: "1234567890",
      type: "Premium",
    },
    {
      kwsId: "KWS456",
      civilId: "987654321",
      name: "Jane Smith",
      zone: "Hawally",
      contact: "9876543210",
      type: "Standard",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    console.log("Filters applied:", filters);
    // Logic for filtering the list based on filters
  };

  const handleRefresh = () => {
    setFilters({ kwsId: "", lookUp: "", zone: "all", membershipType: "all", membershipStatus: "all" });
    console.log("Refreshed filters.");
  };

  const handlePrint = () => {
    console.log("Print the list.");
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Search Members
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">KWS ID</label>
          <input
            type="text"
            name="kwsId"
            value={filters.kwsId}
            onChange={handleFilterChange}
            placeholder="Enter KWS ID"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">Look Up</label>
          <input
            type="text"
            name="lookUp"
            value={filters.lookUp}
            onChange={handleFilterChange}
            placeholder="Enter Name or Contact"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">Zone</label>
          <select
            name="zone"
            value={filters.zone}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="fahaheel">Fahaheel</option>
            <option value="salmiya">Salmiya</option>
            <option value="jleeb">Jleeb</option>
            <option value="farwaniya">Farwaniya</option>
            <option value="hawally">Hawally</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold">Membership Type</label>
          <select
            name="membershipType"
            value={filters.membershipType}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="basic">Basic</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold">Membership Status</label>
          <select
            name="membershipStatus"
            value={filters.membershipStatus}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="inactive">Inactive</option>
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
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <AiOutlinePrinter size={20} /> <span>Print</span>
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
              <th className="border px-4 py-2">KWS ID</th>
              <th className="border px-4 py-2">Civil ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Zone</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Type of Member</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.kwsId}</td>
                <td className="border px-4 py-2">{item.civilId}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.zone}</td>
                <td className="border px-4 py-2">{item.contact}</td>
                <td className="border px-4 py-2">{item.type}</td>
                <td className="border px-4 py-2 relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineEllipsis size={20} />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute bg-white border shadow-md right-0 mt-2 z-10">
                      <button className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left">Edit</button>
                      <button className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left">View</button>
                      <button className="block px-4 py-2 text-yellow-500 hover:bg-gray-100 w-full text-left">Add Transaction</button>
                      <button className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left">View All Transactions</button>
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

export default Search;
