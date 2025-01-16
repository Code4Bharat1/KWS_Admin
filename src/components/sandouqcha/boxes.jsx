"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlinePlus,
  AiOutlineEllipsis,
} from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use Next.js router

const Boxes = () => {
  const [filters, setFilters] = useState({
    kwsId: "",
    zone: "all",
    boxNumber: "",
    inUse: "all",
  });

  const [list, setList] = useState([]);
  const [originalList, setOriginalList] = useState([]); // To store the full unfiltered list

  // New state for add form
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Add a state to track which add type is selected ('kws' or 'nonkws')
  const [addType, setAddType] = useState(null);
  // Also track if the "add type" dropdown is open
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  const [newBox, setNewBox] = useState({
    boxFor: "",
    boxNumber: "",
    inUse: "No",
    dateIssued: "",
    remarks: "",
    referredBy: "",
  });

  const [errors, setErrors] = useState({}); // Store error messages
  const [activeDropdown, setActiveDropdown] = useState(null); // To track which row's dropdown is active

  const router = useRouter();
  const dropdownRef = useRef(null);
  const addDropdownRef = useRef(null);

  // Fetch box list from the backend
  const fetchBoxList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5786/api/sandouqcha/getboxlist"
      );
      setList(response.data); // Assuming API returns a list of boxes
      setOriginalList(response.data); // Save the original list
    } catch (error) {
      console.error("Error fetching box list:", error);
      alert("Failed to fetch box list.");
    }
  };

  useEffect(() => {
    fetchBoxList(); // Fetch box list on component mount
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filteredList = originalList.filter((item) => {
      const matchesKwsId =
        filters.kwsId === "" ||
        (item.holderName &&
          item.holderName.toLowerCase().includes(filters.kwsId.toLowerCase()));
      const matchesZone =
        filters.zone === "all" ||
        (item.zone && item.zone.toLowerCase() === filters.zone.toLowerCase());
      const matchesBoxNumber =
        filters.boxNumber === "" || item.number.toString() === filters.boxNumber;
      const matchesInUse =
        filters.inUse === "all" ||
        (item.inUse &&
          item.inUse.toLowerCase() === filters.inUse.toLowerCase());

      return matchesKwsId && matchesZone && matchesBoxNumber && matchesInUse;
    });
    setList(filteredList);
  };

  const handleRefresh = () => {
    setFilters({ kwsId: "", zone: "all", boxNumber: "", inUse: "all" });
    setList(originalList); // Reset to the original unfiltered list
  };

  const handlePrint = () => {
    // Generate a printable report based on the current filtered list
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #355F2E;">Sandouqcha Boxes Report</h1>
        <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse: collapse; margin-top: 20px;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th>Number</th>
              <th>Holder Name</th>
              <th>In Use</th>
              <th>Date Issued</th>
              <th>Referred By</th>
              <th>Holder Contact</th>
              <th>Zone</th>
            </tr>
          </thead>
          <tbody>
            ${list
              .map(
                (item) => `
              <tr>
                <td style="text-align: center;">${item.number}</td>
                <td style="text-align: center;">${item.holderName}</td>
                <td style="text-align: center; color: ${
                  item.inUse === "Yes" ? "green" : "red"
                }; font-weight: bold;">${item.inUse}</td>
                <td style="text-align: center;">${item.dateIssued}</td>
                <td style="text-align: center;">${item.referredBy}</td>
                <td style="text-align: center;">${item.holderContact}</td>
                <td style="text-align: center;">${item.zone}</td>
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
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Validation function conditionally checks the boxFor field based on type
  const validateForm = () => {
    const newErrors = {};
    // If adding for KWS member, the ID should match pattern KWSKW + 5 digits;
    // if Non-KWS, the pattern is KWSKWN + 5 digits
    const kwsIdPattern = /^KWSKW\d{5}$/i;
    const nonKwsIdPattern = /^KWSKWN\d{4}$/i;
    
    // Validate boxFor (ID) field based on addType
    if (!newBox.boxFor.trim()) {
      newErrors.boxFor = "Box For is required.";
    } else {
      if (addType === "kws") {
        if (!kwsIdPattern.test(newBox.boxFor.trim())) {
          newErrors.boxFor =
            "KWS ID must start with 'KWSKW' followed by 5 digits.";
        }
      } else if (addType === "nonkws") {
        if (!nonKwsIdPattern.test(newBox.boxFor.trim())) {
          newErrors.boxFor =
            "Non-KWS ID must start with 'KWSKWN' followed by 5 digits.";
        }
      }
    }

    if (!newBox.boxNumber.trim()) {
      newErrors.boxNumber = "Box Number is required.";
    } else if (!/^\d+$/.test(newBox.boxNumber.trim())) {
      newErrors.boxNumber = "Box Number must be a valid number.";
    } else if (parseInt(newBox.boxNumber.trim(), 10) <= 0) {
      newErrors.boxNumber = "Box Number must be a positive number.";
    }

    if (!newBox.dateIssued.trim()) {
      newErrors.dateIssued = "Date Issued is required.";
    } else {
      const issuedDate = new Date(newBox.dateIssued);
      const today = new Date();
      if (isNaN(issuedDate.getTime())) {
        newErrors.dateIssued = "Date Issued must be a valid date.";
      } else if (issuedDate > today) {
        newErrors.dateIssued = "Date Issued cannot be in the future.";
      }
    }

    if (!newBox.referredBy.trim()) {
      newErrors.referredBy = "Referred By is required.";
    } else if (!kwsIdPattern.test(newBox.referredBy.trim())) {
      newErrors.referredBy =
        "Referred By must start with 'KWSKW' followed by 5 digits.";
    }

    return newErrors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors
      return; // Prevent form submission
    }
    setErrors({}); // Clear previous errors
    const committedId = localStorage.getItem("userId");
    try {
      let response;
      if (addType === "kws") {
        // POST request for KWS
        response = await axios.post(
          "http://localhost:5786/api/sandouqcha/add",
          {
            boxFor: newBox.boxFor.trim(), // KWS ID
            boxNumber: parseInt(newBox.boxNumber.trim(), 10), // Box Number as integer
            inUse: newBox.inUse, // Yes/No
            dateIssued: newBox.dateIssued, // Date Issued
            remarks: newBox.remarks.trim() || null, // Optional Remarks
            referredBy: newBox.referredBy.trim(),
            committedId:committedId, // Referred By field
          }
        );
      } else if (addType === "nonkws") {
        // POST request for Non-KWS; note that the endpoint is /addnon
        response = await axios.post(
          "http://localhost:5786/api/sandouqcha/addnon",
          {
            boxFor: newBox.boxFor.trim(), // Non-KWS ID (should start with KWSKWN)
            boxNumber: newBox.boxNumber.trim(), // Box Number as string
            inUse: newBox.inUse, // Yes/No
            dateIssued: newBox.dateIssued, // Date Issued
            remarks: newBox.remarks.trim() || null, // Optional Remarks
            referredBy: newBox.referredBy.trim(), // Referred By field
          }
        );
      }

      // Update the list with the new box
      setList((prev) => [...prev, response.data.box]);
      setOriginalList((prev) => [...prev, response.data.box]);

      // Reset the form inputs and add type selection
      setNewBox({
        boxFor: "",
        boxNumber: "",
        inUse: "No",
        dateIssued: "",
        remarks: "",
        referredBy: "",
      });
      setAddType(null);
      setIsFormVisible(false);
      alert("Box added successfully!");
    } catch (error) {
      console.error(
        "Error adding box:",
        error.response?.data || error.message
      );
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.error || "Failed to add box.");
      }
    }
  };

  const handleFormCancel = () => {
    setNewBox({
      boxFor: "",
      boxNumber: "",
      inUse: "No",
      dateIssued: "",
      remarks: "",
      referredBy: "",
    });
    setErrors({});
    setIsFormVisible(false);
    setAddType(null);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  // Close row dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close add-type dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideAdd = (event) => {
      if (
        addDropdownRef.current &&
        !addDropdownRef.current.contains(event.target)
      ) {
        setIsAddDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideAdd);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAdd);
    };
  }, []);

  const handleOptionClick = (option, number) => {
    setActiveDropdown(null); // Close the dropdown
    switch (option) {
      case "view":
        router.push(`/sandouqcha/view-box?number=${number}`);
        break;
      case "edit":
        router.push(`/sandouqcha/edit-box?number=${number}`);
        break;
      case "logs":
        router.push(`/sandouqcha/box-logs?number=${number}`);
        break;
      default:
        break;
    }
  };

  // When clicking the Add button, toggle the add type dropdown
  const handleAddButtonClick = () => {
    setIsAddDropdownOpen((prev) => !prev);
  };

  // When choosing an add type, close the dropdown and show the form
  const selectAddType = (type) => {
    setAddType(type);
    setIsAddDropdownOpen(false);
    setIsFormVisible(true);
  };

  return (
    <div className="p-6 relative" ref={dropdownRef}>
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Sandouqcha Boxes
      </h1>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-2 mb-6">
        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
        >
          <AiOutlineSearch size={20} /> <span></span>
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <AiOutlinePrinter size={20} /> <span>Print</span>
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
        >
          <AiOutlineReload size={20} /> <span>Refresh</span>
        </button>
        <div className="relative" ref={addDropdownRef}>
          <button
            onClick={handleAddButtonClick}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <AiOutlinePlus size={20} /> <span>Add</span>
          </button>
          {isAddDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
              <button
                onClick={() => selectAddType("kws")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                KWS ID
              </button>
              <button
                onClick={() => selectAddType("nonkws")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Non-KWS ID
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">
            Search by KWS ID / KWSKWN ID
          </label>
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
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Add Box Form */}
      {isFormVisible && (
        <form
          onSubmit={handleFormSubmit}
          className="mb-6 p-4 border rounded bg-gray-50"
        >
          <h2 className="text-lg font-bold mb-4">
            Add New Box{" "}
            {addType === "kws"
              ? "(KWS ID)"
              : addType === "nonkws"
              ? "(Non-KWS ID)"
              : ""}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Box For Field */}
            <div>
              <label className="block mb-2 font-bold">
                Box For {addType === "kws" ? " (KWS ID)" : " (Non-KWS ID)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="boxFor"
                value={newBox.boxFor}
                onChange={(e) =>
                  setNewBox({ ...newBox, boxFor: e.target.value })
                }
                placeholder={
                  addType === "kws" ? "KWSKW00000" : "KWSKWN00000"
                }
                className={`border p-2 rounded w-full ${
                  errors.boxFor ? "border-red-500" : ""
                }`}
              />
              {errors.boxFor && (
                <p className="text-red-500 text-sm mt-1">{errors.boxFor}</p>
              )}
            </div>
            {/* Box Number Field */}
            <div>
              <label className="block mb-2 font-bold">
                Box Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="boxNumber"
                value={newBox.boxNumber}
                onChange={(e) =>
                  setNewBox({ ...newBox, boxNumber: e.target.value })
                }
                placeholder="Enter Box Number"
                className={`border p-2 rounded w-full ${
                  errors.boxNumber ? "border-red-500" : ""
                }`}
              />
              {errors.boxNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.boxNumber}
                </p>
              )}
            </div>
            {/* In Use Field */}
            <div>
              <label className="block mb-2 font-bold">In Use?</label>
              <select
                name="inUse"
                value={newBox.inUse}
                onChange={(e) =>
                  setNewBox({ ...newBox, inUse: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {/* Date Issued Field */}
            <div>
              <label className="block mb-2 font-bold">
                Date Issued <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateIssued"
                value={newBox.dateIssued}
                onChange={(e) =>
                  setNewBox({ ...newBox, dateIssued: e.target.value })
                }
                className={`border p-2 rounded w-full ${
                  errors.dateIssued ? "border-red-500" : ""
                }`}
              />
              {errors.dateIssued && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateIssued}
                </p>
              )}
            </div>
            {/* Remarks Field */}
            <div>
              <label className="block mb-2 font-bold">Remarks</label>
              <input
                type="text"
                name="remarks"
                value={newBox.remarks}
                onChange={(e) =>
                  setNewBox({ ...newBox, remarks: e.target.value })
                }
                placeholder="Enter Remarks"
                className="border p-2 rounded w-full"
              />
            </div>
            {/* Referred By Field */}
            <div>
              <label className="block mb-2 font-bold">
                Referred By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="referredBy"
                value={newBox.referredBy}
                onChange={(e) =>
                  setNewBox({ ...newBox, referredBy: e.target.value })
                }
                placeholder="Enter Referred By KWS ID"
                className={`border p-2 rounded w-full ${
                  errors.referredBy ? "border-red-500" : ""
                }`}
              />
              {errors.referredBy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.referredBy}
                </p>
              )}
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
              <th className="border px-4 py-2">Referred By</th>
              <th className="border px-4 py-2">Holder Contact</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(list) && list.length === 0 ? (
    <tr>
      <td colSpan="7" className="border px-4 py-2 text-center">
        No boxes found.
      </td>
    </tr>
  ) : (
    Array.isArray(list) &&
    list.map((item, index) => (
      <tr key={index} className="text-center relative">
        <td className="border px-4 py-2">{item.number}</td>
        <td className="border px-4 py-2">{item.holderName}</td>
        <td className="border px-4 py-2">
          {item.inUse === "Yes" ? (
            <span className="text-green-500 font-bold">✓</span>
          ) : (
            <span className="text-red-500 font-bold">✗</span>
          )}
        </td>
        <td className="border px-4 py-2">{item.dateIssued || "None"}</td>
        <td className="border px-4 py-2">{item.referredBy || "N/A"}</td>
        <td className="border px-4 py-2">{item.holderContact || "N/A"}</td>
        <td className="border px-4 py-2 relative">
          <button
            onClick={() => toggleDropdown(index)}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 rounded-full"
          >
            <AiOutlineEllipsis size={20} />
          </button>
          {/* Dropdown Menu */}
          {activeDropdown === index && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-20">
              <button
                onClick={() => handleOptionClick("view", item.number)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                View
              </button>
              <button
                onClick={() => handleOptionClick("edit", item.number)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleOptionClick("logs", item.number)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logs
              </button>
            </div>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default Boxes;
