"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const ViewBox = () => {
  const searchParams = useSearchParams();
  const number = searchParams.get("number");

  const [box, setBox] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (number) {
      const fetchBox = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/sandouqcha/getbox/${number}`
          );
          setBox(response.data);
        } catch (err) {
          setError(err.response?.data?.error || "Failed to fetch box details.");
        }
      };
      fetchBox();
    }
  }, [number]);

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
      <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
        Box Details
      </h2>
      <div className="bg-green-50 p-6 rounded-lg shadow-md space-y-4 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="font-semibold">Box Number:</span>
          <span className="text-gray-700">{box.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">In Use:</span>
          <span
            className={`font-bold ${
              box.inUse === "True" ? "text-green-500" : "text-red-500"
            }`}
          >
            {box.inUse === "True" ? "Yes" : "No"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Date Issued:</span>
          <span className="text-gray-700">{box.dateIssued || "None"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Referred By:</span>
          <span className="text-gray-700">
            {box.referredBy && typeof box.referredBy === "object"
              ? `${box.referredBy.name} (${box.referredBy.kwsid})`
              : "None"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Remarks:</span>
          <span className="text-gray-700">{box.remarks || "No Remarks"}</span>
        </div>
        {box.member && (
          <div className="flex justify-between">
            <span className="font-semibold">Member:</span>
            <span className="text-gray-700">
              {`${box.member.name} (${box.member.kwsid})`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBox;
