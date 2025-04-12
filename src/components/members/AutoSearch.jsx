"use client";

import { useState } from "react";

export default function AutoSearch({ memberNames, setFormData, formData }) {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const input = e.target.value;

    const { name } = e.target;

    setFormData((prev) => ({ ...prev, [name]: input }));

    setQuery(input);
    if (input.length > 0) {
      const filtered = memberNames.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredData(filtered);
      setShowDropdown(true);
    } else {
      setFilteredData([]);
      setShowDropdown(false);
    }
  };

  const handleItemClick = (item) => {
    setQuery(item);
    setShowDropdown(false);
    setFormData((prev) => ({ ...prev, follow_up_member: item }));
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={formData?.follow_up_member || query}
        onChange={handleInputChange}
        id="follow_up_member"
        name="follow_up_member"
        placeholder="Search and Select Member"
        className="mt-1 p-2 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
      {showDropdown && filteredData.length > 0 && (
        <ul className="absolute z-10 w-full bg-slate-200 border border-gray-300 rounded mt-1 max-h-60 overflow-auto">
          {filteredData.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(item)}
              className="p-2 cursor-pointer hover:bg-slate-400"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
