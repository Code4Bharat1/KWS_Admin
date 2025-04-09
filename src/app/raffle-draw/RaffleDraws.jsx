"use client";

import { useState, useEffect, useCallback } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

import ButtonSection from "../../components/raffleDraw/buttonSection";

const RaffleDraws = () => {
  const router = useRouter();

  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [draws, setDraws] = useState([]);
  const [filteredDraws, setFilteredDraws] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [newRaffle, setNewRaffle] = useState({
    name: "",
    start_time: "",
    end_time: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchDraws = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/`
      );
      setDraws(response.data);
      setFilteredDraws(response.data);
    } catch (err) {
      console.error("Error fetching Raffle Draws:", err);
      alert("Failed to fetch Raffle Draws.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]);

  // const handleAddRaffle = useCallback(async () => {
  //   if (Object.values(newRaffle).some((field) => !field)) {
  //     alert("All fields are required.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/add`,
  //       newRaffle
  //     );
  //     setDraws((prev) => [...prev, response.data]);
  //     setFilteredDraws((prev) => [...prev, response.data]);
  //     setShowAddForm(false);
  //     setNewRaffle({ name: "", start_time: "", end_time: "" });
  //     alert("Raffle Draw added successfully!");
  //   } catch (err) {
  //     console.error("Error adding Raffle Draw:", err);
  //     alert("Failed to add Raffle Draw.");
  //   }
  // }, [newRaffle]);

  // const handleCancelAdd = useCallback(() => {
  //   setNewRaffle({ name: "", start_time: "", end_time: "" });
  //   setShowAddForm(false);
  // }, []);

  const handleSearch = useCallback(() => {
    const searchTerm = searchName.toLowerCase();
    const filtered = draws.filter((draw) =>
      draw.name.toLowerCase().includes(searchTerm)
    );
    setFilteredDraws(filtered);
  }, [searchName, draws]);

  const handlerefresh = useCallback(() => {
    setSearchName("");
    setFilteredDraws(draws);
  }, [draws]);

  // const handleScan = useCallback(
  //   (event_id) => {
  //     router.push(`/raffle-draw/scan-attendance?id=${event_id}`);
  //   },
  //   [router]
  // );

  // const handleAttendance = useCallback(
  //   (raffleId) => {
  //     router.push(`/raffle-draw/attendance-list?raffleId=${raffleId}`);
  //   },
  //   [router]
  // );

  // const handleTicket = useCallback(
  //   (id) => {
  //     router.push(`/raffle-draw/tickets?id=${id}`);
  //   },
  //   [router]
  // );

  // const handleDelete = async (raffleId) => {
  //   if (!raffleId) {
  //     console.error("Invalid raffle ID");
  //     return;
  //   }

  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this raffle draw? This action cannot be undone."
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     const response = await axios.delete(
  //       `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/delete/${raffleId}`
  //     );

  //     alert("Raffle draw deleted successfully!");
  //   } catch (error) {
  //     console.error(
  //       "Error deleting raffle draw:",
  //       error?.response?.data || error.message
  //     );
  //   }
  // };

  const toggleDropdown = useCallback((id) => {
    setDropdownOpen((prev) => (prev === id ? null : id));
  }, []);

  const raffleDetail = useCallback(
    (eventID) => {
      router.push(`/raffle-draw/${eventID}`);
    },
    [router]
  );

  const winnerPage = useCallback(
    (id) => {
      router.push(`/raffle-draw/winners?id=${id}`);
    },
    [router]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".dropdown-container")) {
        setDropdownOpen(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  return (
    <div className="p-6 font-sans bg-gray-50">
      <h1 className="mt-4 text-center text-4xl md:text-5xl text-[#355F2E] font-bold font-syne">
        Raffle Draws
      </h1>

      <div className="justify-center mt-12 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col w-full md:w-auto">
          <label
            htmlFor="rafflename"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Raffle Draw Name
          </label>
          <input
            id="rafflename"
            name="name"
            type="text"
            placeholder="Enter Raffle Draw Name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      <ButtonSection
        // setShowAddForm={setShowAddForm}
        handlerefresh={handlerefresh}
        handleSearch={handleSearch}
      />

      {/* {showAddForm && (
        <AddRaffleForm
          handleAddRaffle={handleAddRaffle}
          handleCancelAdd={handleCancelAdd}
          newRaffle={newRaffle}
          setNewRaffle={setNewRaffle}
        />
      )} */}

      {isLoading && <div className="text-center text-blue-500">Loading...</div>}

      <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                End Time
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                Options
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDraws.length > 0 ? (
              filteredDraws.map((draw, i) => (
                <tr key={draw.id} className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {draw.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {draw.start_date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {draw.end_date}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block dropdown-container">
                      <button
                        onClick={() => toggleDropdown(draw.id)}
                        className="px-4 py-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 flex items-center justify-center"
                        aria-label="Toggle dropdown"
                      >
                        <FaEllipsisV />
                      </button>
                      {dropdownOpen === draw.id && (
                        <div
                          className="absolute right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 z-50"
                          role="menu"
                        >
                          <button
                            onClick={() => raffleDetail(draw.id)}
                            className="w-full text-blue-500 font-semibold px-4 py-2 text-left text-md hover:bg-gray-100"
                            role="menuitem"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => winnerPage(draw.id)}
                            className="w-full text-pink-500 font-semibold px-4 py-2 text-left text-md hover:bg-gray-100"
                            role="menuitem"
                          >
                            Winners
                          </button>
                          {/* <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => handleTicket(draw.id)}
                            role="menuitem"
                          >
                            Tickets
                          </button> */}
                          {/* <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => handleScan(draw.id)}
                            role="menuitem"
                          >
                            Scan Attendance
                          </button>
                          <button
                            onClick={() => handleAttendance(draw.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            role="menuitem"
                          >
                            Attendance List
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            role="menuitem"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(draw.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
                            role="menuitem"
                          >
                            Delete
                          </button> */}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-sm text-gray-700 text-center"
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

export default RaffleDraws;
