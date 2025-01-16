"use client";
import React, { useState } from "react";
import axios from "axios";

const BulkTransaction = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    // console.log("File selected:", e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      console.error("No file selected for upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      // console.log("Sending request to upload file...");
      
      const response = await axios.post("http://localhost:5786/api/sandouqchaTransaction/bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log("Response from server:", response.data);

      setUploadResults(response.data);
      setFile(null); // Clear file after successful upload
    } catch (err) {
      console.error("Error during bulk upload:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Bulk Upload Transactions
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="bulkFile">
            Select CSV / Excel File
          </label>
          <input
            id="bulkFile"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Display upload results */}
        {uploadResults && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Upload Results</h2>

            {/* Successfully Uploaded Transactions */}
            {uploadResults.createdTransactions && uploadResults.createdTransactions.length > 0 && (
              <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                <h3 className="text-lg font-medium">Successfully Uploaded:</h3>
                <ul className="list-disc pl-5">
                  {uploadResults.createdTransactions.map((transaction, index) => (
                    <li key={index}>
                      <strong>Transaction ID:</strong> {transaction.transaction_id}
                      <br />
                      <strong>Box Number:</strong> {transaction.box_id}
                      <br />
                      <strong>Collected By (KWSID):</strong> {transaction.collected_by_id}
                      <br />
                      <span className="text-green-600">Successfully created.</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Failed Transactions */}
            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <h3 className="text-lg font-medium">Failed Transactions:</h3>
                <ul className="list-disc pl-5">
                  {uploadResults.errors.map((error, index) => (
                    <li key={index}>
                      <strong>Transaction ID:</strong> {error.transactionId}
                      <br />
                      <strong>Error:</strong> {error.message}
                      <br />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* If no errors or successes */}
            {!uploadResults.createdTransactions?.length && !uploadResults.errors?.length && (
              <div className="text-center text-gray-500">No transactions were uploaded.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkTransaction;
