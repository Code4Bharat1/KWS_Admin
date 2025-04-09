"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function WinnerTable({ raffleId }) {
  const [winners, setWinners] = useState([]);

  // Fetch winners
  useEffect(() => {
    if (!raffleId || isNaN(Number(raffleId))) return;

    const fetchSpinnAttendance = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/winners/${raffleId}`
        );

        // Ensure proper data access
        const data = response?.data?.winners || response?.data;

        if (Array.isArray(data)) {
          setWinners(data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching winners:", error?.message || error);
      }
    };

    fetchSpinnAttendance();
  }, [raffleId]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md">
            🎊
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Winners
            </span>
            🎊
          </h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Prize Won
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      KWS ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {winners?.map((w, i) => (
                    <tr key={i}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {w.name || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {w.prize || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {w.kwsid || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {winners.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No winners found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
