"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineEye } from "react-icons/ai";

const InfoUpdate = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending update requests from the backend
  useEffect(() => {
    const fetchPendingRequests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/pending-updates`);
        setPendingRequests(response.data.updateRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
        setErrorMessage("Failed to fetch pending update requests.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  // Handle Review button click
  const handleReview = (requestId) => {
    const request = pendingRequests.find(req => req.id === requestId);
    setSelectedRequest(request); // Set the selected request for review
    console.log("Selected Request for Review:", request); // Debugging log to inspect the selected request
  };

  // Handle approve action
  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/approve`, {
        updateRequestId: selectedRequest.id,
        approvedBy: "Admin", // You can dynamically fetch admin details
      });
      setSelectedRequest(null); // Close the modal after approval
      setPendingRequests(prev => prev.filter(req => req.id !== selectedRequest.id)); // Remove approved request from the list
      setErrorMessage(""); // Clear any errors
    } catch (error) {
      console.error("Error approving the request:", error);
      setErrorMessage("Failed to approve the update request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle reject action

  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (errorMessage) {
    return <div className="text-center text-red-500">{errorMessage}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl md:text-5xl text-[#355F2E] font-syne font-bold text-center mb-6">
        Information Update Requests
      </h1>

      {/* Pending Requests Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Request ID</th>
              <th className="border px-4 py-2">Date Requested</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Zone</th>
              <th className="border px-4 py-2">Type of Member</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{request.id}</td>
                <td className="border px-4 py-2">{request.requested_date}</td>
                <td className="border px-4 py-2">{request.username}</td>
                <td className="border px-4 py-2">{request.zone_member}</td>
                <td className="border px-4 py-2">{request.type_of_member}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleReview(request.id)}
                    className="flex items-center justify-center text-blue-500"
                  >
                    <AiOutlineEye size={20} /> <span>Review</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Reviewing the Request */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold mb-4">Review Update Request</h3>
            <div className="space-y-4">
              <p><strong>Username:</strong> {selectedRequest.username || "N/A"}</p>
              <p><strong>Type of Member:</strong> {selectedRequest.type_of_member || "N/A"}</p>
              <p><strong>Zone:</strong> {selectedRequest.zone_member || "N/A"}</p>
              <p><strong>Date Requested:</strong> {selectedRequest.requested_date}</p>
              <div className="space-y-2">
                <p><strong>Profile Information:</strong></p>
                {selectedRequest.data && Object.keys(selectedRequest.data).map((key) => (
                  <p key={key}><strong>{key}:</strong> {selectedRequest.data[key]}</p>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-6">
           
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoUpdate;
