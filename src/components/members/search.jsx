"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlineEllipsis,
  AiOutlineDown,
} from "react-icons/ai";
import axios from "axios";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Navigation functions for editing and viewing a member
  const handleEdit = (userId) => {
    router.push(`/members/edit-member?id=${userId}`);
  };

  const handleView = (userId) => {
    router.push(`/members/view-member?id=${userId}`);
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // State for user roles
  const [staffRoles, setStaffRoles] = useState(null);

  // State for handling filters
  const [filters, setFilters] = useState({
    kwsId: "",
    lookUp: "",
    zone: "all",
    membershipType: [],
    membershipStatus: "all",
  });

  // State for member list and filtered results
  const [list, setList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Items per page

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for active dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ---------------- Transaction Form States ----------------
  // When a user clicks "Add Transaction", we store that member's data here.
  const [selectedUserForTransaction, setSelectedUserForTransaction] =
    useState(null);

  // Data for the transaction form
  const [transactionFormData, setTransactionFormData] = useState({
    kwsId: "",
    cardPrintedDate: "",
    cardExpiryDate: "",
    date: "",
    remarks: "",
  });

  // Dynamic Payment fields state
  const [transactionPaymentFields, setTransactionPaymentFields] = useState([
    { paymentFor: "", amountPaid: "" },
  ]);

  // ---------------- Utility Functions for Transaction Form ----------------

  // Calculate the total amount based on the payment fields
  const calculateTotal = () => {
    return transactionPaymentFields
      .reduce((total, field) => total + (parseFloat(field.amountPaid) || 0), 0)
      .toFixed(3);
  };

  // Handle changes in dynamic payment fields
  const handlePaymentFieldChange = (e, index, field) => {
    const updatedFields = [...transactionPaymentFields];
    updatedFields[index][field] = e.target.value;
    setTransactionPaymentFields(updatedFields);
  };

  // Option to add more payment fields
  const handleAddPaymentField = () => {
    setTransactionPaymentFields([
      ...transactionPaymentFields,
      { paymentFor: "", amountPaid: "" },
    ]);
  };

  // Remove a payment field
  const handleRemovePaymentField = (index) => {
    const updatedFields = transactionPaymentFields.filter(
      (_, i) => i !== index
    );
    setTransactionPaymentFields(updatedFields);
  };

  // Handle changes in the transaction form fields
  const handleTransactionFormChange = (e) => {
    const { name, value } = e.target;
    setTransactionFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the transaction form (calls the same API for adding a transaction)
  const handleTransactionFormSubmit = async (e) => {
    e.preventDefault();
    const committedId = localStorage.getItem("userId");

    try {
      for (const payment of transactionPaymentFields) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/addtransactions`,
          {
            kwsId: transactionFormData.kwsId,
            paymentFor: payment.paymentFor,
            cardPrintedDate: transactionFormData.cardPrintedDate,
            cardExpiryDate: transactionFormData.cardExpiryDate,
            amountKWD: payment.amountPaid,
            date: transactionFormData.date,
            remarks: transactionFormData.remarks,
            committedId,
          }
        );
        // (Optionally) you can update your UI based on response.data.transaction
      }
      alert("Transaction added successfully!");
      // Reset the transaction form and hide it
      setTransactionPaymentFields([{ paymentFor: "", amountPaid: "" }]);
      setTransactionFormData({
        kwsId: "",
        cardPrintedDate: "",
        cardExpiryDate: "",
        date: "",
        remarks: "",
      });
      setSelectedUserForTransaction(null);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  // Cancel transaction form
  const handleTransactionFormCancel = () => {
    setTransactionPaymentFields([{ paymentFor: "", amountPaid: "" }]);
    setTransactionFormData({
      kwsId: "",
      cardPrintedDate: "",
      cardExpiryDate: "",
      date: "",
      remarks: "",
    });
    setSelectedUserForTransaction(null);
  };

  // ---------------- End Transaction Form Functions ----------------

  const handleMembershipChange = (type) => {
    setFilters((prev) => {
      const selectedTypes = prev.membershipType.includes(type)
        ? prev.membershipType.filter((t) => t !== type)
        : [...prev.membershipType, type];
      return { ...prev, membershipType: selectedTypes };
    });
  };

  // Fetch user roles from localStorage
  useEffect(() => {
    const roles = localStorage.getItem("staffRoles");
    if (roles) {
      setStaffRoles(JSON.parse(roles));
    }
  }, []);

  // Fetch members data
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/member/getmembers`
      );
      if (response.data && response.data.members) {
        setList(response.data.members); // Full member list
        setFilteredResults(response.data.members); // Initially set filtered results
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(); // Fetch all members on initial load
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search functionality
  const handleSearch = () => {
    const results = list.filter((member) => {
      const matchesKwsId = filters.kwsId
        ? member.kwsid?.toLowerCase().includes(filters.kwsId.toLowerCase())
        : true;
      const matchesLookUp = filters.lookUp
        ? filters.lookUp
            .toLowerCase()
            .trim()
            .split(" ")
            .every(
              (word) =>
                member.name?.toLowerCase().includes(word) ||
                member.contact?.includes(word) ||
                member.civil_id?.includes(word)
            )
        : true;
      const matchesZone =
        filters.zone === "all" ||
        member.zone?.toLowerCase() === filters.zone.toLowerCase();
      const matchesType =
        filters.membershipType.length === 0 ||
        member.typeOfMember
          ?.split(",")
          .some((memberType) =>
            filters.membershipType.includes(memberType.trim())
          );
      const matchesStatus =
        filters.membershipStatus === "all" ||
        (filters.membershipStatus === "active" &&
          member.status?.toLowerCase() === "active") ||
        (filters.membershipStatus === "inactive" &&
          member.status?.toLowerCase() === "inactive") ||
        (filters.membershipStatus === "rejected" &&
          member.status?.toLowerCase() === "rejected");
      return (
        matchesKwsId &&
        matchesLookUp &&
        matchesZone &&
        matchesType &&
        matchesStatus
      );
    });
    setFilteredResults(results);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    setFilters({
      kwsId: "",
      lookUp: "",
      zone: "all",
      membershipType: [],
      membershipStatus: "all",
    });
    setFilteredResults(list);
    setCurrentPage(1);
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const membershipOptions = [
    "PRIVILEGE MEMBER",
    "ADVISOR",
    "CC MEMBER",
    "DONORS",
    "EC MEMBER",
    "ELITE MEMBER",
    "LIFETIME MEMBER",
    "SENIOR VICE PRESIDENT",
    "ASSISTANT GENERAL SECRETARY",
    "ASSISTANT TREASURER",
    "EX OFFICIO PRESIDENT",
    "GENERAL SECRETARY",
    "JOINT GENERAL SECRETARY",
    "JOINT TREASURER",
    "LADIES EC MEMBER",
    "PATRON",
    "PRESIDENT",
    "TREASURER",
    "VENDORS",
    "VICE PRESIDENT",
    "VC MEMBER",
    "LADIES CC MEMBER",
    "LADIES VC MEMBER",
    "LADIES ELITE MEMBER",
    "LADIES PRIVILEGE MEMBER",
  ];

  // Define zone roles
  const zoneRoles = ["fahaheel", "salmiya", "jleeb", "farwaniya", "hawally"];

  // Check if user has 'All' role
  const hasAllRole = (staffRoles?.All || staffRoles?.Registrar) === true;

  const exportToExcel = () => {
    // Format dates as dd/mm/yyyy or "-" if invalid
    const formattedResults = filteredResults.map((item) => {
      const formatDate = (dateValue) => {
        if (!dateValue) return "-";
        const parsedDate = new Date(dateValue);
        return isNaN(parsedDate.getTime())
          ? "-"
          : parsedDate.toLocaleDateString("en-GB");
      };
      return {
        ...item,
        cardValidty: formatDate(item.cardValidty),
        cardPrinted: formatDate(item.cardPrinted),
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(formattedResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    XLSX.writeFile(workbook, "members.xlsx");
  };

  // Check if user has any zone roles
  const hasAnyZoneRole = zoneRoles.some((zone) => staffRoles?.[zone]);

  // ---------------- New Function: Handle "Add Transaction" ----------------
  const handleAddTransaction = (member) => {
    // Set the selected member and prefill the kwsId field
    setSelectedUserForTransaction(member);
    setTransactionFormData((prev) => ({ ...prev, kwsId: member.kwsid }));
    // Optionally, close any open dropdown
    setActiveDropdown(null);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Search Members
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
            placeholder="Enter Name or Contact or Civil Id"
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
        <div className="relative" ref={dropdownRef}>
          <label className="block mb-2 font-bold">Membership Type</label>
          <div
            className="border p-2 rounded w-full cursor-pointer bg-white flex justify-between items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <span>
              {filters.membershipType.length > 0
                ? filters.membershipType.join(", ")
                : "All"}
            </span>
            <AiOutlineDown />
          </div>
          {showDropdown && (
            <div className="absolute w-full bg-white border rounded shadow-md mt-1 max-h-52 overflow-y-auto z-10">
              {membershipOptions.map((option, index) => (
                <label
                  key={index}
                  className="block p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={filters.membershipType.includes(option)}
                    onChange={() => handleMembershipChange(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="rejected">Rejected</option>
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
          onClick={exportToExcel}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <AiOutlinePrinter size={20} /> <span>Export to Excel</span>
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">KWS ID</th>
                  <th className="border px-4 py-2">Civil ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Zone</th>
                  <th className="border px-4 py-2">Contact</th>
                  <th className="border px-4 py-2">Type of Member</th>
                  <th className="border px-4 py-2">Card Printed Date</th>
                  <th className="border px-4 py-2">Card Validity Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Options</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => {
                  const memberZone = item.zone?.toLowerCase();
                  const isZoneMember = zoneRoles.includes(memberZone);
                  const isLadiesMember = item.typeOfMember
                    ?.toLowerCase()
                    .includes("ladies");
                  const isActivemember = item.status
                    ?.toLowerCase()
                    .includes("inactive");

                  const splittedCardValidity = item?.cardValidty.split(" ");
                  const finalCardValidity = splittedCardValidity
                    ?.slice(1)
                    .join(" ");

                  return (
                    <React.Fragment key={index}>
                      <tr
                        className={`text-center 
                        ${isLadiesMember ? "bg-pink-100" : ""} 
                        ${isActivemember ? "bg-yellow-200" : ""}`}
                      >
                        <td className="border px-4 py-2">{item.kwsid}</td>
                        <td className="border px-4 py-2">{item.civil_id}</td>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.zone}</td>
                        <td className="border px-4 py-2">{item.contact}</td>
                        <td className="border px-4 py-2">
                          {item.typeOfMember?.split(",").map((type, i) => (
                            <div key={i}>{type.trim()}</div>
                          ))}
                        </td>
                        <td className="border px-4 py-2">{item.cardPrinted}</td>
                        <td className="border px-4 py-2">
                          {finalCardValidity}
                        </td>
                        <td className="border px-4 py-2">{item.status}</td>
                        <td className="border px-4 py-2 relative">
                          <button
                            onClick={() => toggleDropdown(index)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <AiOutlineEllipsis size={20} />
                          </button>
                          {activeDropdown === index && (
                            <div className="absolute bg-white border shadow-md right-0 mt-2 z-10 w-48">
                              {/* Always show View button */}
                              <button
                                className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleView(item.user_id)}
                              >
                                View
                              </button>
                              {/* Conditionally render Edit and Add Transaction buttons */}
                              {(hasAllRole || !isZoneMember) && (
                                <>
                                  <button
                                    className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleEdit(item.user_id)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block px-4 py-2 text-purple-500 hover:bg-gray-100 w-full text-left"
                                    onClick={() => handleAddTransaction(item)}
                                  >
                                    Add Transaction
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                      {/* If this member is selected for adding a transaction, render the inline transaction form */}
                      {selectedUserForTransaction &&
                        selectedUserForTransaction.user_id === item.user_id && (
                          <tr>
                            <td colSpan="10" className="bg-gray-100 p-4">
                              <form onSubmit={handleTransactionFormSubmit}>
                                <h2 className="text-lg font-bold mb-4">
                                  Add Transaction for {item.name} (KWS ID:{" "}
                                  {item.kwsid})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block mb-2 font-bold">
                                      KWS ID*
                                    </label>
                                    <input
                                      type="text"
                                      name="kwsId"
                                      value={transactionFormData.kwsId}
                                      onChange={handleTransactionFormChange}
                                      placeholder="Enter KWS ID"
                                      className="border p-2 rounded w-full"
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-2 font-bold">
                                      Date*
                                    </label>
                                    <input
                                      type="date"
                                      name="date"
                                      value={transactionFormData.date}
                                      onChange={handleTransactionFormChange}
                                      className="border p-2 rounded w-full"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-2 font-bold">
                                      Card Printed Date
                                    </label>
                                    <input
                                      type="date"
                                      name="cardPrintedDate"
                                      value={
                                        transactionFormData.cardPrintedDate
                                      }
                                      onChange={handleTransactionFormChange}
                                      className="border p-2 rounded w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block mb-2 font-bold">
                                      Card Expiry Date
                                    </label>
                                    <input
                                      type="date"
                                      name="cardExpiryDate"
                                      value={transactionFormData.cardExpiryDate}
                                      onChange={handleTransactionFormChange}
                                      className="border p-2 rounded w-full"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <label className="block mb-2 font-bold">
                                      Remarks
                                    </label>
                                    <textarea
                                      name="remarks"
                                      value={transactionFormData.remarks}
                                      onChange={handleTransactionFormChange}
                                      placeholder="Enter Remarks"
                                      className="border p-2 rounded w-full"
                                    ></textarea>
                                  </div>
                                </div>

                                {/* Payment For and Amount Paid Fields */}
                                <div>
                                  <label className="block mb-2 font-bold">
                                    Payment Details
                                  </label>
                                  <select
                                    value={transactionPaymentFields.length}
                                    onChange={(e) => {
                                      const numFields = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      const updatedFields = Array.from(
                                        { length: numFields },
                                        () => ({
                                          paymentFor: "",
                                          amountPaid: "",
                                        })
                                      );
                                      setTransactionPaymentFields(
                                        updatedFields
                                      );
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

                                {transactionPaymentFields.map((field, idx) => (
                                  <div
                                    key={idx}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                                  >
                                    <div>
                                      <label className="block mb-2 font-bold">
                                        Payment For*
                                      </label>
                                      <select
                                        name={`paymentFor-${idx}`}
                                        value={field.paymentFor}
                                        onChange={(e) =>
                                          handlePaymentFieldChange(
                                            e,
                                            idx,
                                            "paymentFor"
                                          )
                                        }
                                        className="border p-2 rounded w-full"
                                        required
                                      >
                                        <option value="">Select</option>
                                        <option value="NEW">NEW</option>
                                        <option value="RENEWAL">RENEWAL</option>
                                        <option value="ELITE NEW">
                                          ELITE NEW
                                        </option>
                                        <option value="ELITE RENEWAL">
                                          ELITE RENEWAL
                                        </option>
                                        <option value="PRIVILEGE NEW">
                                          PRIVILEGE NEW
                                        </option>
                                        <option value="PRIVILEGE RENEWAL">
                                          PRIVILEGE RENEWAL
                                        </option>
                                        <option value="MBS1">MBS1</option>
                                        <option value="MBS2">MBS2</option>
                                        <option value="MBS3">MBS3</option>
                                        <option value="MBS4">MBS4</option>
                                        <option value="LIFE MEMBERSHIP">
                                          LIFE MEMBERSHIP
                                        </option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block mb-2 font-bold">
                                        Amount Paid (KWD)*
                                      </label>
                                      <input
                                        type="number"
                                        name={`amountPaid-${idx}`}
                                        value={field.amountPaid}
                                        onChange={(e) =>
                                          handlePaymentFieldChange(
                                            e,
                                            idx,
                                            "amountPaid"
                                          )
                                        }
                                        placeholder="Enter Amount"
                                        className="border p-2 rounded w-full"
                                        required
                                      />
                                    </div>
                                    {idx > 0 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemovePaymentField(idx)
                                        }
                                        className="text-red-500 hover:text-red-700 mt-4"
                                      >
                                        Remove Payment
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <div className="flex justify-start mt-4">
                                  <label className="mt-2 font-bold">
                                    Total Amount Paid (KWD):
                                  </label>
                                  <h1 className="ml-4 text-3xl font-semibold">
                                    {calculateTotal()}
                                  </h1>
                                </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                  <button
                                    type="button"
                                    onClick={handleTransactionFormCancel}
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
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-4">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Prev
              </button>

              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-green-700 text-white"
                    : "bg-gray-300 hover:bg-blue-500 hover:text-white"
                }`}
              >
                1
              </button>

              {/* Second Page */}
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(2)}
                  className={`px-4 py-2 rounded ${
                    currentPage === 2
                      ? "bg-green-700 text-white"
                      : "bg-gray-300 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  2
                </button>
              )}

              {/* Ellipsis before current page if far from start */}
              {currentPage > 3 && <span className="px-4 py-2">...</span>}

              {/* Current Page Box */}
              {currentPage > 2 && currentPage < totalPages - 1 && (
                <button
                  className="px-4 py-2 rounded bg-green-700 text-white"
                  disabled
                >
                  {currentPage}
                </button>
              )}

              {/* Ellipsis after current page if far from end */}
              {currentPage < totalPages - 2 && (
                <span className="px-4 py-2">...</span>
              )}

              {/* Last Page */}
              {totalPages > 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-green-700 text-white"
                      : "bg-gray-300 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {totalPages}
                </button>
              )}

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
