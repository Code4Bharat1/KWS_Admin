"use client";
import React, { useState } from "react";
import { AiOutlineSearch, AiOutlinePrinter, AiOutlineReload, AiOutlinePlus, AiOutlineEllipsis } from "react-icons/ai";

const Boxes = () => {
  const [filters, setFilters] = useState({
    kwsId: "",
    zone: "all",
    boxNumber: "",
    inUse: "all",
  });

  const [list, setList] = useState([
    {
      number: 1,
      holderName: "John Doe",
      inUse: "Yes",
      dateIssued: "2023-12-01",
      lastCollectedDate: "2023-12-10",
      holderContact: "1234567890",
    },
    {
      number: 2,
      holderName: "Jane Smith",
      inUse: "No",
      dateIssued: "2023-11-15",
      lastCollectedDate: "2023-11-20",
      holderContact: "9876543210",
    },
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newBox, setNewBox] = useState({
    boxFor: "",
    boxNumber: "",
    inUse: "",
    dateIssued: "",
    remarks: "",
    referredBy: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewBox((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filteredList = list.filter((item) => {
      const matchesKwsId = filters.kwsId === "" || item.holderName.includes(filters.kwsId);
      const matchesZone = filters.zone === "all" || item.holderName.toLowerCase().includes(filters.zone);
      const matchesBoxNumber = filters.boxNumber === "" || item.number.toString() === filters.boxNumber;
      const matchesInUse = filters.inUse === "all" || item.inUse.toLowerCase() === filters.inUse;

      return matchesKwsId && matchesZone && matchesBoxNumber && matchesInUse;
    });
    setList(filteredList);
    console.log("Filters applied:", filters);
  };

  const handleRefresh = () => {
    setFilters({ kwsId: "", zone: "all", boxNumber: "", inUse: "all" });
    setList([
      {
        number: 1,
        holderName: "John Doe",
        inUse: "Yes",
        dateIssued: "2023-12-01",
        lastCollectedDate: "2023-12-10",
        holderContact: "1234567890",
      },
      {
        number: 2,
        holderName: "Jane Smith",
        inUse: "No",
        dateIssued: "2023-11-15",
        lastCollectedDate: "2023-11-20",
        holderContact: "9876543210",
      },
    ]);
    console.log("Refreshed list.");
  };

  const handlePrint = () => {
    console.log("Print the list.");
  };

  const handleAdd = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        number: list.length + 1,
        holderName: newBox.boxFor,
        inUse: newBox.inUse,
        dateIssued: newBox.dateIssued,
        lastCollectedDate: "",
        holderContact: newBox.referredBy,
      },
    ]);
    setNewBox({ boxFor: "", boxNumber: "", inUse: "", dateIssued: "", remarks: "", referredBy: "" });
    setIsFormVisible(false);
    console.log("New box added:", newBox);
  };

  const handleFormCancel = () => {
    setNewBox({ boxFor: "", boxNumber: "", inUse: "", dateIssued: "", remarks: "", referredBy: "" });
    setIsFormVisible(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">Boxes Management</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">Search by KWS ID / KWSKWN ID</label>
          <input
            type="text"
            name="kwsId"
            value={filters.kwsId}
            onChange={handleFilterChange}
            placeholder="Enter KWS ID / KWSKWN ID"
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
            <option value="all">All Zones</option>
            <option value="salmiya">Salmiya</option>
            <option value="fahaheel">Fahaheel</option>
            <option value="jleeb">Jleeb</option>
            <option value="hawally">Hawally</option>
            <option value="farwaniya">Farwaniya</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold">Search by Box Number</label>
          <input
            type="text"
            name="boxNumber"
            value={filters.boxNumber}
            onChange={handleFilterChange}
            placeholder="Enter Box Number"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">In Use</label>
          <select
            name="inUse"
            value={filters.inUse}
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
          <h2 className="text-lg font-bold mb-4">Add New Box</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Box For</label>
              <input
                type="text"
                name="boxFor"
                value={newBox.boxFor}
                onChange={handleFormChange}
                placeholder="Enter Box For"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Box Number</label>
              <input
                type="text"
                name="boxNumber"
                value={newBox.boxNumber}
                onChange={handleFormChange}
                placeholder="Enter Box Number"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">In Use</label>
              <select
                name="inUse"
                value={newBox.inUse}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-bold">Date Issued</label>
              <input
                type="date"
                name="dateIssued"
                value={newBox.dateIssued}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={newBox.remarks}
                onChange={handleFormChange}
                placeholder="Enter Remarks"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Referred By</label>
              <input
                type="text"
                name="referredBy"
                value={newBox.referredBy}
                onChange={handleFormChange}
                placeholder="Enter Referred By"
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
              <th className="border px-4 py-2">Number</th>
              <th className="border px-4 py-2">Holder Name</th>
              <th className="border px-4 py-2">In Use</th>
              <th className="border px-4 py-2">Date Issued</th>
              <th className="border px-4 py-2">Last Collected Date</th>
              <th className="border px-4 py-2">Holder Contact</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.number}</td>
                <td className="border px-4 py-2">{item.holderName}</td>
                <td className="border px-4 py-2">{item.inUse}</td>
                <td className="border px-4 py-2">{item.dateIssued}</td>
                <td className="border px-4 py-2">{item.lastCollectedDate}</td>
                <td className="border px-4 py-2">{item.holderContact}</td>
                <td className="border px-4 py-2 relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineEllipsis size={20} />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute bg-white border shadow-md right-0 mt-2 z-10">
                      <button className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left">View Box</button>
                      <button className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left">Edit Box</button>
                      <button className="block px-4 py-2 text-yellow-500 hover:bg-gray-100 w-full text-left">Logs</button>
                      <button className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left">Go to KWS Member</button>
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

export default Boxes;
