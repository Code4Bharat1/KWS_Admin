"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const ViewTicket = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  // Extract ticketNo and event_id from URL
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ticketNo = query.get("id"); // Assuming ticketNo is passed as 'id'
    const eventId = query.get("event_id"); // Assuming event_id is passed as 'event_id'

    if (!ticketNo || !eventId) {
      setError("Ticket number or Event ID is missing.");
      return;
    }

    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:5786/api/event/ticket/${ticketNo}`, {
          params: { event_id: eventId },
        });
        setTicket(response.data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to fetch ticket.");
      }
    };

    fetchTicket();
  }, []);

  if (error) {
    return (
      <div className="p-6 font-sans bg-gray-50">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6 font-sans bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h1 className="mt-4 text-center text-4xl md:text-5xl text-[#355F2E] font-bold font-syne">View Ticket</h1>
      <div className="mt-6 max-w-md mx-auto p-4 border border-gray-300 rounded-lg bg-white shadow">
        <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
        <p><strong>Ticket No:</strong> {ticket.ticketNo}</p>
        <p><strong>Name:</strong> {ticket.name}</p>
        <p><strong>Phone:</strong> {ticket.phone}</p>
        <p><strong>Civil ID:</strong> {ticket.civil_id}</p>
        <p><strong>Amount (KWD):</strong> {ticket.amount_in_kwd}</p>
        <p><strong>Time Sold:</strong> {ticket.timeSold}</p>
        {/* Add more details as needed */}
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default ViewTicket;
