import React, { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";

const Transactions = () => {
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
  });

  const [list, setList] = useState([
    {
      id: 1,
      box: "Box 1",
      holder: "John Doe",
      date: "2023-12-01",
      phone: "1234567890",
      amount: 150.5,
    },
    {
      id: 2,
      box: "Box 2",
      holder: "Jane Smith",
      date: "2023-11-30",
      phone: "9876543210",
      amount: 75.25,
    },
  ]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    boxNumber: "",
    transactionDate: "",
    collectedBy: "",
    notes20: 0,
    notes10: 0,
    notes5: 0,
    notes1: 0,
    notes05: 0,
    notes025: 0,
    coins100: 0,
    coins50: 0,
    coins20: 0,
    coins10: 0,
    coins5: 0,
    total: 0,
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const {
      notes20,
      notes10,
      notes5,
      notes1,
      notes05,
      notes025,
      coins100,
      coins50,
      coins20,
      coins10,
      coins5,
    } = newTransaction;

    const total =
      notes20 * 20 +
      notes10 * 10 +
      notes5 * 5 +
      notes1 * 1 +
      notes05 * 0.5 +
      notes025 * 0.25 +
      coins100 * 1 +
      coins50 * 0.5 +
      coins20 * 0.2 +
      coins10 * 0.1 +
      coins5 * 0.05;

    setNewTransaction((prev) => ({ ...prev, total }));
  };

  const handleSearch = () => {
    console.log("Filters applied:", filters);
  };

  const handleRefresh = () => {
    setFilters({ search: "", fromDate: "", toDate: "" });
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
        id: list.length + 1,
        box: newTransaction.boxNumber,
        holder: newTransaction.collectedBy,
        date: newTransaction.transactionDate,
        phone: "N/A",
        amount: newTransaction.total,
      },
    ]);
    setNewTransaction({
      boxNumber: "",
      transactionDate: "",
      collectedBy: "",
      notes20: 0,
      notes10: 0,
      notes5: 0,
      notes1: 0,
      notes05: 0,
      notes025: 0,
      coins100: 0,
      coins50: 0,
      coins20: 0,
      coins10: 0,
      coins5: 0,
      total: 0,
    });
    setIsFormVisible(false);
    console.log("New transaction added:", newTransaction);
  };

  const handleFormCancel = () => {
    setNewTransaction({
      boxNumber: "",
      transactionDate: "",
      collectedBy: "",
      notes20: 0,
      notes10: 0,
      notes5: 0,
      notes1: 0,
      notes05: 0,
      notes025: 0,
      coins100: 0,
      coins50: 0,
      coins20: 0,
      coins10: 0,
      coins5: 0,
      total: 0,
    });
    setIsFormVisible(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
       Sandouqcha Transactions 
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by Box / Holder"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
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
          <h2 className="text-lg font-bold mb-4">Add New Transaction</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">Box Number</label>
              <input
                type="text"
                name="boxNumber"
                value={newTransaction.boxNumber}
                onChange={handleFormChange}
                placeholder="Enter Box Number"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Transaction Date</label>
              <input
                type="date"
                name="transactionDate"
                value={newTransaction.transactionDate}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Collected By</label>
              <input
                type="text"
                name="collectedBy"
                value={newTransaction.collectedBy}
                onChange={handleFormChange}
                placeholder="Enter Collector's Name"
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Note 20s", name: "notes20" },
              { label: "Note 10s", name: "notes10" },
              { label: "Note 5s", name: "notes5" },
              { label: "Note 1s", name: "notes1" },
              { label: "Note 0.5s", name: "notes05" },
              { label: "Note 0.25s", name: "notes025" },
              { label: "Coin Fils 100", name: "coins100" },
              { label: "Coin Fils 50", name: "coins50" },
              { label: "Coin Fils 20", name: "coins20" },
              { label: "Coin Fils 10", name: "coins10" },
              { label: "Coin Fils 5", name: "coins5" },
            ].map((field, index) => (
              <div key={index}>
                <label className="block mb-2 font-bold">{field.label}</label>
                <input
                  type="number"
                  name={field.name}
                  value={newTransaction[field.name]}
                  onChange={handleFormChange}
                  onBlur={calculateTotal}
                  placeholder={`Enter ${field.label}`}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold">Total Money (KWD)</label>
            <input
              type="text"
              value={newTransaction.total.toFixed(3)}
              readOnly
              className="border p-2 rounded w-full bg-gray-100"
            />
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
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Box</th>
              <th className="border px-4 py-2">Holder</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Amount (Total)</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.box}</td>
                <td className="border px-4 py-2">{item.holder}</td>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.phone}</td>
                <td className="border px-4 py-2">{item.amount.toFixed(3)} KWD</td>
                <td className="border px-4 py-2 relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AiOutlineEllipsis size={20} />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute bg-white border shadow-md right-0 mt-2 z-10">
                      <button className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left">View</button>
                      <button className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left">Edit</button>
                      <button className="block px-4 py-2 text-yellow-500 hover:bg-gray-100 w-full text-left">Logs</button>
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

export default Transactions;
