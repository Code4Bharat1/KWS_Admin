"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Importing useSearchParams to get query params
import axios from "axios";

const UpdateEvent = () => {
  const searchParams = useSearchParams(); // Getting search params from the URL
  const id = searchParams.get("id"); // Get the event id from the query parameter

  const [event, setEvent] = useState(null); // To store the fetched event
  const [newEvent, setNewEvent] = useState({
    name: "",
    start_date: "", // Ensure initial state is set
    end_date: "",   // Ensure initial state is set
  });

  const [error, setError] = useState(null);

  // Fetch event data when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return; // If there's no event id in the URL, do nothing

      try {
        const response = await axios.get(`http://localhost:5786/api/event/get?id=${id}`);
        setEvent(response.data); // Set the event details from the API response
        setNewEvent({
          name: response.data.name,
          start_date: response.data.start_date ? new Date(response.data.start_date).toISOString().substring(0, 16) : "",
          end_date: response.data.end_date ? new Date(response.data.end_date).toISOString().substring(0, 16) : "",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to fetch event details.");
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newEvent.name || !newEvent.start_date || !newEvent.end_date) {
      alert("All fields are required.");
      return;
    }

    try {
      // Sending the PUT request to the backend to update the event
      const response = await axios.put(`http://localhost:5786/api/event/edit/${id}`, {
        id, 
        name: newEvent.name,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date,
      });

      alert("Event updated successfully!");
      // Optionally redirect or update UI to reflect the changes
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event.");
    }
  };

  if (!event) return <div>Loading event details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h1 className="mt-4 text-center text-4xl md:text-5xl text-[#355F2E] font-bold font-syne">Edit Event</h1>
      {/* Edit Event Form */}
      <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Event Name</label>
          <input
            type="text"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Event Name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="datetime-local"
            value={newEvent.start_date || ""}  // Ensure value is never undefined
            onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">End Date</label>
          <input
            type="datetime-local"
            value={newEvent.end_date || ""}  // Ensure value is never undefined
            onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
