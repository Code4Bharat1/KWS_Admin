import React, { useState } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";

const MemberTransaction = () => {
  const [filters, setFilters] = useState({
    kwsId: "",
    category: "",
    fromDate: "",
    toDate: "",
  });

  const [list, setList] = useState([
    {
      uid: 1,
      date: "2023-12-01",
      category: "Renewal",
      for: "MBS1",
      amount: 50,
    },
    {
      uid: 2,
      date: "2023-11-30",
      category: "Elite Renewal",
      for: "MBS2",
      amount: 75,
    },
  ]);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    kwsId: "",
    paymentFor: "",
    cardPrintedDate: "",
    cardExpiryDate: "",
    amountPaid: "",
    date: "",
    remarks: "",
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

  const handleSearch = () => {
    console.log("Filters applied:", filters);
  };

  const handleRefresh = () => {
    setFilters({ kwsId: "", category: "", fromDate: "", toDate: "" });
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
        uid: list.length + 1,
        date: newTransaction.date,
        category: newTransaction.paymentFor,
        for: newTransaction.paymentFor,
        amount: parseFloat(newTransaction.amountPaid),
      },
    ]);
    setNewTransaction({
      kwsId: "",
      paymentFor: "",
      cardPrintedDate: "",
      cardExpiryDate: "",
      amountPaid: "",
      date: "",
      remarks: "",
    });
    setIsFormVisible(false);
    console.log("New transaction added:", newTransaction);
  };

  const handleFormCancel = () => {
    setNewTransaction({
      kwsId: "",
      paymentFor: "",
      cardPrintedDate: "",
      cardExpiryDate: "",
      amountPaid: "",
      date: "",
      remarks: "",
    });
    setIsFormVisible(false);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Member Transactions 
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
          <label className="block mb-2 font-bold">Category</label>
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            placeholder="Enter Category"
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
              <label className="block mb-2 font-bold">KWS ID</label>
              <input
                type="text"
                name="kwsId"
                value={newTransaction.kwsId}
                onChange={handleFormChange}
                placeholder="Enter KWS ID"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Payment For</label>
              <input
                type="text"
                name="paymentFor"
                value={newTransaction.paymentFor}
                onChange={handleFormChange}
                placeholder="e.g., NEW, RENEWAL, ELITE RENEWAL, MBS1, etc."
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Card Printed Date</label>
              <input
                type="date"
                name="cardPrintedDate"
                value={newTransaction.cardPrintedDate}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Card Expiry Date</label>
              <input
                type="date"
                name="cardExpiryDate"
                value={newTransaction.cardExpiryDate}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Amount Paid (KWD)</label>
              <input
                type="number"
                name="amountPaid"
                value={newTransaction.amountPaid}
                onChange={handleFormChange}
                placeholder="Enter Amount"
                className="border p-2 rounded w-full"
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Date</label>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2 font-bold">Remarks</label>
              <textarea
                name="remarks"
                value={newTransaction.remarks}
                onChange={handleFormChange}
                placeholder="Enter Remarks"
                className="border p-2 rounded w-full"
              ></textarea>
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
              <th className="border px-4 py-2">UID</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">For</th>
              <th className="border px-4 py-2">Amount (KWD)</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.uid}</td>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.for}</td>
                <td className="border px-4 py-2">{item.amount.toFixed(3)}</td>
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

export default MemberTransaction;
