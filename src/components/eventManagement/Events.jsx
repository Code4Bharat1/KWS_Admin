"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaSyncAlt, FaPlus, FaEllipsisV } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";

const Events = () => {
  const router = useRouter();

  // State for user roles
  const [staffRoles, setStaffRoles] = useState(null);

  // State for handling filters
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  // State for events list and loading
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for form visibility and new event data
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  // State for active dropdown
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Fetch staff roles from localStorage on component mount
  useEffect(() => {
    const roles = localStorage.getItem("staffRoles");
    if (roles) {
      try {
        const parsedRoles = JSON.parse(roles);
        // console.log("Fetched Staff Roles:", parsedRoles);
        setStaffRoles(parsedRoles);
      } catch (err) {
        console.warn("Invalid staffRoles format in localStorage:", roles);
        setStaffRoles({});
      }
    } else {
      console.warn("No staffRoles found in localStorage.");
      setStaffRoles({});
    }
  }, []);

  // Determine if the user has any specific zone roles
  const hasAnyZone = staffRoles
    ? Object.keys(staffRoles).some(
        (role) => role !== "All" && staffRoles[role] === true
      )
    : false;

  // Determine if Options and Add button should be shown
  const shouldShowOptions = !hasAnyZone;

  // Fetch events from the backend
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5786/api/event/get");
      // console.log("Fetched Events:", response.data);
      
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setEvents(response.data);
        setFilteredEvents(response.data);
      } else {
        console.warn("Unexpected response format:", response.data);
        setEvents([]);
        setFilteredEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      alert("Failed to fetch events.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when component mounts or staffRoles changes
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffRoles]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search functionality
  const handleSearch = () => {
    const filtered = events.filter((event) => {
      const matchesName = event.name
        .toLowerCase()
        .includes(searchQuery.name.toLowerCase());
      const matchesStart =
        !searchQuery.start_date ||
        new Date(event.start_date) >= new Date(searchQuery.start_date);
      const matchesEnd =
        !searchQuery.end_date ||
        new Date(event.end_date) <= new Date(searchQuery.end_date);
      return matchesName && matchesStart && matchesEnd;
    });
    setFilteredEvents(filtered);
  };

  // Handle refresh functionality
  const handlerefresh = () => {
    setSearchQuery({ name: "", start_date: "", end_date: "" });
    setFilteredEvents(events);
  };

  // Handle dropdown toggle for options
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  };

  // Handle adding a new event
  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.start_date || !newEvent.end_date) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5786/api/event/add",
        newEvent
      );
      // console.log("Added Event:", response.data);
      setEvents((prev) => [...prev, response.data]);
      setFilteredEvents((prev) => [...prev, response.data]); // Update filtered events
      setShowAddForm(false);
      setNewEvent({ name: "", start_date: "", end_date: "" });
      alert("Event added successfully!");
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add event.");
    }
  };

  // Handle canceling the add form
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewEvent({ name: "", start_date: "", end_date: "" });
  };

  // Handle deleting an event
  const handleDelete = async (eventId) => {
    if (!eventId) {
      console.error("Event ID is missing");
      alert("Event ID is missing.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5786/api/event/delete/${eventId}`
      );
      // console.log("Event deleted:", response.data); // Log success response

      // Remove the deleted event from the state
      setEvents(events.filter((event) => event.id !== eventId));
      setFilteredEvents(filteredEvents.filter((event) => event.id !== eventId));

      alert("Event deleted successfully.");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  // Handle updating an event
  const handleUpdate = (id) => {
    router.push(`/event-management/update-event?id=${id}`);
  };

  // Handle tickets
  const handleTicket = (id) => {
    router.push(`/event-management/tickets?id=${id}`);
  };

  // Handle attendance list
  const handleAttendance = (event_id) => {
    router.push(`/event-management/attendance-list?event_id=${event_id}`);
  };

  // Handle scan attendance
  const handleScan = (event_id) => {
    router.push(`/event-management/scan-attendance?event_id=${event_id}`);
  };

  return (
    <div className="p-6 font-sans bg-gray-50">
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
            name="name" // Added name attribute
            type="text"
            placeholder="Event Name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery.name}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="startTime" className="text-sm font-medium text-gray-600 mb-1">
            Start Time
          </label>
          <input
            id="startTime"
            name="start_date" // Added name attribute
            type="datetime-local"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery.start_date}
            onChange={handleFilterChange}
          />
        </div>

        <div className="flex flex-col w-full md:w-auto">
          <label htmlFor="endTime" className="text-sm font-medium text-gray-600 mb-1">
            End Time
          </label>
          <input
            id="endTime"
            name="end_date" // Added name attribute
            type="datetime-local"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchQuery.end_date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        {/* Always Visible Buttons */}
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaSearch className="h-5 w-5" /> Search
        </button>
        <button
          onClick={handlerefresh}
          className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <FaSyncAlt className="h-5 w-5" /> Refresh
        </button>

        {/* Conditionally Visible "Add" Button */}
        {shouldShowOptions && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaPlus className="h-5 w-5" /> Add
          </button>
        )}
      </div>

      {/* Add Event Form */}
      {showAddForm && shouldShowOptions && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg max-w-sm mx-auto">
          <h2 className="text-lg font-bold mb-4">Add New Event</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="newEventName" className="text-sm font-medium text-gray-600 mb-1">
                Event Name
              </label>
              <input
                id="newEventName"
                name="name" // Optional: Add name for consistency
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
                name="start_date" // Optional: Add name for consistency
                type="datetime-local"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={newEvent.start_date}
                onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newEndTime" className="text-sm font-medium text-gray-600 mb-1">
                End Time
              </label>
              <input
                id="newEndTime"
                name="end_date" // Optional: Add name for consistency
                type="datetime-local"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={newEvent.end_date}
                onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
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

      {/* Loading Spinner */}
      {isLoading && <div className="text-center text-blue-500">Loading...</div>}

      {/* Events List */}
      <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Event Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Start Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">End Time</th>
              {/* Conditionally Render "Options" Column Header */}
              {shouldShowOptions && (
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Options</th>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id} className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{event.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{event.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {new Date(event.start_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {new Date(event.end_date).toLocaleString()}
                  </td>
                  {/* Conditionally Render "Options" Column */}
                  {shouldShowOptions && (
                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-block">
                        <button
                          onClick={() => toggleDropdown(event.id)}
                          className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                        >
                          <FaEllipsisV />
                        </button>
                        {dropdownOpen === event.id && (
                          <div
                            className="absolute right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              onClick={() => handleUpdate(event.id)}
                            >
                              Update
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              onClick={() => handleTicket(event.id)}
                            >
                              Tickets
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              onClick={() => handleScan(event.id)}
                            >
                              Scan Attendance
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              onClick={() => handleAttendance(event.id)}
                            >
                              Attendance List
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                              Statistics
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                              Logs
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                              onClick={() => handleDelete(event.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className={`px-6 py-4 text-sm text-gray-700 whitespace-nowrap ${
                    shouldShowOptions ? "col-span-5" : "col-span-4"
                  } text-center`}
                >
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
