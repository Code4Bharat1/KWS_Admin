"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSearch, FaSyncAlt, FaPlus, FaEllipsisV } from "react-icons/fa";

const Tickets = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);  // State to store the event ID
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [showAddForm, setShowAddForm] = useState(false); // State to control showing the add form
  const [newTicket, setNewTicket] = useState({
    name: "",
    phone: "",
    civil_id: "",
    ticket_no: "",
    amount_in_kwd: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(null); // State for dropdown toggle

  useEffect(() => {
    // Get the event id from the query string after the component mounts
    const idFromUrl = new URLSearchParams(window.location.search).get("id");

    if (!idFromUrl) {
      // Redirect to homepage or any fallback page if no ID is present
      router.push("/event-management");
    } else {
      // console.log("Event ID:", idFromUrl); // Log the event ID for debugging
      setId(idFromUrl); // Set the ID if present
    }
  }, [router]);

  useEffect(() => {
    if (!id) return; // Only fetch tickets when the id is available

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:5786/api/event/tickets/${id}`);
        // console.log("Fetched tickets:", response.data); // Log fetched tickets for debugging
        setTickets(response.data); // Set the fetched tickets to state
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to fetch tickets.");
      }
    };

    fetchTickets(); // Fetch tickets if ID exists
  }, [id]);

  const handleSearch = () => {
    if (!searchQuery) return;

    const filteredTickets = tickets.filter((ticket) =>
      ticket.ticketNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTickets(filteredTickets);
  };

  const handleRefresh = () => {
    setSearchQuery(""); // Clear the search query
    // Refetch tickets after resetting the query
    if (id) {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(`http://localhost:5786/api/event/tickets/${id}`);
          setTickets(response.data);
        } catch (err) {
          console.error("Error fetching tickets:", err);
          setError("Failed to fetch tickets.");
        }
      };

      fetchTickets();
    }
  };

  const handleAddTicket = () => {
    setShowAddForm(true); // Show the add ticket form
  };

  const handleCancelAdd = () => {
    setShowAddForm(false); // Close the form without adding a ticket
    setNewTicket({
      name: "",
      phone: "",
      civil_id: "",
      ticket_no: "",
      amount_in_kwd: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newTicket.name || !newTicket.phone || !newTicket.civil_id || !newTicket.ticket_no || !newTicket.amount_in_kwd) {
      alert("All fields are required.");
      return;
    }

    // Check if ticket number already exists
    const ticketExists = tickets.some(ticket => ticket.ticketNo === newTicket.ticket_no);
    if (ticketExists) {
      alert("This ticket number already exists.");
      return;
    }

    // console.log("Submitting new ticket:", newTicket);  // Log the data being sent

    try {
      // Make the POST request to the backend with the event ID
      const response = await axios.post(`http://localhost:5786/api/event/addticket/${id}`, newTicket);
      setTickets((prev) => [...prev, response.data]);
      setShowAddForm(false); // Hide the form after submission
      setNewTicket({
        name: "",
        phone: "",
        civil_id: "",
        ticket_no: "",
        amount_in_kwd: "",
      });
    } catch (err) {
      console.error("Error adding ticket:", err);
      alert("Failed to add ticket.");
    }
    window.location.reload(); // Consider removing this for better UX
  };

  const toggleDropdown = (ticketId) => {
    setDropdownOpen(prev => prev === ticketId ? null : ticketId);
  };

  const handleView = (ticketNo, eventId) => {
    // console.log("Navigating to view ticket:", ticketNo, eventId); // Log for debugging
    if (!ticketNo || !eventId) {
      console.error("Ticket number or Event ID is missing.");
      return;
    }
    router.push(`/event-management/tickets/view-ticket?id=${ticketNo}&event_id=${eventId}`);
  };

  const handleEdit = (ticketNo, eventId) => {
    if (!ticketNo || !eventId) {
      console.error("Ticket number or Event ID is missing.");
      return;
    }
    router.push(`/event-management/tickets/edit-ticket?id=${ticketNo}&event_id=${eventId}`);
  };

  const handleDelete = async (ticketNo, event_id) => {
    // console.log("Deleting ticket with ticketNo:", ticketNo, "and event_id:", event_id); // Log values

    if (!ticketNo || !event_id) {
      console.error("Ticket number or Event ID missing");
      alert("Ticket number or Event ID missing.");
      return;
    }

    try {
      // Sending the DELETE request with both ticketNo and event_id
      const response = await axios.delete(`http://localhost:5786/api/event/deleteticket/${ticketNo}`, {
        data: { event_id },  // Send event_id in the request body
      });

      // console.log("Ticket deleted:", response.data);  // Log success response

      // Remove the deleted ticket from the state
      setTickets(tickets.filter(ticket => ticket.ticketNo !== ticketNo)); // Use ticketNo to filter

      alert("Ticket deleted successfully.");
    } catch (err) {
      console.error("Error deleting ticket:", err);
      alert("Failed to delete ticket.");
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h1 className="mt-4 text-center text-4xl md:text-5xl text-[#355F2E] font-bold font-syne">Tickets</h1>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between mt-6 mb-6">
        {/* Search input */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
            placeholder="Search by Ticket No"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaSearch />
            <span>Search</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center space-x-4 md:space-x-0 md:space-y-0 space-y-4">
          <button
            onClick={handleRefresh}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <FaSyncAlt />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleAddTicket}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Ticket</span>
          </button>
        </div>
      </div>

      {/* Add Ticket Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-300 rounded-lg max-w-sm mx-auto">
          <h2 className="text-lg font-bold mb-4">Create Ticket</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Full Name*</label>
              <input
                type="text"
                value={newTicket.name}
                onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Phone No.*</label>
              <input
                type="text"
                value={newTicket.phone}
                onChange={(e) => setNewTicket({ ...newTicket, phone: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Phone No."
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Civil ID*</label>
              <input
                type="text"
                value={newTicket.civil_id}
                onChange={(e) => setNewTicket({ ...newTicket, civil_id: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Civil ID"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Ticket ID*</label>
              <input
                type="text"
                value={newTicket.ticket_no}
                onChange={(e) => setNewTicket({ ...newTicket, ticket_no: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Ticket ID"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Amount (KWD)*</label>
              <input
                type="number"
                value={newTicket.amount_in_kwd}
                onChange={(e) => setNewTicket({ ...newTicket, amount_in_kwd: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Amount in KWD"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Ticket
              </button>
              <button
                type="button"
                onClick={handleCancelAdd}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-6 border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ticket No</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Time Sold</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Options</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketNo}>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{ticket.ticketNo}</td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{ticket.timeSold}</td>
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(ticket.ticketNo)}
                      className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <FaEllipsisV />
                    </button>
                    {dropdownOpen === ticket.ticketNo && (
                      <div className="absolute right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 z-10">
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => handleView(ticket.ticketNo, id)} // Pass ticketNo and id
                        >
                          View
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => handleEdit(ticket.ticketNo, id)}  // Use ticket.ticketNo
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={() => {
                            // Ensure that ticketNo and id are being passed correctly
                            if (ticket.ticketNo && id) {
                              handleDelete(ticket.ticketNo, id);
                            } else {
                              console.error("Ticket number or Event ID missing");
                            }
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
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

export default Tickets;
