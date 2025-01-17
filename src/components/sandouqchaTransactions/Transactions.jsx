import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

const Transactions = () => {
  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    recentCount: "", // added for the dropdown filter
  });
  const [list, setList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [newTransaction, setNewTransaction] = useState({
    transactionId: "",
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
    transactionSlip: null,
  });

  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [currentSlipUrl, setCurrentSlipUrl] = useState("");
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5786/api/sandouqchaTransaction/getlist");
      
      // Check if the response contains the expected data
      if (Array.isArray(response.data.transactions)) {
        setList(response.data.transactions);  // Set the transactions list
        setTotalTransactions(response.data.totalTransactions); // Set the total transactions count
      } else {
        setError("Invalid data format from server.");
      }
      setError(null); // Clear error if data is valid
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
      updatedValue = value === "" ? 0 : isNaN(value) ? 0 : Number(value);
    }
    setNewTransaction((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle file input change for transaction slip
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewTransaction((prev) => ({
      ...prev,
      transactionSlip: file,
    }));
  };


  const handleBulk =()=> {
    router.push('/sandouqcha/transactions/bulk-transaction')
  }

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
      (coins100 || 0) * 0.1 +
      (coins50 || 0) * 0.05 +
      (coins20 || 0) * 0.02 +
      (coins10 || 0) * 0.01 +
      (coins5 || 0) * 0.005;

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

  // Handle search with filters (including recentCount)
  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      if (filters.recentCount) params.recentCount = filters.recentCount;

      const response = await axios.get("http://localhost:5786/api/sandouqchaTransaction/getlist", { params });
      setList(response.data.transactions);
      setTotalTransactions(response.data.totalTransactions); 
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
    setFilters({ search: "", fromDate: "", toDate: "", recentCount: "" });
    fetchTransactions();
  };

  // Handle print action
  const handlePrint = () => {
    const printContent = document.getElementById("transaction-table").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print Transactions</title></head><body>");
    printWindow.document.write("<h1>Sandouqcha Transactions</h1>");
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Handle add button click
  const handleAdd = () => {
    setIsFormVisible(true);
  };

  // Handle form submission to add a new transaction (with file upload)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        transactionId,
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
        transactionSlip,
        status,
      } = newTransaction;

      if (!boxNumber || !transactionDate || !collectedByKwsid) {
        alert("Please fill in all required fields.");
        return;
      }

      // Create FormData to handle file upload
      const transactionData = new FormData();
      transactionData.append("boxId", boxNumber);
      transactionData.append("transactionId", transactionId);
      transactionData.append("date", transactionDate);
      transactionData.append("collectedByKwsid", collectedByKwsid);
      transactionData.append("note_20", notes20 || 0);
      transactionData.append("note_10", notes10 || 0);
      transactionData.append("note_5", notes5 || 0);
      transactionData.append("note_1", notes1 || 0);
      transactionData.append("note_0_5", notes05 || 0);
      transactionData.append("note_0_25", notes025 || 0);
      transactionData.append("coin_100", coins100 || 0);
      transactionData.append("coin_50", coins50 || 0);
      transactionData.append("coin_20", coins20 || 0);
      transactionData.append("coin_10", coins10 || 0);
      transactionData.append("coin_5", coins5 || 0);
      transactionData.append("total", total || 0);
      transactionData.append("status", status); 


      // Append the file if one was selected
      if (transactionSlip) {
        transactionData.append("transactionSlip", transactionSlip);
      }
      const committedId = localStorage.getItem("userId");
      if (committedId) {
        transactionData.append("committedId", committedId);
      } else {
        console.error("User is not authenticated, no committedId found.");
        alert("You must be logged in to submit a transaction.");
        return;
      }
  
      // Log for debugging
      // console.log("Form data being sent:");
      for (let pair of transactionData.entries()) {
        // console.log(pair[0], pair[1]);
      }
     
      await axios.post(
        "http://localhost:5786/api/sandouqchaTransaction/add",
        transactionData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      fetchTransactions();

      // Reset form
      setNewTransaction({
        transactionId: "",
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
        transactionSlip: null,
        committedId: committedId,
      });
      setIsFormVisible(false);
      alert("New transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  // Cancel form submission and reset form
  const handleFormCancel = () => {
    setNewTransaction({
      transactionId: "",
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
      transactionSlip: null,
    });
    setIsFormVisible(false);
  };

  // Handle downloading report as CSV using the view API
  const handleDownloadReport = async (transactionId) => {
    try {
      // Call the view API endpoint to get transaction details
      const response = await axios.get(`http://localhost:5786/api/sandouqchaTransaction/view/${transactionId}`);
      const data = response.data;

      const formattedDate = new Date(data.date).toLocaleDateString('en-GB');

      // Build CSV headers and rows based on the viewTransaction API response
      const headers = [
        "ID",
        "Transaction ID",
        "Date",
        "Box Number",
        "Collected By (KWSID)",
        "Holder Name",
        "Transaction Slip URL",
        "Note 20",
        "Note 10",
        "Note 5",
        "Note 1",
        "Note 0.5",
        "Note 0.25",
        "Coin 100",
        "Coin 50",
        "Coin 20",
        "Coin 10",
        "Coin 5",
        "Total (KWD)",
        "Status",
      ];

      // Create a row with the values from the API response
      const row = [
        data.id,
        data.transactionId,
        formattedDate,
        data.boxNumber,
        data.collectedByKwsid,
        data.holderName,
        data.transactionSlipUrl,
        data.notes.note_20,
        data.notes.note_10,
        data.notes.note_5,
        data.notes.note_1,
        data.notes.note_0_5,
        data.notes.note_0_25,
        data.coins.coin_100,
        data.coins.coin_50,
        data.coins.coin_20,
        data.coins.coin_10,
        data.coins.coin_5,
        data.total,
        data.status,
      ];

      // Construct CSV content
      const csvContent = [headers.join(","), row.join(",")].join("\n");

      // Create a Blob for the CSV data and trigger the download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_transaction_${data.transactionId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report.");
    }
  };

  // Toggle dropdown menu for options
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
        router.push(`/sandouqcha/transactions/logs?id=${id}`);
        break;
      case "Download Report":
        handleDownloadReport(id);
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

  const openSlipModal = (slipUrl, transactionId) => {
    setCurrentSlipUrl(slipUrl);
    setCurrentTransactionId(transactionId);
    setIsSlipModalOpen(true);
  };

  const closeSlipModal = () => {
    setCurrentSlipUrl("");
    setCurrentTransactionId(null);
    setIsSlipModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Sandouqcha Transactions
      </h1>
      <h1 className="text-3xl text-center text-black mb-12 font-semibold">Total Transactions: {totalTransactions}</h1>


      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <div>
          <label className="block mb-2 font-bold">Recent Transactions</label>
          <select
            name="recentCount"
            value={filters.recentCount}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Show All</option>
            <option value="5">Past 5</option>
            <option value="10">Past 10</option>
            <option value="20">Past 20</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center space-x-4 mb-6">
  <button
    onClick={handleSearch}
    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto mb-2 sm:mb-0"
  >
    <AiOutlineSearch size={20} /> <span>Search</span>
  </button>
  <button
    onClick={handlePrint}
    className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto mb-2 sm:mb-0"
  >
    <AiOutlinePrinter size={20} /> <span>Print</span>
  </button>
  <button
    onClick={handleRefresh}
    className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto mb-2 sm:mb-0"
  >
    <AiOutlineReload size={20} /> <span>Refresh</span>
  </button>
  <button
    onClick={handleAdd}
    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto mb-2 sm:mb-0"
  >
    <AiOutlinePlus size={20} /> <span>Add</span>
  </button>

  <button
    onClick={handleBulk}
    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto mb-2 sm:mb-0"
  >
    <FaUpload size={20} /> <span>Bulk Upload</span>
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
                type="number"
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
              <label className="block mb-2 font-bold">Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={newTransaction.transactionId}
                onChange={handleFormChange}
                placeholder="Enter Transaction ID"
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
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Collected By (KWSID)</label>
              <input
                type="text"
                name="collectedByKwsid"
                value={newTransaction.collectedByKwsid}
                onChange={handleFormChange}
                placeholder="Enter Collector's KWSID"
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>

          {/* File Upload Field for Transaction Slip */}
          <div className="mb-4">
            <label className="block mb-2 font-bold">Transaction Slip (Image or PDF)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
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
                <th className="border px-4 py-2">Zone</th>
                <th className="border px-4 py-2">Transaction ID</th>
                <th className="border px-4 py-2">Holder</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Transaction Slip</th>
                <th className="border px-4 py-2">Amount (Total)</th>
                <th className="border px-4 py-2">Options</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan="10" className="border px-4 py-2 text-center">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                list.map((item, index) => (
                  <tr key={item.id} className="text-center">
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.boxNumber}</td>
                    <td className="border px-4 py-2">{item.zone}</td>
                    <td className="border px-4 py-2">{item.transactionId}</td>
                    <td className="border px-4 py-2">{item.holderName}</td>
                    <td className="border px-4 py-2">
                      {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="border px-4 py-2">{item.status}</td>
                    <td className="border px-4 py-2">
                      {item.transactionSlip ? (
                        <a
                          className="text-blue-500"
                          href={`http://localhost:5786${item.transactionSlip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Slip
                        </a>
                      ) : (
                        "No Slip"
                      )}
                    </td>
                    <td className="border px-4 py-2">{parseFloat(item.total).toFixed(3)} KWD</td>
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
                          <button
                            onClick={() => handleOptionClick("Download Report", item.id)}
                            className="block px-4 py-2 text-purple-500 hover:bg-gray-100 w-full text-left"
                          >
                            Download Report
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

      {/* Modal for viewing transaction slip */}
      {isSlipModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeSlipModal}
          ></div>
          <div className="bg-white p-6 rounded shadow-lg z-50 max-w-3xl w-full relative">
            <h2 className="text-xl font-bold mb-4">Transaction Slip</h2>
            <div className="mb-4">
              {currentSlipUrl.endsWith(".pdf") ? (
                <embed src={currentSlipUrl} type="application/pdf" className="w-full h-96" />
              ) : (
                <img src={currentSlipUrl} alt="Transaction Slip" className="w-full h-auto" />
              )}
            </div>
            <button
              onClick={closeSlipModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &#10005;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
