"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pie } from "react-chartjs-2";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlineStorage } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components for the pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const router = useRouter();

  const [zoneData, setZoneData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchZoneData = async () => {
    try {
      const response = await fetch("http://localhost:5786/api/member/getchart"); // Adjust the API endpoint URL
      const data = await response.json();

      setZoneData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching zone data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZoneData();
  }, []);

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend (labels below the chart)
      },
    },
  };
  const handleTransaction = () => {
    router.push("/members/transactions");
  };

  const handleMembDatabase = () => {
    router.push("/members/search");
  };

  const handleMembRequest = () => {
    router.push("/members/review");
  };

  const handleInfoUpdate = () => {
    router.push("/members/info-update");
  };

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="mt-8 text-3xl md:text-5xl text-[#355F2E] text-center font-syne font-bold">
        Member Dashboard
      </h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={handleTransaction}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-lg flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <FaMoneyBillTransfer size={48} />
          <h2 className="text-lg mt-4 text-center">Transactions</h2>
        </div>

        <div
          onClick={handleMembDatabase}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <MdOutlineStorage size={48} />
          <h2 className="text-lg mt-4 text-center">Member Database</h2>
        </div>

        <div
          onClick={handleMembRequest}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <IoIosPeople size={48} />
          <h2 className="text-lg mt-4 text-center">Member Request</h2>
        </div>

        <div
          onClick={handleInfoUpdate}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <GrUpdate size={48} />
          <h2 className="text-lg mt-4 text-center">Information Update</h2>
        </div>
      </div>

      <div className="mt-16 mb-8 text-center">
        <h2 className="text-2xl md:text-4xl text-[#355F2E] font-syne font-bold">
          Membership at a Glance by Zone
        </h2>
        <div className="mt-8 mx-auto w-full max-w-sm">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Pie data={zoneData} options={pieOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
