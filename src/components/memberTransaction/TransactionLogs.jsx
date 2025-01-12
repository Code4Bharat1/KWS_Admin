"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Use useSearchParams hook to get query params
import axios from "axios";

const TransactionLogs = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid"); // Fetch the UID from the URL query params

  // Log to see if UID is being retrieved
  console.log("UID from URL:", uid);

  const [logs, setLogs] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transaction logs based on the UID
  const fetchTransactionLogs = async () => {
    if (!uid) {
      alert("UID is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5786/api/transaction/getlogs/${uid}`);
      setUserDetails(response.data.user); // Get user details from the response
      setLogs(response.data.transactions); // Get transaction logs
    } catch (error) {
      console.error("Error fetching transaction logs:", error);
      alert("Failed to fetch transaction logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchTransactionLogs(); // Fetch logs only if UID is available
    }
  }, [uid]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Logs</h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h2 className="text-xl mb-4">Transaction Logs for User: {userDetails.first_name} {userDetails.last_name}</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Transaction ID</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Amount (KWD)</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{log.id}</td>
                    <td className="border px-4 py-2">{log.category}</td>
                    <td className="border px-4 py-2">{log.amount}</td>
                    <td className="border px-4 py-2">{log.date}</td>
                    <td className="border px-4 py-2">{log.remarks || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-2">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TransactionLogs;
