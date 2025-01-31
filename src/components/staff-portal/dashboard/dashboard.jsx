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
  const [counts, setCounts] = useState({
    transactions: 0,
    members: 0,
    requests: 0,
    updates: 0,
  });


  const fetchDashboardCounts = async () => {
    try {
      const [transactionsRes, membersRes, requestsRes, updatesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/transaction/transactioncount`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/member/count`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/member/pendingcount`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/profile/pendingrequest`),
      ]);

      const transactionsData = await transactionsRes.json();
      const membersData = await membersRes.json();
      const requestsData = await requestsRes.json();
      const updatesData = await updatesRes.json();


      setCounts({
        transactions: transactionsData.count || 0,
        members: membersData.count || 0,
        requests: requestsData.count || 0,
        updates: updatesData.count || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };



  const fetchZoneData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/member/getchart`); // Adjust the API endpoint URL
      const data = await response.json();

      setZoneData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching zone data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
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
          <p className="text-2xl font-bold mt-2">{counts.transactions}</p>
        </div>

        <div
          onClick={handleMembDatabase}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <MdOutlineStorage size={48} />
          <h2 className="text-lg mt-4 text-center">Member Database</h2>
          <p className="text-2xl font-bold mt-2">{counts.members}</p>
        </div>

        <div
          onClick={handleMembRequest}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <IoIosPeople size={48} />
          <h2 className="text-lg mt-4 text-center">Member Request</h2>
          <p className="text-2xl  font-bold mt-2">{counts.requests}</p>
        </div>

        <div
          onClick={handleInfoUpdate}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center hover:scale-105 transition duration-300"
        >
          <GrUpdate size={48} />
          <h2 className="text-lg mt-4 text-center">Information Update</h2>
          <p className="text-2xl font-bold mt-2">{counts.updates}</p>
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
        {!loading && zoneData && zoneData.labels && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {zoneData.labels.map((zone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: zoneData.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="text-gray-800 font-medium">{zone}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
