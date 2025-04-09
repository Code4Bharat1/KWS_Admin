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

  // Controlled form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [civilId, setCivilId] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const raffleId = searchParams.get("id");

    if (!raffleId) {
      setErrorMessage("Event ID is missing in the URL.");
      return;
    }

    setEventId(raffleId);
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
              await fetchMemberDetails(result.text); // Fetch member details before showing the popup
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

    return () => stopScanner();
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

      const { first_name, last_name, middle_name, kuwait_contact, civil_id } =
        response.data;

      // Populate controlled inputs with fetched data
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

      // Allow manual entry if no data is found
      setName("");
      setPhone("");
      setCivilId("");

      setIsPopupVisible(true);
    }
  };

  const markAttendance = async () => {
    if (!scannedCode) {
      setErrorMessage("No ticket or KWS ID scanned.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/markattendance/${eventId}`,
        {
          raffle_id: eventId,
          kws_id: scannedCode,
          name,
          phone,
          civil_id: civilId,
          num_people: numOfPeople,
        }
      );

      setSuccessMessage(
        response.data.message || "Attendance marked successfully."
      );
      setErrorMessage(null);
      setIsPopupVisible(false);
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.error || "Failed to mark attendance."
      );
      setSuccessMessage(null);
    }
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

      {/* Error and Success Messages */}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-500 mt-2 text-center">
          {successMessage}
        </p>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsPopupVisible(true)}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200"
        >
          Add Attendance Manually
        </button>
      </div>

      {/* Success Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-green-500">
              Confirm Attendance
            </h3>
            <p className="text-sm mt-2">
              Please verify the details before marking attendance.
            </p>

            {/* KWS ID Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              ID
            </label>
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Name Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Phone Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Phone
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Civil ID Field */}
            <label className="block text-sm font-medium text-gray-700 mt-3">
              Civil ID
            </label>
            <input
              type="text"
              value={civilId}
              onChange={(e) => setCivilId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Number of people with member Field */}
            {scannedCode.includes("KWSKW") && (
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
                onClick={() => setIsPopupVisible(false)}
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
