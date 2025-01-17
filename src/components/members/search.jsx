"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineSearch,
  AiOutlinePrinter,
  AiOutlineReload,
  AiOutlineEllipsis,
} from "react-icons/ai";
import axios from "axios";
import { CSVLink } from "react-csv";
import { useRouter } from "next/navigation";

const Search = () => {
  const router = useRouter();
  const handleEdit = (userId) => {
    router.push(`/members/edit-member?id=${userId}`);
  };

  const handleView = (userId) => {
    router.push(`/members/view-member?id=${userId}`);
  };





  // State for user roles
  const [staffRoles, setStaffRoles] = useState(null);

  // State for handling filters
  const [filters, setFilters] = useState({
    kwsId: "",
    lookUp: "",
    zone: "all",
    membershipType: "all",
    membershipStatus: "all",
  });

  // State for member list and filtered results
  const [list, setList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Items per page

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for active dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch user roles from localStorage
  useEffect(() => {
    const roles = localStorage.getItem("staffRoles");
    if (roles) {
      setStaffRoles(JSON.parse(roles));
    }
  }, []);

  // Fetch members data
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/member/getmembers`
      );

      if (response.data && response.data.members) {
        setList(response.data.members); // Full member list
        setFilteredResults(response.data.members); // Initially set filtered results
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(); // Fetch all members on initial load
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search functionality
  const handleSearch = () => {
    const results = list.filter((member) => {
      const matchesKwsId = filters.kwsId
        ? member.kwsid?.toLowerCase().includes(filters.kwsId.toLowerCase())
        : true;
      const matchesLookUp = filters.lookUp
        ? member.name?.toLowerCase().includes(filters.lookUp.toLowerCase()) ||
          member.contact?.includes(filters.lookUp)
        : true;
      const matchesZone =
        filters.zone === "all" ||
        member.zone?.toLowerCase() === filters.zone.toLowerCase();
      const matchesType =
        filters.membershipType === "all" ||
        member.typeOfMember?.toLowerCase() ===
          filters.membershipType.toLowerCase();

      return matchesKwsId && matchesLookUp && matchesZone && matchesType;
    });

    setFilteredResults(results);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle refresh functionality
  const handleRefresh = () => {
    setFilters({
      kwsId: "",
      lookUp: "",
      zone: "all",
      membershipType: "all",
      membershipStatus: "all",
    });
    setFilteredResults(list); // Reset to the full list
    setCurrentPage(1); // Reset to the first page
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Define zone roles
  const zoneRoles = [
    "fahaheel",
    "salmiya",
    "jleeb",
    "farwaniya",
    "hawally",
  ];

  // Check if user has 'All' role
  const hasAllRole = staffRoles?.All === true;

  // Check if user has any zone roles
  const hasAnyZoneRole = zoneRoles.some((zone) => staffRoles?.[zone]);

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Search Members
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-bold">KWS ID</label>
          <input
            type="text"
            name="kwsId"
            value={filters.kwsId}
            onChange={handleFilterChange}
            placeholder="Enter KWS ID"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">Look Up</label>
          <input
            type="text"
            name="lookUp"
            value={filters.lookUp}
            onChange={handleFilterChange}
            placeholder="Enter Name or Contact"
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-bold">Zone</label>
          <select
            name="zone"
            value={filters.zone}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="fahaheel">Fahaheel</option>
            <option value="salmiya">Salmiya</option>
            <option value="jleeb">Jleeb</option>
            <option value="farwaniya">Farwaniya</option>
            <option value="hawally">Hawally</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold">Membership Type</label>
          <select
            name="membershipType"
            value={filters.membershipType}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          >
            <option value="all">All</option>
            <option value="privilege member">PRIVILEGE MEMBER</option>
            <option value="advisor">ADVISOR</option>
            <option value="cc member">CC MEMBER</option>
            <option value="donors">DONORS</option>
            <option value="ec member">EC MEMBER</option>
            <option value="elite member">ELITE MEMBER</option>
            <option value="ex officio president">EX OFFICIO PRESIDENT</option>
            <option value="general secretary">GENERAL SECRETARY</option>
            <option value="joint general secretary">JOINT GENERAL SECRETARY</option>
            <option value="joint treasurer">JOINT TREASURER</option>
            <option value="ladies ec member"> LADIES EC MEMBER</option>
            <option value="patron">PATRON</option>
            <option value="president">PRESIDENT</option>
            <option value="treasurer">TREASURER</option>
            <option value="vendors">VENDORS</option>
            <option value="vice president">VICE PRESIDENT</option>
            <option value="vc member">VC MEMBER</option>
            <option value="president">PRESIDENT</option>
            <option value="ladies cc member">LADIES CC MEMBER</option>
            <option value="ladies vc member">LADIES VC MEMBER</option>
            <option value="ladies elite member">LADIES ELITE MEMBER</option>
            <option value="ladies privilege member">LADIES PRIVILEGE MEMBER</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <AiOutlineSearch size={20} /> <span>Search</span>
        </button>
        <CSVLink
          data={filteredResults}
          headers={[
            { label: "KWS ID", key: "kwsid" },
            { label: "Civil ID", key: "civil_id" },
            { label: "Name", key: "name" },
            { label: "Zone", key: "zone" },
            { label: "Contact", key: "contact" },
            { label: "Type of Member", key: "typeOfMember" },
          ]}
          filename={"members.csv"}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <AiOutlinePrinter size={20} /> <span>Export CSV</span>
        </CSVLink>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          <AiOutlineReload size={20} /> <span>Refresh</span>
        </button>
      </div>

      {/* List Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">KWS ID</th>
                  <th className="border px-4 py-2">Civil ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Zone</th>
                  <th className="border px-4 py-2">Contact</th>
                  <th className="border px-4 py-2">Type of Member</th>
                  <th className="border px-4 py-2">Options</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => {
                  const memberZone = item.zone?.toLowerCase();
                  const isZoneMember = zoneRoles.includes(memberZone);

                  return (
                    <tr key={index} className="text-center">
                      <td className="border px-4 py-2">{item.kwsid}</td>
                      <td className="border px-4 py-2">{item.civil_id}</td>
                      <td className="border px-4 py-2">{item.name}</td>
                      <td className="border px-4 py-2">{item.zone}</td>
                      <td className="border px-4 py-2">{item.contact}</td>
                      <td className="border px-4 py-2">{item.typeOfMember}</td>
                      <td className="border px-4 py-2 relative">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <AiOutlineEllipsis size={20} />
                        </button>
                        {activeDropdown === index && (
                          <div className="absolute bg-white border shadow-md right-0 mt-2 z-10 w-48">
                            {/* Always show View button */}
                            <button
                              className="block px-4 py-2 text-green-500 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleView(item.user_id)}
                            >
                              View
                            </button>

                            {/* Conditionally render other buttons */}
                            {(hasAllRole || !isZoneMember) && (
                              <>
                                <button
                                  className="block px-4 py-2 text-blue-500 hover:bg-gray-100 w-full text-left"
                                  onClick={() => handleEdit(item.user_id)}
                                >
                                  Edit
                                </button>
                                {/* <button className="block px-4 py-2 text-yellow-500 hover:bg-gray-100 w-full text-left">
                                  Add Transaction
                                </button>
                                <button className="block px-4 py-2 text-red-500 hover:bg-gray-100 w-full text-left">
                                  View All Transactions
                                </button> */}
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(1)}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 hover:bg-blue-500 hover:text-white"
                }`}
              >
                1
              </button>
              {totalPages > 1 && (
                <button
                  onClick={() => handlePageChange(2)}
                  className={`px-4 py-2 rounded ${
                    currentPage === 2
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  2
                </button>
              )}
              {totalPages > 2 && (
                <>
                  <span className="px-4 py-2">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-4 py-2 rounded ${
                      currentPage === totalPages
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
