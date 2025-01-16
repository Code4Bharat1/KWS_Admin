"use client";
import React, { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'; // Importing the necessary ZXing components
import axios from "axios";

const ScanAttendance = () => {
  const [scannedCode, setScannedCode] = useState("");
  const [eventId, setEventId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);  // State to control the popup visibility
  const videoRef = useRef(null); // Ref to hold the video element

  useEffect(() => {
    // Extract event_id from the URL
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
          null, // Device ID, null will automatically pick the best camera
          videoRef.current,
          (result, err) => {
            if (result) {
              setScannedCode(result.text); // Set the scanned code
              setSuccessMessage("QR Code scanned successfully!");
              setErrorMessage(null);
              markAttendance(result.text); // Mark attendance after scan
              stopScanner(); // Stop the scanner after a successful scan
            } else if (err instanceof NotFoundException) {
              // console.log("No QR code found, waiting for QR code...");
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

    if (eventId) startScanner(); // Start the scanner when the event ID is available

    return () => {
      // Cleanup: stop the scanner when the component unmounts
      stopScanner();
    };
  }, [eventId]);

  const stopScanner = () => {
    setScannerActive(false);
    const codeReader = new BrowserMultiFormatReader();
    codeReader.reset();
  };

  const markAttendance = async (ticketNo) => {
    if (!ticketNo) {
      setErrorMessage("No ticket or KWS ID scanned.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5786/api/event/markattendance/${eventId}`,
        {
          event_id: eventId,
          ticket_no: ticketNo,
        }
      );

      setSuccessMessage(response.data.message || "Attendance marked successfully.");
      setErrorMessage(null);
      setIsPopupVisible(true); // Show popup after successful scan
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data || error);
      setErrorMessage(
        error.response?.data?.error || "Failed to mark attendance."
      );
      setSuccessMessage(null);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false); // Close the popup
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Scan Attendance</h2>

      {/* QR Scanner */}
      <div className="flex justify-center mb-4">
        <video ref={videoRef} width="300" height="300" style={{ border: "1px solid #ddd" }} />
      </div>

      {/* Input Field for Scanned Code */}
      <div className="w-full max-w-md mx-auto mb-4">
        <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700">
          Scanned Ticket/KWS ID:
        </label>
        <input
          type="text"
          id="ticketId"
          value={scannedCode}
          readOnly
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Mark Attendance Button */}
      <div className="flex justify-center">
        <button
          onClick={() => markAttendance(scannedCode)}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Mark Attendance
        </button>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2 text-center">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-500 mt-2 text-center">{successMessage}</p>
      )}

      {/* Success Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-green-500">Attendance Marked</h3>
            <p className="text-sm mt-2">The attendance has been successfully marked for ticket {scannedCode}.</p>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAttendance;
