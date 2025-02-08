  "use client";
  import React, { useState, useEffect, useRef } from "react";
  import {
    AiOutlineSearch,
    AiOutlinePrinter,
    AiOutlineReload,
    AiOutlineEllipsis,
    AiOutlineDown ,
  } from "react-icons/ai";
  import axios from "axios";
  import { CSVLink } from "react-csv";
  import { useRouter } from "next/navigation";

  const Search = () => {
    const router = useRouter();
    const dropdownRef = useRef(null);
    const handleEdit = (userId) => {
      router.push(`/members/edit-member?id=${userId}`);
    };

    const handleView = (userId) => {
      router.push(`/members/view-member?id=${userId}`);
    };

    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowDropdown(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);



    // State for user roles
    const [staffRoles, setStaffRoles] = useState(null);

    // State for handling filters
    const [filters, setFilters] = useState({
      kwsId: "",
      lookUp: "",
      zone: "all",
      membershipType: [],
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
    const [showDropdown, setShowDropdown] = useState(false);


    const handleMembershipChange = (type) => {
      setFilters((prev) => {
        const selectedTypes = prev.membershipType.includes(type)
          ? prev.membershipType.filter((t) => t !== type) 
          : [...prev.membershipType, type];
    
        return { ...prev, membershipType: selectedTypes };
      });
    };

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
          filters.membershipType.length === 0 ||
          member.typeOfMember?.split(",").some((memberType) =>
            filters.membershipType.includes(memberType.trim())
          );
          const matchesStatus =
          filters.membershipStatus === "all" ||
          (filters.membershipStatus === "active" && member.status?.toLowerCase() === "active") ||
          (filters.membershipStatus === "inactive" && member.status?.toLowerCase() === "inactive");
        
    
        return matchesKwsId && matchesLookUp && matchesZone && matchesType && matchesStatus;
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
        membershipType: [],
        membershipStatus: "all",
      });
      setFilteredResults(list); 
      setCurrentPage(1); 
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



    const membershipOptions = [
      "PRIVILEGE MEMBER", "ADVISOR", "CC MEMBER", "DONORS", "EC MEMBER", 
      "ELITE MEMBER", "LIFETIME MEMBER", "SENIOR VICE PRESIDENT", 
      "ASSISTANT GENERAL SECRETARY", "ASSISTANT TREASURER", "EX OFFICIO PRESIDENT", 
      "GENERAL SECRETARY", "JOINT GENERAL SECRETARY", "JOINT TREASURER", 
      "LADIES EC MEMBER", "PATRON", "PRESIDENT", "TREASURER", "VENDORS", 
      "VICE PRESIDENT", "VC MEMBER", "LADIES CC MEMBER", "LADIES VC MEMBER", 
      "LADIES ELITE MEMBER", "LADIES PRIVILEGE MEMBER"
    ];

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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



        

          <div className="relative" ref={dropdownRef}>
            <label className="block mb-2 font-bold">Membership Type</label>
            <div 
    className="border p-2 rounded w-full cursor-pointer bg-white flex justify-between items-center" 
    onClick={(e) => {
      e.stopPropagation(); 
      setShowDropdown(!showDropdown);
    }}
  >
   <span>
  {filters.membershipType.length > 0 
    ? filters.membershipType.join(", ") 
    : "All"}
</span>
    <AiOutlineDown />
  </div>

  {showDropdown && (
    <div className="absolute w-full bg-white border rounded shadow-md mt-1 max-h-52 overflow-y-auto z-10">
      {membershipOptions.map((option, index) => (
        <label key={index} className="block p-2 hover:bg-gray-100 cursor-pointer flex items-center">
          <input 
            type="checkbox" 
            checked={filters.membershipType.includes(option)} 
            onChange={() => handleMembershipChange(option)} 
            className="mr-2"
          />
          {option}
        </label>
      ))}
    </div>
  )}
  
          </div>
          <div>
            <label className="block mb-2 font-bold">Membership Status</label>
            <select
              name="membershipStatus"
              value={filters.membershipStatus}
              onChange={handleFilterChange}
              className="border p-2 rounded w-full"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              { label: "Card Printed Date", key: "cardPrinted" },
              { label: "Card Validity Date", key: "cardValidty" },
              { label: "Status", key: "status" },
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
                    <th className="border px-4 py-2">Card Printed Date</th>
                    <th className="border px-4 py-2">Card Validity Date</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Options</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => {
                    const memberZone = item.zone?.toLowerCase();
                    const isZoneMember = zoneRoles.includes(memberZone);


                    const isLadiesMember = item.typeOfMember?.toLowerCase().includes("ladies");

                    const isActivemember = item.status?.toLowerCase().includes("inactive");


                    return (
                      <tr
                      key={index}
                      className={`text-center 
                        ${isLadiesMember ? "bg-pink-100" : ""} 
                        ${isActivemember ? "bg-yellow-200" : ""}`}
                    >
                        <td className="border px-4 py-2">{item.kwsid}</td>
                        <td className="border px-4 py-2">{item.civil_id}</td>
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.zone}</td>
                        <td className="border px-4 py-2">{item.contact}</td>
                        <td className="border px-4 py-2">
  {item.typeOfMember?.split(",").map((type, index) => (
    <div key={index}>{type.trim()}</div>
  ))}
</td>
                        <td className="border px-4 py-2">{item.cardPrinted}</td>
                        <td className="border px-4 py-2">{item.cardValidty}</td>
                        <td className="border px-4 py-2">{item.status}</td>
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
