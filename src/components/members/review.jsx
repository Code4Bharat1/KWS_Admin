"use client"
import React, { useState } from "react";

const Review = () => {
  const [pendingApprovals, setPendingApprovals] = useState([
    {
      appliedDate: "2023-12-01",
      civilId: "123456789",
      firstName: "John",
      lastName: "Doe",
    },
    {
      appliedDate: "2023-11-30",
      civilId: "987654321",
      firstName: "Jane",
      lastName: "Smith",
    },
  ]);

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Pending Approvals
      </h1>

      {/* List Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Applied Date</th>
              <th className="border px-4 py-2">Civil ID</th>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Review</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.appliedDate}</td>
                <td className="border px-4 py-2">{item.civilId}</td>
                <td className="border px-4 py-2">{item.firstName}</td>
                <td className="border px-4 py-2">{item.lastName}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-500 hover:underline">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Review;
