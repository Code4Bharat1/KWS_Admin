"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
  AiOutlineExport,
} from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

const MemberTransaction = () => {
  const router = useRouter();

  // State for user roles
  const [staffRoles, setStaffRoles] = useState(null);

  // State for handling filters
  const [filters, setFilters] = useState({
    kwsId: "",
    category: "",
    fromDate: "",
    toDate: "",
  });

  // State for transactions list and loading
  const [list, setList] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // State for form visibility and new transaction data
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [paymentFields, setPaymentFields] = useState([
    { paymentFor: "", amountPaid: "" },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    kwsId: "",
    cardPrintedDate: "",
    cardExpiryDate: "",
    date: "",
    remarks: "",
  });

  const calculateTotal = () => {
    return paymentFields
      .reduce((total, field) => total + (parseFloat(field.amountPaid) || 0), 0)
      .toFixed(3);
  };
  const handlePaymentFieldChange = (e, index, field) => {
    const { value } = e.target;

    setPaymentFields((prevFields) =>
      prevFields.map((fieldData, i) =>
        i === index ? { ...fieldData, [field]: value } : fieldData
      )
    );
  };

  const handleAddPaymentField = () => {
    setPaymentFields([...paymentFields, { paymentFor: "", amountPaid: "" }]);
  };

  const handleRemovePaymentField = (index) => {
    const updatedFields = paymentFields.filter((_, i) => i !== index);
    setPaymentFields(updatedFields);
  };

  // State for active dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Define the zones for which certain buttons should be hidden
  const restrictedZones = [
    "fahaheel",
    "salmiya",
    "jleeb",
    "farwaniya",
    "hawally",
  ];

  // Normalize zone names for consistent comparison
  const normalizeZone = (zone) =>
    zone
      ? zone
          .toLowerCase()
          .replace(/^(al|ala)?[-\s]?/, "") // Remove 'al' or 'ala' prefixes
          .replace(/\s|-/g, "") // Remove remaining spaces and hyphens
      : "";

  // Fetch user roles from localStorage
  useEffect(() => {
    const roles = localStorage.getItem("staffRoles");
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      // console.log("Fetched Staff Roles:", parsedRoles);
      setStaffRoles(parsedRoles);
    } else {
      console.warn("No staffRoles found in localStorage.");
    }
  }, []);

  // Determine if the user has 'All' role
  const hasAllRole =
    (staffRoles?.All || staffRoles?.Registrar || staffRoles?.Treasurer) ===
    true;

  // Define the handleRedirect function
  const handleRedirect = (id, action) => {
    if (action === "view") {
      router.push(`/members/transactions/view-transaction?uid=${id}`);
    } else if (action === "edit") {
      router.push(`/members/transactions/edit-transaction?uid=${id}`);
    } else if (action === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (confirmDelete) deleteTransaction(id);
    } else if (action === "logs") {
      router.push(`/members/transactions/transaction-logs?uid=${id}`);
    } else if (action === "alllogs") {
      router.push(`/members/transactions/all_logs?uid=${id}`);
    }
  };

  // Handle deleting a transaction
  const deleteTransaction = async (uid) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/delete/${uid}`
      );
      setList((prev) => prev.filter((transaction) => transaction.UID !== uid));
      alert("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction.");
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/gettransactions`
      );
      // console.log("Fetched Transactions:", response.data); // Debugging log
      setList(response.data.transactions);
      setTotalTransactions(response.data.totalTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
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

  // Handle search functionality
  const handleSearch = async () => {
    try {
      let query = `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/gettransactions`;

      const filterParams = {
        kwsId: filters.kwsId || undefined,
        category: filters.category?.trim() || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || new Date().toISOString().split("T")[0],
      };

      const queryString = Object.keys(filterParams)
        .filter((key) => filterParams[key])
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(
              filterParams[key]
            )}`
        )
        .join("&");

      query += `?${queryString}`;

      // Make the request
      const response = await axios.get(query);

      setList(response.data.transactions);
      setTotalTransactions(response.data.totalTransactions);
    } catch (error) {
      console.error("Error applying filters:", error);
      alert("Failed to apply filters.");
    }
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    setFilters({ kwsId: "", category: "", fromDate: "", toDate: "" });
    fetchTransactions();
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const committedId = localStorage.getItem("userId");
    try {
      for (const payment of paymentFields) {
        if (!payment.paymentFor || !payment.amountPaid) {
          alert("Both 'Payment For' and 'Amount Paid' are required.");
          return;
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/addtransactions`,
          {
            kwsId: newTransaction.kwsId,
            paymentFor: payment.paymentFor,
            cardPrintedDate: newTransaction.cardPrintedDate,
            cardExpiryDate: newTransaction.cardExpiryDate,
            amountKWD: payment.amountPaid,
            date: newTransaction.date,
            remarks: newTransaction.remarks,
            committedId,
          }
        );
        setList((prev) => [...prev, response.data.transaction]);
      }
      // console.log("Added Transaction:", response.data); // Debugging log
      setPaymentFields([{ paymentFor: "", amountPaid: "" }]);

      setNewTransaction({
        kwsId: "",

        cardPrintedDate: "",
        cardExpiryDate: "",

        date: "",
        remarks: "",
      });
      setIsFormVisible(false);
      alert("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  // Handle form cancellation
  const handleFormCancel = () => {
    setNewTransaction({
      kwsId: "",
      paymentFor: "NEW",
      cardPrintedDate: "",
      cardExpiryDate: "",
      amountPaid: "",
      date: "",
      remarks: "",
    });
    setIsFormVisible(false);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      list.map((item) => ({
        UID: item.UID,
        Date: item.Date,
        Category: item.Category,
        For: item.For,
        AmountKWD: parseFloat(item.AmountKWD || 0).toFixed(3),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  // Handle print functionality
  const handlePrint = () => {
    const printContent = `
      <div>
        <h1>KWS Transaction Report</h1>
        <h3>Transactions:</h3>
        <table border="1" style="width:100%; text-align:center;">
          <thead>
            <tr>
              <th>UID</th>
              <th>Date</th>
              <th>Category</th>
              <th>For</th>
              <th>Amount (KWD)</th>
            </tr>
          </thead>
          <tbody>
            ${list
              .map(
                (item) => `
              <tr>
                <td>${item.UID}</td>
                <td>${item.Date}</td>
                <td>${item.Category}</td>
                <td>${item.For}</td>
                <td>${parseFloat(item.AmountKWD || 0).toFixed(3)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setActiveDropdown((prevIndex) => (prevIndex === index ? null : index));
  };

  // Define Dropdown Components
  const ViewDropdown = ({ item }) => (
    <div
      className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10"
      onClick={(e) => e.stopPropagation()} // Prevent closing on button click
    >
      {/* Only View button */}
      <button
        onClick={() => {
          handleRedirect(item.UID, "view");
          setActiveDropdown(null);
        }}
        className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
      >
        View
      </button>
    </div>
  );

  const FullDropdown = ({ item }) => (
    <div
      className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10"
      onClick={(e) => e.stopPropagation()} // Prevent closing on button click
    >
      <button
        onClick={() => {
          handleRedirect(item.UID, "view");
          setActiveDropdown(null);
        }}
        className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
      >
        View
      </button>
      <button
        onClick={() => {
          handleRedirect(item.UID, "edit");
          setActiveDropdown(null);
        }}
        className="block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        onClick={() => {
          handleRedirect(item.UID, "logs");
          setActiveDropdown(null);
        }}
        className="block w-full text-left px-4 py-2 text-yellow-500 hover:bg-gray-100"
      >
        View All Transactions
      </button>
      <button
        onClick={() => {
          handleRedirect(item.UID, "alllogs");
          setActiveDropdown(null);
        }}
        className="block w-full text-left px-4 py-2 text-slate-800"
      >
        All Logs
      </button>
      <button
        onClick={() => {
          handleRedirect(item.UID, "delete");
          setActiveDropdown(null);
        }}
        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Member Transactions
      </h1>
      <p className="text-2xl md:text-3xl text-center text-black font-semibold  mb-6">
        Total Transactions: {totalTransactions}
      </p>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["kwsId", "category", "fromDate", "toDate"].map((filter) => (
          <div key={filter}>
            <label className="block mb-2 font-bold">
              {filter.charAt(0).toUpperCase() +
                filter.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={filter.includes("Date") ? "date" : "text"}
              name={filter}
              value={filters[filter]}
              onChange={handleFilterChange}
              placeholder={`Enter ${filter}`}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={handleSearch}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          <AiOutlineSearch size={20} />
          <span>Search</span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
        >
          <AiOutlinePrinter size={20} />
          <span>Print</span>
        </button>
        <button
          onClick={handleExportToExcel}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          <AiOutlineExport size={20} />
          <span>Export to excel</span>
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full sm:w-auto"
        >
          <AiOutlineReload size={20} />
          <span>Refresh</span>
        </button>
        {/* Conditionally render the Add button based on user roles */}

        <button
          onClick={() => setIsFormVisible(true)}
          className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
        >
          <AiOutlinePlus size={20} />
          <span>Add</span>
        </button>
      </div>

      {/* Add Transaction Form */}
      {isFormVisible && (
        <form
          onSubmit={handleFormSubmit}
          className="mb-6 p-4 border rounded bg-gray-50"
        >
          <h2 className="text-lg font-bold mb-4">Add New Transaction</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold">KWS ID*</label>
              <input
                type="text"
                name="kwsId"
                value={newTransaction.kwsId}
                onChange={handleFormChange}
                placeholder="Enter KWS ID"
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Date*</label>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleFormChange}
                className="border p-2 rounded w-full"
                required
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

          {/* Payment For and Amount Paid Fields */}
          <div>
            <label className="block  mb-2 font-bold">Number of Payments</label>
            <select
              value={paymentFields.length}
              onChange={(e) => {
                const numFields = parseInt(e.target.value, 10);
                const updatedFields = Array.from({ length: numFields }, () => ({
                  paymentFor: "",
                  amountPaid: "",
                }));
                setPaymentFields(updatedFields);
              }}
              className="border p-2 mb-4 rounded w-full"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          {paymentFields.map((field, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              <div>
                <label className="block mb-2 font-bold">Payment For*</label>
                <select
                  name={`paymentFor-${index}`}
                  value={field.paymentFor}
                  onChange={(e) =>
                    handlePaymentFieldChange(e, index, "paymentFor")
                  }
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="">Select Payment Category</option>
                  <option value="NEW">NEW</option>
                  <option value="RENEWAL">RENEWAL</option>
                  <option value="ELITE NEW">ELITE NEW</option>
                  <option value="ELITE RENEWAL">ELITE RENEWAL</option>
                  <option value="PRIVILEGE NEW">PRIVILEGE NEW</option>
                  <option value="PRIVILEGE RENEWAL">PRIVILEGE RENEWAL</option>
                  <option value="MBS1">MBS1</option>
                  <option value="MBS2">MBS2</option>
                  <option value="MBS3">MBS3</option>
                  <option value="MBS4">MBS4</option>
                  <option value="LIFE MEMBERSHIP">LIFE MEMBERSHIP</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-bold">
                  Amount Paid (KWD)*
                </label>
                <input
                  type="number"
                  name={`amountPaid-${index}`}
                  value={field.amountPaid}
                  onChange={(e) =>
                    handlePaymentFieldChange(e, index, "amountPaid")
                  }
                  placeholder="Enter Amount"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemovePaymentField(index)}
                  className="text-red-500 hover:text-red-700 mt-4"
                >
                  Remove Payment
                </button>
              )}
            </div>
          ))}
          {/* Display Total Amount Paid */}
          <div className="flex justify-start mt-4">
            <label className="mt-2 font-bold">Total Amount Paid (KWD):</label>
            <h1 className="ml-4 text-3xl font-semibold">{calculateTotal()}</h1>
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

      {/* Loading Spinner */}
      {isLoading && <div className="text-center text-blue-500">Loading...</div>}

      {/* List Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">UID</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">For</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Added By</th>

              <th className="border px-4 py-2">Approved By</th>

              <th className="border px-4 py-2">Amount (KWD)</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              // Normalize the zone for comparison
              const memberZone = normalizeZone(item.For || "");
              const isRestrictedZone = restrictedZones.some(
                (zone) => normalizeZone(zone) === memberZone
              );

              // Determine if user has role for this zone
              const userHasRoleForZone = staffRoles?.[memberZone] === true;

              const showViewOnlyDropdown = userHasRoleForZone;
              const showFullDropdown = hasAllRole && !showViewOnlyDropdown;

              return (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{item.UID}</td>
                  <td className="border px-4 py-2">{item.Date}</td>
                  <td className="border px-4 py-2">{item.Category}</td>
                  <td className="border px-4 py-2">{item.For}</td>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2">{item.CommittedBy}</td>
                  <td className="border px-4 py-2">{item.approvedByKwsid}</td>

                  <td className="border px-4 py-2">{item.AmountKWD}</td>
                  <td className="border px-4 py-2 relative">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <AiOutlineEllipsis size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === index && (
                      <>
                        {showViewOnlyDropdown ? (
                          <ViewDropdown item={item} />
                        ) : showFullDropdown ? (
                          <FullDropdown item={item} />
                        ) : (
                          <ViewDropdown item={item} />
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTransaction;
