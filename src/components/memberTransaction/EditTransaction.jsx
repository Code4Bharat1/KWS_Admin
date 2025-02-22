"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Using useSearchParams hook to get query params
import axios from "axios";

const EditTransaction = () => {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid"); // Get the `uid` from query parameters

  const [transactionData, setTransactionData] = useState({
    kwsId: "",
    paymentFor: "",
    status:"",
    approvedByKwsid:"",
    cardPrintedDate: "",
    cardExpiryDate: "",
    amountPaid: "",
    date: "",
    remarks: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch transaction details using GET API
  const fetchTransactionDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/get/${uid}`
      );
      const data = response.data;

      // Set form data with existing transaction values
      setTransactionData({
        kwsId: data.KWSID,
        status:data.status,
        paymentFor: data.Category,
        cardPrintedDate: data.CardPrintedDate || "",
        cardExpiryDate: data.CardExpiryDate || "",
        amountPaid: data.AmountKWD,
        approvedByKwsid:data.approvedByKwsid,
        date: data.Date,
        remarks: data.Remarks || "",
      });
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchTransactionDetails(); // Fetch details only if `uid` is available
    }
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const committedId = localStorage.getItem("userId");
  
    // Clean the data: If card dates are "Not Available", send null instead
    const cleanedData = {
      category: transactionData.paymentFor,
      status:transactionData.status,
      cardPrintedDate: transactionData.cardPrintedDate === "Not Available" ? null : transactionData.cardPrintedDate,
      cardExpiryDate: transactionData.cardExpiryDate === "Not Available" ? null : transactionData.cardExpiryDate,
      amountKWD: parseFloat(transactionData.amountPaid), // Ensure amount is a number
      date: transactionData.date,
      approvedByKwsid:transactionData.approvedByKwsid,
      remarks: transactionData.remarks,
      committedId,
    };
  
    // Logging cleaned data to verify before sending the request
    // console.log("Cleaned Data:", cleanedData);
  
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/edit/${uid}`,
        cleanedData
      );
      alert("Transaction updated successfully!");
      window.location.href = "/members/transactions"; // Redirect to transactions list
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction.");
    }
  };
  
  
  const handleCancel = () => {
    window.location.href = "/members/transactions"; // Redirect to transactions list
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Transaction</h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-bold">KWS ID</label>
            <input
              type="text"
              name="kwsId"
              value={transactionData.kwsId}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              readOnly
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Payment For</label>
            <select
              name="paymentFor"
              value={transactionData.paymentFor}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="NEW">NEW</option>
              <option value="RENEWAL">RENEWAL</option>
              <option value="ELITE NEW">ELITE NEW</option>
                <option value="ELITE RENEWAL">ELITE RENEWAL</option>
                <option value="PRIVILEGE NEW">PRIVILEGE NEW</option>
                <option value="PRIVILEGE RENEWAL">PRIVILEGE RENEWAL</option>
                
             <option value="LIFE MEMBERSHIP">LIFE MEMBERSHIP</option>
              <option value="MBS1">MBS1</option>
              <option value="MBS2">MBS2</option>
              <option value="MBS3">MBS3</option>
              <option value="MBS4">MBS4</option>
            </select>
          </div>
          {/* <div>
            <label className="block mb-2 font-bold">Card Printed Date</label>
            <input
              type="date"
              name="cardPrintedDate"
              value={transactionData.cardPrintedDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Card Expiry Date</label>
            <input
              type="date"
              name="cardExpiryDate"
              value={transactionData.cardExpiryDate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div> */}
          <div>
            <label className="block mb-2 font-bold">Amount Paid (KWD)</label>
            <input
              type="number"
              name="amountPaid"
              value={transactionData.amountPaid}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Date</label>
            <input
              type="date"
              name="date"
              value={transactionData.date}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Status</label>
            <select
              name="status"
              value={transactionData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
             
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div>
          <label className="block text-gray-700 font-semibold mb-1">Approved By (KWSID)</label>
            <input
              type="text"
              name="approvedByKwsid"
              value={transactionData.approvedByKwsid}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />

          </div>


         
          
          <div className="col-span-2">
            <label className="block mb-2 font-bold">Remarks</label>
            <textarea
              name="remarks"
              value={transactionData.remarks}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            ></textarea>
          </div>
          <div className="col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
