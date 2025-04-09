"use client";

import { FaEllipsisVertical } from "react-icons/fa6";
import { useState, useRef, useCallback } from "react";
import axios from "axios";
import AddSpinForm from "../Forms/addSpinForm";
import { useRouter } from "next/navigation";

export default function LuckySpins({ raffleId, setLuckyDraws, luckyDraws }) {
  const [dropDownIndex, setDropDownIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prize, setPrize] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dropRef = useRef(null);

  const router = useRouter();

  const toggleDropdown = (index) => {
    setDropDownIndex(dropDownIndex === index ? null : index);
  };

  const handleReset = async (id) => {
    if (window.confirm("Are you sure you want to Reset! this lucky draw?")) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/rafflereset/${id}`
        );

        // Show success message
        setSuccessMessage("Lucky Draw Reset successfully!");

        // Auto-hide success message after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } catch (error) {
        console.error(
          "Error reseting lucky draw:",
          error.response?.data || error
        );
      }
    }

    setDropDownIndex(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lucky draw?")) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/${id}`
        );

        // Update state by removing the deleted lucky draw
        setLuckyDraws((prevDraws) =>
          prevDraws.filter((draw) => draw.id !== id)
        );

        // Show success message
        setSuccessMessage("Lucky Draw deleted successfully!");

        // Auto-hide success message after 2 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } catch (error) {
        console.error(
          "Error deleting lucky draw:",
          error.response?.data || error
        );
      }
    }

    setDropDownIndex(null);
  };

  const handleAddSpin = async (raffleId) => {
    try {
      // Ensure required fields are filled
      if (!prize || !sponsor || !startTime) {
        console.error("All fields are required.");
        return;
      }

      // API request to add a new lucky draw
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/${raffleId}`,
        {
          prize,
          sponsor,
          start_time: new Date(startTime), // Ensure correct format
        }
      );

      // Show success message
      setSuccessMessage("Lucky Draw added successfully!");

      // Clear input fields
      setPrize("");
      setSponsor("");
      setStartTime("");

      // Delay closing modal to show success message
      setTimeout(() => {
        setSuccessMessage("");
        setIsModalOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Error adding lucky draw:", error.response?.data || error);
    }
  };

  const openSpin = useCallback(
    (spinId) => {
      router.push(`/raffle-draw/${raffleId}/${spinId}`);
    },
    [router]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-4 sm:flex sm:items-center">
        <div className="sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block w-full md:w-auto rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 font-bold shadow-md hover:scale-105 transition"
          >
            Add Lucky Draw
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 text-green-600 font-semibold text-center bg-green-100 py-2 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Lucky Draws Table */}
      <div className="overflow-x-auto mt-10 rounded-lg shadow-lg ring-1 ring-gray-300 bg-white relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-4 text-left text-sm font-semibold">
                Prize
              </th>
              <th className="px-3 py-4 text-left text-sm font-semibold">
                Sponsor
              </th>
              <th className="px-3 py-4 text-left text-sm font-semibold">
                Start Time
              </th>
              <th className="px-3 py-4 text-sm font-semibold">Actions</th>
              <th className="px-3 py-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {luckyDraws?.map((draw, index) => (
              <tr key={draw?.id} className="hover:bg-gray-100 transition">
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {draw?.prize}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {draw?.sponsor}
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">
                  {new Date(draw?.start_time).toLocaleString()}
                </td>
                <td className="relative px-4 py-4 text-sm font-semibold">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="focus:outline-none hover:bg-gray-300 p-2 rounded-lg"
                  >
                    <FaEllipsisVertical className="h-5 w-5 text-gray-600 hover:text-gray-800 transition" />
                  </button>
                  {dropDownIndex === index && (
                    <div
                      ref={dropRef}
                      className="absolute right-4 -mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-gray-300 z-50"
                    >
                      <button
                        onClick={() => handleReset(draw.id)}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => handleDelete(draw.id)}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 text-sm font-semibold">
                  <button
                    onClick={() => openSpin(draw.id)}
                    type="button"
                    disabled={draw.status}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      draw.status
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                    }`}
                  >
                    {draw.status ? "Spinned" : "Spin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add Lucky Draw</h2>
            <AddSpinForm
              prize={prize}
              sponsor={sponsor}
              start_time={startTime}
              setPrize={setPrize}
              setSponsor={setSponsor}
              setStartTime={setStartTime}
            />

            {successMessage && (
              <div className="text-green-500 font-semibold py-5 text-center mb-2">
                {successMessage}
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAddSpin(raffleId)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Lucky Draw
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
