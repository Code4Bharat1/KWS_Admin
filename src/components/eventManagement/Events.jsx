"use client";
import React, { useState } from "react";
import { FaSearch, FaSyncAlt, FaPlus, FaEllipsisV } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Tech Conference",
      startTime: "2024-12-21 10:00 AM",
      endTime: "2024-12-21 5:00 PM",
    },
    {
      id: 2,
      name: "Hackathon",
      startTime: "2024-12-22 9:00 AM",
      endTime: "2024-12-22 9:00 PM",
    },
  ]);

  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handlerefresh = () => {
    setSearchQuery({ name: "", startTime: "", endTime: "" });
    setFilteredEvents(events);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  const handleSearch = () => {
    const filtered = events.filter((event) => {
      const matchesName = event.name.toLowerCase().includes(searchQuery.name.toLowerCase());
      const matchesStart =
        !searchQuery.startTime || new Date(event.startTime) >= new Date(searchQuery.startTime);
      const matchesEnd =
        !searchQuery.endTime || new Date(event.endTime) <= new Date(searchQuery.endTime);
      return matchesName && matchesStart && matchesEnd;
    });
    setFilteredEvents(filtered);
  };

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) {
      alert("All fields are required.");
      return;
    }

    const updatedEvents = [
      ...events,
      {
        id: events.length + 1,
        ...newEvent,
      },
    ];

    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents); // Ensure the filtered list is updated too.
    setShowAddForm(false);
    setNewEvent({ name: "", startTime: "", endTime: "" });
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewEvent({ name: "", startTime: "", endTime: "" });
  };

  return (
    <div className="p-6 font-sans bg-gray-50">
      {/* Title */}
      <h1 className="mt-4 text-center text-4xl md:text-5xl text-[#355F2E] font-bold font-syne">
        KWS Events
      </h1>

      {/* Filters Section */}
      <div className="justify-center mt-12 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="eventName" className="text-sm font-medium text-gray-600 mb-1">
            Event Name
          </label>
          <input
            id="eventName"
            type="text"
            placeholder="Event Name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery.name}
            onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="startTime" className="text-sm font-medium text-gray-600 mb-1">
            Start Time
          </label>
          <input
            id="startTime"
            type="datetime-local"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery.startTime}
            onChange={(e) => setSearchQuery({ ...searchQuery, startTime: e.target.value })}
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="endTime" className="text-sm font-medium text-gray-600 mb-1">
            End Time
          </label>
          <input
            id="endTime"
            type="datetime-local"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery.endTime}
            onChange={(e) => setSearchQuery({ ...searchQuery, endTime: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaSearch className="h-5 w-5" />
          Search
        </button>
        <button
          onClick={handlerefresh}
          className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <FaSyncAlt className="h-5 w-5" />
          Refresh
        </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <FaPlus className="h-5 w-5" />
          Add
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg max-w-sm mx-auto">
          <h2 className="text-lg font-bold mb-4">Add New Event</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="newEventName" className="text-sm font-medium text-gray-600 mb-1">
                Event Name
              </label>
              <input
                id="newEventName"
                type="text"
                placeholder="Event Name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newStartTime" className="text-sm font-medium text-gray-600 mb-1">
                Start Time
              </label>
              <input
                id="newStartTime"
                type="datetime-local"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newEndTime" className="text-sm font-medium text-gray-600 mb-1">
                End Time
              </label>
              <input
                id="newEndTime"
                type="datetime-local"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddEvent}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Event
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Event Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Start Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">End Time</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{event.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{event.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{event.startTime}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{event.endTime}</td>
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(event.id)}
                      className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <FaEllipsisV />
                    </button>
                    {dropdownOpen === event.id && (
                      <div className="absolute right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 z-10">
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Update
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Tickets
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Scan Attendance
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Print Attendance
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Attendance List
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Statistics
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                          Logs
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
