"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const EditBox = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const number = searchParams.get("number");

  const [box, setBox] = useState(null);
  const [formData, setFormData] = useState({
    inUse: "No",
    dateIssued: "",
    remarks: "",
    referredBy: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (number) {
      const fetchBoxDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5786/api/sandouqcha/getbox/${number}`
          );
          const boxData = response.data;
          setBox(boxData);

          setFormData({
            inUse: boxData.inUse === "Yes" ? "Yes" : "No",
            dateIssued: boxData.dateIssued || "",
            remarks: boxData.remarks || "",
            referredBy: boxData.referredBy?.kwsid || "", // Ensure it's a string (e.g., "KWSKW12345")
          });
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch box details.");
        }
      };
      fetchBoxDetails();
    }
  }, [number]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        `http://localhost:5786/api/sandouqcha/editbox/${number}`,
        formData
      );
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update box details.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this box?")) return;

    try {
      await axios.delete(`http://localhost:5786/api/sandouqcha/deletebox/${number}`);
      alert("Box deleted successfully.");
      router.push("/sandouqcha/boxes"); // Redirect to the list of boxes after deletion
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete the box.");
    }
  };

  if (!number) {
    return <p className="text-red-500">No box number provided.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!box) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Box {box.number}</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-2">In Use</label>
          <select
            name="inUse"
            value={formData.inUse}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-2">Date Issued</label>
          <input
            type="date"
            name="dateIssued"
            value={formData.dateIssued}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            rows="3"
          ></textarea>
        </div>
        <div>
          <label className="block font-bold mb-2">Referred By</label>
          <input
            type="text"
            name="referredBy"
            value={formData.referredBy} // Always a string
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            placeholder="Enter Referred By KWS ID"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
        {success && <p className="text-green-500 mt-4">{success}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default EditBox;
