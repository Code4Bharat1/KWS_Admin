"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ViewTransaction = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [transaction, setTransaction] = useState(null);
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
        console.error("Error fetching transaction details:", err);
        setError("Failed to load transaction details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

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
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-5xl font-bold text-center text-green-700 mb-10">
        View Transaction
      </h1>

      {loading && (
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading transaction details...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => router.push("/sandouqcha/transactions")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Transactions
          </button>
        </div>
      )}

      {transaction && (
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Transaction Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Transaction Date</span>
              <span className="text-lg font-semibold text-gray-900">
                {transaction.date || "Unknown"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Box Number</span>
              <span className="text-lg font-semibold text-gray-900">
                {transaction.boxNumber || "Unknown"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Collected By</span>
              <span className="text-lg font-semibold text-gray-900">
                {transaction.collectedByKwsid || "Unknown"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Holder Name</span>
              <span className="text-lg font-semibold text-gray-900">
                {transaction.holderName || "Unknown"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Transaction Id</span>
              <span className="text-lg font-semibold text-gray-900">
                {transaction.transactionId || "No Contact"}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Notes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(transaction.notes).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 border rounded bg-gray-100 text-center"
                >
                  <span className="text-sm text-gray-500 block">
                    {key.replace("_", " ")}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Coins</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(transaction.coins).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 border rounded bg-gray-100 text-center"
                >
                  <span className="text-sm text-gray-500 block">
                    {key.replace("_", " ")}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <span className="text-xl font-bold text-gray-800">Total Amount:</span>{" "}
            <span className="text-3xl font-extrabold text-blue-700">
              {transaction.total} KWD
            </span>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => router.push("/sandouqcha/transactions")}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to Transactions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTransaction;
 