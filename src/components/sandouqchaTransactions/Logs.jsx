"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const Logs = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");  // Fetch 'transaction_id' from URL params
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs based on the transaction ID
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/sandouqchaTransaction/log/${id}` // Ensure this matches the backend route
        );
        setLogs(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching box logs:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchLogs();
    }
  }, [id]); // Re-fetch logs whenever 'id' changes

  // Show loading message while fetching logs
  if (loading) {
    return <div>Loading logs...</div>;
  }

  // Show message if no logs are found
  if (!logs.length) {
    return <div>No logs found for this transaction ID.</div>;
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-semibold font-syne mb-6 text-center text-green-800">
        View Logs for Transaction ID {id}
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 text-green-600">Logs</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left bg-green-100">ID</th>
              
                <th className="border p-2 text-left bg-green-100">Action</th>
                <th className="border p-2 text-left bg-green-100">Transaction ID</th>
                <th className="border p-2 text-left bg-green-100">Date</th>
                <th className="border p-2 text-left bg-green-100">Note(20s)</th>
                <th className="border p-2 text-left bg-green-100">Note(10s)</th>
                <th className="border p-2 text-left bg-green-100">Note(5s)</th>
                <th className="border p-2 text-left bg-green-100">Note(1s)</th>
                <th className="border p-2 text-left bg-green-100">Note(0.5s)</th>
                <th className="border p-2 text-left bg-green-100">Note(0.25s)</th>
                <th className="border p-2 text-left bg-green-100">Coin(100s)</th>
                <th className="border p-2 text-left bg-green-100">Coin(50s)</th>
                <th className="border p-2 text-left bg-green-100">Coin(20s)</th>
                <th className="border p-2 text-left bg-green-100">Coin(10s)</th>
                <th className="border p-2 text-left bg-green-100">Coin(5s)</th>
                
                
                <th className="border p-2 text-left bg-green-100">Committed</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-green-50">
                  <td className="border p-2">{log.id}</td>
                 
                  <td className="border p-2">{log.action || "N/A"}</td>
                  <td className="border p-2">{log.transaction_id}</td>
                  <td className="border p-2">{log.date || "N/A"}</td>
                  <td className="border p-2">{log.note_20}</td>
                  <td className="border p-2">{log.note_10}</td>
                  <td className="border p-2">{log.note_5}</td>
                  <td className="border p-2">{log.note_1}</td>
                  <td className="border p-2">{log.note_0_5}</td>
                  <td className="border p-2">{log.note_0_25}</td>
                  <td className="border p-2">{log.coin_100}</td>
                  <td className="border p-2">{log.coin_50}</td>
                  <td className="border p-2">{log.coin_20}</td>
                  <td className="border p-2">{log.coin_10}</td>
                  <td className="border p-2">{log.coin_5}</td>
                
               
                  <td className="border p-2">{log.committed_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
