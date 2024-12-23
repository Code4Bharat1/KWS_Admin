"use client";
import React from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdOutlineStorage } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const router = useRouter();

  const handleTransaction = () => {
    router.push("/cms-admin/newsletter/create-newsletter");
  };
  const handleMembDatabase = () => {
    router.push("/cms-admin/newsletter/edit-newsletter");
  };
  const handleMembRequest = () => {
    router.push("/cms-admin/newsletter/archive-newsletter");
  };
  const handleInfoUpdate = () => {
    router.push("/cms-admin/newsletter/archive-newsletter");
  };

  const pieData = {
    labels: ["Salmiya", "Hawally", "Fahaheel", "Farwaniya", "Jleeb"],
    datasets: [
      {
        data: [300, 500, 200, 400, 300],
        backgroundColor: ["#3B82F6", "#F87171", "#10B981", "#FBBF24", "#FFA520"],
        borderColor: ["#2563EB", "#DC2626", "#059669", "#D97706", "#FFA599"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="mt-8 text-3xl md:text-5xl text-[#355F2E] text-center font-syne font-bold">
        Member Dashboard
      </h1>

      {/* Dashboard Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={handleTransaction}
          className="border-2 border-[#355F2E]  text-[#355F2E] p-6 shadow-lg flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <FaMoneyBillTransfer size={48} />
          <h2 className="text-lg mt-4 text-center">Transactions</h2>
        </div>

        <div
          onClick={handleMembDatabase}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6  shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <MdOutlineStorage size={48} />
          <h2 className="text-lg mt-4 text-center">Member Database</h2>
        </div>

        <div
          onClick={handleMembRequest}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6  shadow-md flex flex-col items-center hover:scale-105  transition duration-300"
        >
          <IoIosPeople size={48} />
          <h2 className="text-lg mt-4 text-center">Member Request</h2>
        </div>

        <div
          onClick={handleInfoUpdate}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6  shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <GrUpdate size={48} />
          <h2 className="text-lg mt-4 text-center">Information Update</h2>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="mt-16 mb-8 text-center">
        <h2 className="text-2xl md:text-4xl text-[#355F2E] font-syne font-bold">
          Membership at a Glance by Zone
        </h2>
        <div className="mt-8 mx-auto w-full max-w-sm">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
