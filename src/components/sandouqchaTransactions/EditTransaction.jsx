"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const EditTransaction = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Extract the transaction ID from query params
  const [transaction, setTransaction] = useState({
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setTransaction(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to fetch transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "note_20",
      "note_10",
      "note_5",
      "note_1",
      "note_0_5",
      "note_0_25",
      "coin_100",
      "coin_50",
      "coin_20",
      "coin_10",
      "coin_5",
    ];

    if (numericFields.includes(name)) {
      setTransaction((prev) => ({
        ...prev,
        notes: {
          ...prev.notes,
          ...(name.startsWith("note_") ? { [name]: Number(value) } : {}),
        },
        coins: {
          ...prev.coins,
          ...(name.startsWith("coin_") ? { [name]: Number(value) } : {}),
        },
      }));
    } else {
      setTransaction((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotal = () => {
    const total =
      transaction.notes.note_20 * 20 +
      transaction.notes.note_10 * 10 +
      transaction.notes.note_5 * 5 +
      transaction.notes.note_1 * 1 +
      transaction.notes.note_0_5 * 0.5 +
      transaction.notes.note_0_25 * 0.25 +
      transaction.coins.coin_100 * 0.1 +
      transaction.coins.coin_50 * 0.05 +
      transaction.coins.coin_20 * 0.02 +
      transaction.coins.coin_10 * 0.01 +
      transaction.coins.coin_5 * 0.005;

    setTransaction((prev) => ({ ...prev, total: total.toFixed(3) }));
  };

  useEffect(() => {
    calculateTotal();
  }, [transaction.notes, transaction.coins]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedTransaction = {
        id,
        date: transaction.date,
        boxId: transaction.boxNumber,
        collectedByKwsid: transaction.collectedByKwsid,
        ...transaction.notes,
        ...transaction.coins,
      };

      await axios.put(
        `http://localhost:5786/api/sandouqchaTransaction/edit/${id}`,
        updatedTransaction
      );

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
        <p className="text-red-600 text-lg font-semibold">
          Transaction ID is missing.
        </p>
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-center text-green-700 mb-8">
        Edit Transaction
      </h1>

      {loading && <p className="text-center">Loading transaction details...</p>}

      {error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && (
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Transaction Date
              </label>
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
  <label className="block text-gray-700 font-semibold mb-1">
    Box Number
  </label>
  <input
    type="text"
    name="boxNumber"
    value={transaction.boxNumber}
    readOnly
    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
  />
</div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Collected By (KWSID)
              </label>
              <input
                type="text"
                name="collectedByKwsid"
                value={transaction.collectedByKwsid}
                readOnly
                className="w-full px-4 py-2 border rounded-lg"
                disabled
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6">Notes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {Object.keys(transaction.notes).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-semibold mb-1">
                  {key.replace("_", " ")}
                </label>
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
                <label className="block text-gray-700 font-semibold mb-1">
                  {key.replace("_", " ")}
                </label>
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
            <span className="text-lg font-bold">Total Amount:</span>{" "}
            <span className="text-2xl font-extrabold text-blue-700">
              {transaction.total} KWD
            </span>
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
