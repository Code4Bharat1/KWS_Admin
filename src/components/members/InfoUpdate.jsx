"use client"
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineReload, AiOutlineEllipsis } from "react-icons/ai";

const InfoUpdate = () => {
  const [filters, setFilters] = useState({
    kwsId: "",
    lookUp: "",
    zone: "all",
    membershipType: "all",
  });

  const [list, setList] = useState([
    {
      kwsId: "KWS123",
      dateRequested: "2023-12-01",
      name: "John Doe",
      zone: "Salmiya",
      typeOfMember: "Premium",
    },
    {
      kwsId: "KWS456",
      dateRequested: "2023-11-30",
      name: "Jane Smith",
      zone: "Hawally",
      typeOfMember: "Standard",
    },
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    // console.log("Filters applied:", filters);
    // Logic for filtering the list based on filters
  };

  const handleRefresh = () => {
    setFilters({ kwsId: "", lookUp: "", zone: "all", membershipType: "all" });
    // console.log("Refreshed filters.");
  };

  const handleApprove = (kwsId) => {
    // console.log(`Approved request for KWS ID: ${kwsId}`);
  };

  const handleReject = (kwsId) => {
    // console.log(`Rejected request for KWS ID: ${kwsId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Information Update Requests
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <th className="border px-4 py-2">KWS ID</th>
              <th className="border px-4 py-2">Date Requested</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Zone</th>
              <th className="border px-4 py-2">Type of Member</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.kwsId}</td>
                <td className="border px-4 py-2">{item.dateRequested}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.zone}</td>
                <td className="border px-4 py-2">{item.typeOfMember}</td>
                <td className="border px-4 py-2 relative">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleApprove(item.kwsId)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(item.kwsId)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoUpdate;
