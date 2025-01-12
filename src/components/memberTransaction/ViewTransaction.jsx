"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Correct hook for App Router to access query params
import axios from "axios";
import { parseISO, format } from "date-fns"; // Import date-fns functions

const ViewTransaction = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid"); // Get the `uid` from query parameters

  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch transaction details
  const fetchTransactionDetails = async () => {
    try {
      setIsLoading(true);
      if (!uid) return; // Ensure `uid` exists before making the request
      const formattedUid = uid.toString().padStart(8, "0"); // Ensure UID is formatted correctly
      const response = await axios.get(
        `http://localhost:5786/api/transaction/get/${formattedUid}` // Adjust URL if necessary
      );
      console.log("API Response:", response.data); // Log the complete response
      setTransactionDetails(response.data);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      alert("Failed to fetch transaction details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) { // Only fetch once `uid` is available
      fetchTransactionDetails();
    }
  }, [uid]); // Re-run the effect whenever `uid` changes

  // Helper function to format date properly
  const formatDate = (date) => {
    // Log the raw date to check the format
    console.log("Raw date:", date);

    // Check for missing dates or "Not Available"
    if (!date || date === "Not Available" || date === null) {
      console.log("Invalid date value:", date);
      return "Not Available";
    }

    try {
      // Manually add time to the date string to make it an ISO string
      const isoDate = date.includes("T") ? date : `${date}T00:00:00.000Z`;

      // Parse the modified ISO date string
      const parsedDate = parseISO(isoDate);

      // Check if the parsed date is valid
      if (isNaN(parsedDate)) {
        console.error("Invalid date value:", isoDate);
        return "Invalid Date";
      }

      // Format the date in a readable format
      return format(parsedDate, "dd MMMM yyyy"); // Format as "01 January 2025"
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">View Transaction</h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : transactionDetails ? (
        <div className="border rounded p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            Transaction Details for UID: {uid}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-bold">KWS ID:</p>
              <p>{transactionDetails.KWSID}</p>
            </div>
            <div>
              <p className="font-bold">Payment For:</p>
              <p>{transactionDetails.Name}</p>
            </div>
           
           
            <div>
              
              <p className="font-bold">Amount Paid (KWD):</p>
              <p>{transactionDetails.AmountKWD}</p>
            </div>
            <div>
              <p className="font-bold">Date:</p>
              <p>{formatDate(transactionDetails.Date)}</p> {/* Normal Date */}
            </div>
            <div className="col-span-2">
              <p className="font-bold">Remarks:</p>
              <p>{transactionDetails.Remarks || "No Remarks"}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => window.history.back()} // Go back to the previous page
            >
              Back to Transactions
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">No transaction details available.</div>
      )}
    </div>
  );
};

export default ViewTransaction;
