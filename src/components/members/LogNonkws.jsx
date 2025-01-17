"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; 
import axios from "axios";

const LogNonkws = () => {
  const searchParams = useSearchParams(); 
  const id = searchParams.get("id"); 

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Update the URL structure to match the backend endpoint
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/nonkws/logs/${id}`);
        setLogs(response.data.logs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchLogs();
    }
  }, [id]); // Re-fetch logs when the ID changes

  if (loading) {
    return <div>Loading logs...</div>;
  }

  if (!logs.length) {
    return <div>No logs found for this user.</div>;
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-semibold font-syne mb-6 text-center text-green-800">
        View Logs for Non-KWS Member
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-green-600">Logs</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-green-100">Log Id</th>
                <th className="border p-2 text-left bg-green-100">Timestamp</th>
                <th className="border p-2 text-left bg-green-100">First Name</th>
                <th className="border p-2 text-left bg-green-100">Last Name</th>
                <th className="border p-2 text-left bg-green-100">Email</th>
                <th className="border p-2 text-left bg-green-100">Blood Group</th>
                <th className="border p-2 text-left bg-green-100">Education</th>
                <th className="border p-2 text-left bg-green-100">Profession</th>
                <th className="border p-2 text-left bg-green-100">Changes</th>
                <th className="border p-2 text-left bg-green-100">Committed by</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-green-50">
                  <td className="border p-2">{log.id}</td>
                  <td className="border p-2">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="border p-2">{log.first_name || "N/A"}</td>
                  <td className="border p-2">{log.last_name || "N/A"}</td>
                  <td className="border p-2">{log.email || "N/A"}</td>
                  <td className="border p-2">{log.blood_group || "N/A"}</td>
                  <td className="border p-2">{log.education_qualification || "N/A"}</td>
                  <td className="border p-2">{log.profession || "N/A"}</td>
                  <td className="border p-2">{log.action || "N/A"}</td>
                  <td className="border p-2">
                    <pre className="bg-gray-100 p-2">{log.committed_by_kws_id}</pre>
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

export default LogNonkws;
