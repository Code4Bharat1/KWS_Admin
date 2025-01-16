"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const BoxLogs = () => {
  const searchParams = useSearchParams();
  const number = searchParams.get("number"); 

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch logs based on the box number
        const response = await axios.get(
          `http://localhost:5786/api/sandouqcha/getboxlogs/${number}`
        );
        setLogs(response.data); // Assuming the response contains an array of logs
        setLoading(false);
      } catch (error) {
        console.error("Error fetching box logs:", error);
        setLoading(false);
      }
    };

    if (number) {
      fetchLogs();
    }
  }, [number]); // Re-fetch logs whenever the number changes

  if (loading) {
    return <div>Loading logs...</div>;
  }

  if (!logs.length) {
    return <div>No logs found for this box number.</div>;
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-semibold font-syne mb-6 text-center text-green-800">
        View Logs for Box Number {number}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-green-600">Logs</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-green-100">Log Id</th>
                <th className="border p-2 text-left bg-green-100">Timestamp</th>
                <th className="border p-2 text-left bg-green-100">Action</th>
                <th className="border p-2 text-left bg-green-100">Box No</th>
                <th className="border p-2 text-left bg-green-100">In Use?</th>
                <th className="border p-2 text-left bg-green-100">Committed By</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-green-50">
                  <td className="border p-2">{log.id}</td>
                  <td className="border p-2">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="border p-2">{log.action || "N/A"}</td>
                  <td className="border p-2">{log.number || "N/A"}</td>
                  <td className="border p-2">{log.in_use ? "Yes" : "No"}</td>

                  <td className="border p-2">
                    {/* Ensure you are accessing the name or any desired field in the committed_by object */}
                    {log.committed_by ? (
                      <pre className="bg-gray-100 p-2">
                        {log.committed_by.name || "Unknown"}
                      </pre>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BoxLogs;
