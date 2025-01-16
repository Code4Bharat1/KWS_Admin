"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const EditTransaction = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [transaction, setTransaction] = useState({
    transactionId: "",
    date: "",
    boxNumber: "",
    collectedByKwsid: "",
    notes: {
      note_20: 0,
      note_10: 0,
      note_5: 0,
      note_1: 0,
      note_0_5: 0,
      note_0_25: 0,
    },
    coins: {
      coin_100: 0,
      coin_50: 0,
      coin_20: 0,
      coin_10: 0,
      coin_5: 0,
    },
    total: 0,
    transactionSlip: null, // File object for new upload
    transactionSlipUrl: "", // Existing file URL (if any)
    status: "pending", // The current slip status
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine if slip status dropdown should be shown:
  const [showSlipDropdown, setShowSlipDropdown] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rolesStr = localStorage.getItem("staffRoles");
      if (rolesStr) {
        try {
          const roles = JSON.parse(rolesStr);
          // Show dropdown if either Auditor or All is true
          if (roles.Auditor === true || roles.All === true) {
            setShowSlipDropdown(true);
          }
        } catch (err) {
          console.error("Failed to parse staffRoles:", err);
        }
      }
    }
  }, []);

  // Fetch transaction details on mount
  useEffect(() => {
    if (!id) {
      setError("Transaction ID is required.");
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5786/api/sandouqchaTransaction/view/${id}`
        );
        setTransaction({
          ...response.data,
          notes: {
            note_20: response.data.notes.note_20,
            note_10: response.data.notes.note_10,
            note_5: response.data.notes.note_5,
            note_1: response.data.notes.note_1,
            note_0_5: response.data.notes.note_0_5,
            note_0_25: response.data.notes.note_0_25,
          },
          coins: {
            coin_100: response.data.coins.coin_100,
            coin_50: response.data.coins.coin_50,
            coin_20: response.data.coins.coin_20,
            coin_10: response.data.coins.coin_10,
            coin_5: response.data.coins.coin_5,
          },
          transactionSlipUrl: response.data.transactionSlipUrl || "",
          collectedByKwsid: response.data.collectedByKwsid || "",
          status: response.data.status || "pending",
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError("Failed to load transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Handle input change for top-level and nested fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("note_")) {
      setTransaction((prev) => ({
        ...prev,
        notes: { ...prev.notes, [name]: Number(value) },
      }));
    } else if (name.startsWith("coin_")) {
      setTransaction((prev) => ({
        ...prev,
        coins: { ...prev.coins, [name]: Number(value) },
      }));
    } else {
      setTransaction((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file input for updating the transaction slip
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTransaction((prev) => ({
      ...prev,
      transactionSlip: file,
    }));
  };

  // Calculate total amount based on notes and coins
  const calculateTotal = () => {
    const { notes, coins } = transaction;
    const total =
      (notes.note_20 || 0) * 20 +
      (notes.note_10 || 0) * 10 +
      (notes.note_5 || 0) * 5 +
      (notes.note_1 || 0) * 1 +
      (notes.note_0_5 || 0) * 0.5 +
      (notes.note_0_25 || 0) * 0.25 +
      (coins.coin_100 || 0) * 0.1 +
      (coins.coin_50 || 0) * 0.05 +
      (coins.coin_20 || 0) * 0.02 +
      (coins.coin_10 || 0) * 0.01 +
      (coins.coin_5 || 0) * 0.005;
    setTransaction((prev) => ({ ...prev, total: total.toFixed(3) }));
  };

  useEffect(() => {
    calculateTotal();
  }, [transaction.notes, transaction.coins]);

  // Handle form submission with FormData (to include file, if updated)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("transactionId", transaction.transactionId);
      formData.append("date", transaction.date);
      formData.append("boxId", transaction.boxNumber);
      formData.append("collectedByKwsid", transaction.collectedByKwsid);
      formData.append("note_20", transaction.notes.note_20);
      formData.append("note_10", transaction.notes.note_10);
      formData.append("note_5", transaction.notes.note_5);
      formData.append("note_1", transaction.notes.note_1);
      formData.append("note_0_5", transaction.notes.note_0_5);
      formData.append("note_0_25", transaction.notes.note_0_25);
      formData.append("coin_100", transaction.coins.coin_100);
      formData.append("coin_50", transaction.coins.coin_50);
      formData.append("coin_20", transaction.coins.coin_20);
      formData.append("coin_10", transaction.coins.coin_10);
      formData.append("coin_5", transaction.coins.coin_5);
      formData.append("total", transaction.total);
      formData.append("status", transaction.status);

      // Append the file if a new slip is provided
      if (transaction.transactionSlip) {
        formData.append("transactionSlip", transaction.transactionSlip);
      }

      await axios.put(`http://localhost:5786/api/sandouqchaTransaction/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Transaction updated successfully!");
      router.push("/sandouqcha/transactions");
    } catch (err) {
      console.error("Error updating transaction:", err);
      alert("Failed to update transaction.");
    }
  };

  if (!id) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 text-lg font-semibold">Transaction ID is missing.</p>
        <button
          onClick={() => router.push("/sandouqcha/transactions")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-5xl font-bold text-center text-green-700 mb-8">Edit Transaction</h1>

      {loading && <p className="text-center">Loading transaction details...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && transaction && (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Transaction Date</label>
              <input
                type="date"
                name="date"
                value={transaction.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Box Number</label>
              <input
                type="text"
                name="boxNumber"
                value={transaction.boxNumber}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Collected By (KWSID)</label>
              <input
                type="text"
                name="collectedByKwsid"
                value={transaction.collectedByKwsid}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-1">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              value={transaction.transactionId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* File Upload Field for Transaction Slip */}
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-1">Transaction Slip (Image or PDF)</label>
            {transaction.transactionSlipUrl && (
              <div className="mb-2">
                <a
                  href={`http://localhost:5786${transaction.transactionSlipUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Current Slip
                </a>
              </div>
            )}
            <input
              type="file"
              name="transactionSlip"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Dropdown for Slip Status, visible based on staffRoles */}
          {(() => {
            if (typeof window !== "undefined") {
              const roles = JSON.parse(localStorage.getItem("staffRoles") || "{}");
              if (roles.Auditor === true || roles.All === true) {
                return (
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-1">Slip Status</label>
                    <select
                      name="status"
                      value={transaction.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                );
              }
            }
            return null;
          })()}

          <h3 className="text-xl font-semibold mt-6">Notes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {Object.keys(transaction.notes).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-semibold mb-1">{key.replace("_", " ")}</label>
                <input
                  type="number"
                  name={key}
                  value={transaction.notes[key]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-6">Coins</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {Object.keys(transaction.coins).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-semibold mb-1">{key.replace("_", " ")}</label>
                <input
                  type="number"
                  name={key}
                  value={transaction.coins[key]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <span className="text-lg font-bold text-gray-800">Total Amount:</span>{" "}
            <span className="text-3xl font-extrabold text-blue-700">{transaction.total} KWD</span>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => router.push("/sandouqcha/transactions")}
              className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditTransaction;
