"use client";
import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";

const ScanAttendance = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [eventId, setEventId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [numOfPeople, setNumOfPeople] = useState(0);
  const videoRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});

  // Controlled form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [civilId, setCivilId] = useState("");

  // Reset form fields
  const resetForm = () => {
    setScannedCode("");
    setName("");
    setPhone("");
    setCivilId("");
    setNumOfPeople(0);
    setFormErrors({});
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const event_id = searchParams.get("event_id");

    if (!event_id) {
      setErrorMessage("Event ID is missing in the URL.");
      return;
    }

    setEventId(event_id);
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const startScanner = async () => {
      if (!videoRef.current) return;

      const codeReader = new BrowserMultiFormatReader();
      try {
        await codeReader.decodeFromVideoDevice(
          null,
          videoRef.current,
          async (result, err) => {
            if (result) {
              setScannedCode(result.text);
              setSuccessMessage("QR Code scanned successfully!");
              setErrorMessage(null);
              await fetchMemberDetails(result.text);
            } else if (err instanceof NotFoundException) {
              // No QR found, waiting...
            } else {
              console.error("Error scanning QR code", err);
              setErrorMessage("Error scanning QR code.");
            }
          }
        );
        setScannerActive(true);
      } catch (err) {
        console.error("Failed to start scanner", err);
        setErrorMessage("Failed to start QR scanner.");
      }
    };

    if (eventId) startScanner();

    return () => {
      stopScanner();
    };
  }, [eventId]);

  const stopScanner = () => {
    setScannerActive(false);
    const codeReader = new BrowserMultiFormatReader();
    codeReader.reset();
  };

  const fetchMemberDetails = async (kwsId) => {
    if (!kwsId) {
      setErrorMessage("Invalid KWS ID.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/memberdetail`,
        { kws_id: kwsId }
      );

      const {
        first_name = "",
        last_name = "",
        middle_name = "",
        kuwait_contact = "",
        civil_id = "",
      } = response?.data ?? {};

      setName(first_name + " " + middle_name + " " + last_name || "");
      setPhone(kuwait_contact || "");
      setCivilId(civil_id || "");

      setIsPopupVisible(true);
    } catch (error) {
      console.error(
        "Error fetching member details:",
        error.response?.data || error
      );
      setErrorMessage(
        error.response?.data?.error || "Failed to fetch member details."
      );

      setName("");
      setPhone("");
      setCivilId("");

      setIsPopupVisible(true);
    }
  };

  const validateForm = () => {
    const errors = {};

    // ID validation - exactly 10 digits
    if (!scannedCode) {
      errors.scannedCode = "ID is required";
    } else if (scannedCode.length !== 10) {
      errors.scannedCode = "ID must be exactly 10 digits";
    }
    if (!name) errors.name = "Name is required";

    if (!phone) errors.phone = "Phone is required";

    // Civil ID validation - exactly 12 digits
    if (!civilId) {
      errors.civilId = "Civil ID is required";
    } else if (!/^\d{12}$/.test(civilId)) {
      errors.civilId = "Civil ID must be exactly 12 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const markAttendance = async () => {
    if (!validateForm()) {
      return;
    }

    // Set num_people to 0 if ID doesn't start with KWSKW
    const finalNumOfPeople = scannedCode.startsWith("KWSKW") ? numOfPeople : 0;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/event/markattendance/${eventId}`,
        {
          event_id: eventId,
          ticket_no: scannedCode,
          raffle_id: eventId,
          kws_id: scannedCode,
          name,
          phone,
          civil_id: civilId,
          num_people: finalNumOfPeople,
        }
      );

      setSuccessMessage(
        response.data.message || "Attendance marked successfully."
      );
      setErrorMessage(null);
      resetForm(); // Reset form fields after successful submission
      setIsPopupVisible(false);
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.error || "Failed to mark attendance."
      );
      setSuccessMessage(null);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    resetForm();
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Scan Attendance</h2>

      {/* QR Scanner */}
      <div className="flex justify-center mb-4">
        <video
          ref={videoRef}
          width="300"
          height="300"
          style={{ border: "1px solid #ddd" }}
        />
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsPopupVisible(true)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
        >
          Add Attendance Manually
        </button>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-500 mt-2 text-center">
          {successMessage}
        </p>
      )}

      {/* Attendance Form Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-green-500">
              Confirm Attendance
            </h3>
            <p className="text-sm mt-2">
              Please fill all required fields to mark attendance.
            </p>

            {/* ID Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setScannedCode(value);
                // Reset numOfPeople to 0 if ID doesn't start with KWSKW
                if (!value.startsWith("KWSKW")) {
                  setNumOfPeople(0);
                  // If not KWSKW, enforce 10-digit limit for numeric IDs
                  if (/^\d+$/.test(value)) {
                    setScannedCode(value.slice(0, 10));
                  }
                }
              }}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.scannedCode ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {formErrors.scannedCode && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.scannedCode}
              </p>
            )}

            {/* Name Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}

            {/* Phone Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
            )}

            {/* Civil ID Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Civil ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={civilId}
              onChange={(e) => {
                // Only allow numbers and limit to 12 characters
                const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                setCivilId(value);
              }}
              pattern="\d{12}"
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.civilId ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              required
            />
            {formErrors.civilId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.civilId}</p>
            )}

            {/* Number of people with member Field - Only show if ID starts with KWSKW */}
            {scannedCode.startsWith("KWSKW") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-3">
                  Additional people with KWS Member
                </label>
                <input
                  type="number"
                  value={numOfPeople}
                  placeholder="Enter Count of Additional People"
                  min={0}
                  onChange={(e) => setNumOfPeople(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            )}

            {/* Submit and Close Buttons */}
            <div className="flex justify-end mt-4">
              <button
                onClick={markAttendance}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
              >
                Confirm
              </button>
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAttendance;
