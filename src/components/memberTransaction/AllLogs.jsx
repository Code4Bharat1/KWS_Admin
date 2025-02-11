"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const AllLogs = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("uid");

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch logs based on the uid (or transaction id, as determined by the backend)
  const fetchAllLogs = async () => {
    if (!id) {
      alert("UID is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/viewlogs/${id}`
      );
      // console.log("Response data:", response.data);
      // Assuming response.data is an array of log objects.
      setLogs(response.data || []);
    } catch (error) {
      console.error("Error fetching logs:", error.response || error);
      if (error.response && error.response.status === 404) {
        setLogs([]);
      } else {
        alert("An error occurred while fetching logs.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAllLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Logs</h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Log ID</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Amount (KWD)</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Action</th>
                <th className="border px-4 py-2">Created</th>
                <th className="border px-4 py-2">Remarks</th>
                <th className="border px-4 py-2">Committed By</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.log_id} className="text-center">
                    <td className="border px-4 py-2">{log.log_id}</td>
                    <td className="border px-4 py-2">{log.category}</td>
                    <td className="border px-4 py-2">{log.amount}</td>
                    <td className="border px-4 py-2">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {log.action || "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {log.created_date
                        ? new Date(log.created_date).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {log.remarks || "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {log.committed_by || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-2">
                    No Logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AllLogs;
