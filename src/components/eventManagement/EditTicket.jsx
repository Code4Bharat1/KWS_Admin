"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const EditTicket = () => {
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    civil_id: "",
    ticket_no: "",
    amount_in_kwd: "",
  });

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ticketNo = query.get("id"); // Assuming ticketNo is passed as 'id'
    const eventId = query.get("event_id"); // Assuming event_id is passed as 'event_id'

    if (!ticketNo || !eventId) {
      setError("Ticket number or Event ID is missing.");
      return;
    }

    const fetchTicket = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/event/ticket/${ticketNo}`, {
          params: { event_id: eventId },
        });
        setTicket(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to fetch ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = new URLSearchParams(window.location.search);
    const ticketNo = query.get("id");
    const eventId = query.get("event_id");

    if (!ticketNo || !eventId) {
      setError("Ticket number or Event ID is missing.");
      return;
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/event/editticket/${ticketNo}`, {
        ...formData,
        event_id: eventId,
      });

      alert("Ticket updated successfully.");
      router.back();
    } catch (err) {
      console.error("Error updating ticket:", err);
      alert("Failed to update ticket.");
    }
  };

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

  if (loading || !ticket) {
    return (
      <div className="p-6 font-sans bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h1 className="mt-4 text-center text-4xl md:text-5xl text-[#355F2E] font-bold font-syne">Edit Ticket</h1>
      <div className="mt-6 max-w-md mx-auto p-4 border border-gray-300 rounded-lg bg-white shadow">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Phone No.*</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Phone No."
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Civil ID*</label>
              <input
                type="text"
                name="civil_id"
                value={formData.civil_id}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Civil ID"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Ticket ID*</label>
              <input
                type="text"
                name="ticket_no"
                value={formData.ticket_no}
                onChange={handleChange}
                disabled
                className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Amount (KWD)*</label>
              <input
                type="number"
                name="amount_in_kwd"
                value={formData.amount_in_kwd}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Amount in KWD"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicket;
