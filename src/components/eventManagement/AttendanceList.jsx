"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AttendanceList = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredAttendanceList, setFilteredAttendanceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const event_id = searchParams.get("event_id");

    if (event_id) {
      setEventId(event_id);
    } else {
      console.error("Event ID is not provided!");
    }
  }, []);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    const fetchAttendanceList = async () => {
      try {
        // console.log(`Fetching data for event_id=${eventId}`);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/event/attendancelist/${eventId}`
        );

        // console.log("Fetched Attendance Data:", response.data);
        setAttendanceList(response.data);
        setFilteredAttendanceList(response.data); // Set filtered list initially
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to fetch attendance data.");
      }
    };

    fetchAttendanceList();
  }, [eventId]);

  // Handle Search
  const handleSearch = () => {
    const filtered = attendanceList.filter((attendance) =>
      `${attendance.firstname} ${attendance.lastname} ${attendance.ticketNo}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredAttendanceList(filtered);
  };

  // Handle Refresh
  const handleRefresh = () => {
    setSearchQuery("");
    setFilteredAttendanceList(attendanceList); // Reset to full list
  };

  // Convert the data to CSV format and trigger a download
  const exportToCSV = () => {
    const header = ['Ticket No', 'Contact', 'Time Attended', 'No. People'];
    const rows = filteredAttendanceList.map(attendance => [
      `${attendance.firstname} ${attendance.lastname} - ${attendance.ticketNo}`,
      attendance.contact,
      attendance.timeAttended,
      attendance.numPeople
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += header.join(",") + "\n"; // Add header
    rows.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    // Create a link element to trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_list.csv");
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="p-6 font-sans bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h2 className="mt-4 text-center text-3xl text-[#355F2E] font-bold font-syne">
        Attendance List
      </h2>

      {/* Search and Refresh Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
        <input
          type="text"
          placeholder="Search by name or ticket no"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Export to CSV Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={exportToCSV}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Export to CSV
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ticket No</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Time Attended</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">No. People</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendanceList.length > 0 ? (
              filteredAttendanceList.map((attendance, index) => (
                <tr key={`${attendance.ticketNo}-${index}`} className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {attendance.firstname} {attendance.lastname} - {attendance.ticketNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {attendance.contact}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {attendance.timeAttended}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {attendance.numPeople}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-sm text-gray-700 text-center">
                  No attendance data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
