"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineReload, AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation";

const AssignStaff = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    roles: {
      All: false,
      Registrar: false,
      Treasurer: false,
      Sandouqcha: false,
      Fahaheel: false,
      Farwaniya: false,
      Jleeb: false,
      Hawally: false,
      Salmiya: false,
      Auditor: false,
    },
  });

  const [allStaff, setAllStaff] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/staff/getlist`);
        const filteredStaff = response.data.filter((staff) => {
          const hasRoles = Object.keys(staff.roles || {}).some((role) => staff.roles[role]);
          return hasRoles;
        });

        setAllStaff(response.data);
        setList(filteredStaff);
      } catch (err) {
        console.error("Error fetching staff list:", err);
        setError("Failed to fetch staff list.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    if (role === "All") {
      const newValue = !filters.roles[role];
      setFilters((prev) => {
        const newRoles = Object.keys(prev.roles).reduce((acc, r) => {
          acc[r] = newValue;
          return acc;
        }, {});
        return { ...prev, roles: newRoles };
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        roles: { ...prev.roles, [role]: !prev.roles[role] },
      }));
    }
  };

  const handleSearch = () => {
    let selectedRoles = Object.keys(filters.roles).filter((role) => filters.roles[role]);
    const isAllSelected = selectedRoles.includes("All");

    if (isAllSelected) {
      selectedRoles = selectedRoles.filter((role) => role !== "All");
    }

    const filteredList = allStaff.filter((staff) => {
      const searchTerm = filters.search.toLowerCase().trim();
      const matchesSearch =
        staff.username.toLowerCase().includes(searchTerm) ||
        staff.fullName.toLowerCase().includes(searchTerm) ||
        staff.kwsid.toLowerCase().includes(searchTerm);

      const staffRoles = Object.keys(staff.roles || {}).filter((role) => staff.roles[role]);
      const matchesRole = isAllSelected || selectedRoles.length === 0
        ? true
        : selectedRoles.some((role) => staffRoles.includes(role));

      const hasRoles = staffRoles.length > 0;

      return matchesSearch && matchesRole && (searchTerm ? true : hasRoles);
    });

    setList(filteredList);
  };

  const handleRefresh = () => {
    setFilters({
      search: "",
      roles: {
        All: false,
        Registrar: false,
        Treasurer: false,
        Sandouqcha: false,
        Fahaheel: false,
        Farwaniya: false,
        Jleeb: false,
        Hawally: false,
        Salmiya: false,
        Auditor: false,
      },
    });

    const filteredStaff = allStaff.filter((staff) =>
      Object.keys(staff.roles || {}).some((role) => staff.roles[role])
    );

    setList(filteredStaff);
    setError(null);
  };

  const handleEdit = (username) => {
    router.push(`/assign-staff/edit-staff?username=${username}`);
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        KWS Portal Staff
      </h1>

      <div className="mb-6">
        <div className="mb-4">
          <label className="block mb-2 font-bold">KWS ID/Name</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Enter KWS ID or Name"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.keys(filters.roles).map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.roles[role]}
                onChange={() => handleRoleChange(role)}
              />
              <span className="capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <AiOutlineSearch size={20} /> <span>Search</span>
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          <AiOutlineReload size={20} /> <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Roles</th>
              <th className="border px-4 py-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading staff list...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              list.map((item, index) => {
                const staffRoles = Object.keys(item.roles || {}).filter((role) => item.roles[role]);

                return (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{item.username}</td>
                    <td className="border px-4 py-2">{item.fullName}</td>
                    <td className="border px-4 py-2">
                      {staffRoles.length > 0 ? staffRoles.join(", ") : "No Roles"}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(item.username)}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        <AiOutlineEdit size={20} /> <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            {!loading && list.length === 0 && !error && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignStaff;
