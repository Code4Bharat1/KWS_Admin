import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation"; // For Next.js 13 App Router
// For Next.js 12 or below Pages Router, use:
// import { useRouter } from "next/router";

const Transactions = () => {
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
  });

  const [list, setList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    boxNumber: "",
    transactionDate: "",
    collectedByKwsid: "", // Changed from collectedBy to collectedByKwsid
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
  const [error, setError] = useState(null); // For handling errors
  const [loading, setLoading] = useState(false); // For loading state

  const router = useRouter();

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5786/api/sandouqchaTransaction/getlist"
      );
      setList(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Debugging: log the input change
    console.log(`Changing ${name} to ${value}`);

    // For numeric fields, convert to number; otherwise, keep as string
    const numericFields = [
      "boxNumber",
      "notes20",
      "notes10",
      "notes5",
      "notes1",
      "notes05",
      "notes025",
      "coins100",
      "coins50",
      "coins20",
      "coins10",
      "coins5",
    ];

    let updatedValue = value;
    if (numericFields.includes(name)) {
      // Handle empty input as 0
      if (value === "") {
        updatedValue = 0;
      } else {
        updatedValue = isNaN(value) ? 0 : Number(value);
      }
    }

    setNewTransaction((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Calculate total amount whenever relevant fields change
  useEffect(() => {
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
      (notes20 || 0) * 20 +
      (notes10 || 0) * 10 +
      (notes5 || 0) * 5 +
      (notes1 || 0) * 1 +
      (notes05 || 0) * 0.5 +
      (notes025 || 0) * 0.25 +
      (coins100 || 0) * 0.1 + // 100 Fils = 0.1 KWD
      (coins50 || 0) * 0.05 + // 50 Fils = 0.05 KWD
      (coins20 || 0) * 0.02 + // 20 Fils = 0.02 KWD
      (coins10 || 0) * 0.01 + // 10 Fils = 0.01 KWD
      (coins5 || 0) * 0.005;  // 5 Fils = 0.005 KWD

    setNewTransaction((prev) => ({
      ...prev,
      total: parseFloat(total.toFixed(3)),
    }));
  }, [
    newTransaction.notes20,
    newTransaction.notes10,
    newTransaction.notes5,
    newTransaction.notes1,
    newTransaction.notes05,
    newTransaction.notes025,
    newTransaction.coins100,
    newTransaction.coins50,
    newTransaction.coins20,
    newTransaction.coins10,
    newTransaction.coins5,
  ]);

  // Handle search with filters
  const handleSearch = async () => {
    try {
      setLoading(true);
      // Assuming your backend supports query parameters for filtering
      const params = {};

      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.fromDate) {
        params.fromDate = filters.fromDate;
      }
      if (filters.toDate) {
        params.toDate = filters.toDate;
      }

      const response = await axios.get(
        "http://localhost:5786/api/sandouqchaTransaction/getlist",
        { params }
      );
      setList(response.data);
      setError(null);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  // Reset filters and fetch all transactions
  const handleRefresh = () => {
    setFilters({ search: "", fromDate: "", toDate: "" });
    fetchTransactions();
  };

  // Handle print
  const handlePrint = () => {
    // Create a printable window
    const printContent = document.getElementById("transaction-table").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Transactions</title>");
    printWindow.document.write("</head><body>");
    printWindow.document.write("<h1>Sandouqcha Transactions</h1>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Handle add button
  const handleAdd = () => {
    setIsFormVisible(true);
  };

  // Handle form submission to add a new transaction
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        boxNumber,
        transactionDate,
        collectedByKwsid,
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
        total,
      } = newTransaction;

      // Validate required fields
      if (!boxNumber || !transactionDate || !collectedByKwsid) {
        alert("Please fill in all required fields.");
        return;
      }

      const transactionData = {
        boxId: parseInt(boxNumber), // Ensure boxNumber corresponds to box_id
        date: transactionDate,
        collectedByKwsid: collectedByKwsid, // Pass kwsid instead of user id
        note_20: parseInt(notes20) || 0,
        note_10: parseInt(notes10) || 0,
        note_5: parseInt(notes5) || 0,
        note_1: parseInt(notes1) || 0,
        note_0_5: parseFloat(notes05) || 0,
        note_0_25: parseFloat(notes025) || 0,
        coin_100: parseInt(coins100) || 0,
        coin_50: parseInt(coins50) || 0,
        coin_20: parseInt(coins20) || 0,
        coin_10: parseInt(coins10) || 0,
        coin_5: parseInt(coins5) || 0,
        total: parseFloat(total.toFixed(3)) || 0,
        // Include other necessary fields as per your backend schema
      };

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5786/api/sandouqchaTransaction/add",
        transactionData
      );

      // Optionally, fetch the updated list
      fetchTransactions();

      // Reset form
      setNewTransaction({
        boxNumber: "",
        transactionDate: "",
        collectedByKwsid: "",
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
      alert("New transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setNewTransaction({
      boxNumber: "",
      transactionDate: "",
      collectedByKwsid: "",
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

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  // Handle dropdown option clicks
  const handleOptionClick = (option, id) => {
    setActiveDropdown(null);
    switch (option) {
      case "View":
        router.push(`/sandouqcha/transactions/view-transaction?id=${id}`);
        break;
      case "Edit":
        router.push(`/sandouqcha/transactions/edit-transaction?id=${id}`);
        break;
      case "Delete":
        handleDelete(id);
        break;
      case "Logs":
        router.push(`/sandouqcha/transactions/logs/${id}`);
        break;
      default:
        break;
    }
  };

  // Handle deleting a transaction
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await axios.delete(`http://localhost:5786/api/sandouqchaTransaction/delete/${id}`);
      setList((prev) => prev.filter((item) => item.id !== id));
      alert("Transaction deleted successfully.");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction.");
    }
  };

  // Helper function to calculate total from item (optional)
  const calculateTotalFromItem = (item) => {
    const {
      note_20 = 0,
      note_10 = 0,
      note_5 = 0,
      note_1 = 0,
      note_0_5 = 0,
      note_0_25 = 0,
      coin_100 = 0,
      coin_50 = 0,
      coin_20 = 0,
      coin_10 = 0,
      coin_5 = 0,
    } = item.core_sandouqchatransaction || {};

    return (
      note_20 * 20 +
      note_10 * 10 +
      note_5 * 5 +
      note_1 * 1 +
      note_0_5 * 0.5 +
      note_0_25 * 0.25 +
      coin_100 * 0.1 +
      coin_50 * 0.05 +
      coin_20 * 0.02 +
      coin_10 * 0.01 +
      coin_5 * 0.005
    );
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
            placeholder="Search by Box Number or Holder Name"
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
                type="number" // Ensure boxNumber corresponds to box_id
                name="boxNumber"
                value={newTransaction.boxNumber}
                onChange={handleFormChange}
                placeholder="Enter Box Number"
                className="border p-2 rounded w-full"
                required
                min="0"
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
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-bold">Collected By (KWSID)</label>
              <input
                type="text" // Assuming kwsid is alphanumeric; use "number" if it's strictly numeric
                name="collectedByKwsid"
                value={newTransaction.collectedByKwsid}
                onChange={handleFormChange}
                placeholder="Enter Collector's KWSID"
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {/* Notes and Coins */}
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
                  placeholder={`Enter ${field.label}`}
                  className="border p-2 rounded w-full"
                  min="0"
                />
              </div>
            ))}

            <div className="md:col-span-3">
              <label className="block mb-2 font-bold">Total (KWD)</label>
              <input
                type="text"
                value={newTransaction.total.toFixed(3)}
                readOnly
                className="border p-2 rounded w-full bg-gray-100"
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
      <div className="overflow-x-auto" id="transaction-table">
        {loading ? (
          <p className="text-center">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Box Number</th>
                <th className="border px-4 py-2">Holder</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Amount (Total)</th>
                <th className="border px-4 py-2">Options</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border px-4 py-2 text-center">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                list.map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.boxNumber}</td>
                    <td className="border px-4 py-2">{item.holderName}</td>
                    <td className="border px-4 py-2">
                      {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border px-4 py-2">{item.holderContact}</td>
                    <td className="border px-4 py-2">{item.total.toFixed(3)} KWD</td>
                    <td className="border px-4 py-2 relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <AiOutlineEllipsis size={20} />
                      </button>
                      {activeDropdown === index && (
                        <div className="absolute bg-white border shadow-md right-0 mt-2 z-10">
                          <button
                            onClick={() => handleOptionClick("View", item.id)}
                            className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOptionClick("Edit", item.id)}
                            className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleOptionClick("Logs", item.id)}
                            className="block px-4 py-2 text-yellow-500 hover:bg-gray-100 w-full text-left"
                          >
                            Logs
                          </button>
                          <button
                            onClick={() => handleOptionClick("Delete", item.id)}
                            className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
