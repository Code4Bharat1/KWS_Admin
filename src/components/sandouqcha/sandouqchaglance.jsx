"use client";
import React, { useState , useEffect} from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { AiOutlinePieChart } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Sandouqchaglance = () => {
  const [boxData, setBoxData] = useState({ in_use: 0, total: 0, usage_percentage: 0 });

  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2024");


  useEffect(() => {
    const fetchBoxData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/sandouqcha/inusecount`);
        const data = await response.json();
        setBoxData(data);
      } catch (error) {
        console.error("Error fetching box data:", error);
      }
    };

    fetchBoxData();
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prev) =>
      prev === dropdownName ? null : dropdownName
    );
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="p-4 bg-gray-50">
      <h1 className="mt-8 text-2xl md:text-3xl text-[#355F2E] text-center font-syne font-bold">
        Sandouqcha at a Glance
      </h1>

      <div className="mt-12 flex flex-col justify-center items-center space-y-6">
        {/* All Boxes in Use */}
        <div
          className="bg-white border-2 border-black text-white p-6 shadow-md w-full max-w-2xl cursor-pointer hover:scale-105"
          onClick={() => toggleDropdown("allBoxes")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AiOutlinePieChart size={48} color="black" />
              <h2 className="text-black text-lg font-bold">All Sandouqcha Boxes in Use</h2>
            </div>
            <div className="flex items-center space-x-2">
            <span className="text-black text-2xl font-bold">
            {boxData.in_use} / {boxData.total}
          </span>
              {activeDropdown === "allBoxes" ? (
                <IoIosArrowUp size={24} color="black" />
              ) : (
                <IoIosArrowDown size={24} color="black" />
              )}
            </div>
          </div>
          {activeDropdown === "allBoxes" && (
            <div className="mt-4 text-center">
              <p className="text-black text-lg">{boxData.usage_percentage}% Usage</p>
            </div>
          )}
        </div>

        {/* Boxes in Circulation Zone */}
        {/* <div
          className="border-2 border-black text-white p-6 shadow-md w-full max-w-2xl cursor-pointer hover:scale-105"
          onClick={() => toggleDropdown("circulationZone")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BiTrendingUp size={48} color="black" />
              <h2 className="text-black text-lg font-bold">Boxes in Circulation by Zone</h2>
            </div>
            {activeDropdown === "circulationZone" ? (
              <IoIosArrowUp size={24} color="black" />
            ) : (
              <IoIosArrowDown size={24} color="black" />
            )}
          </div>
          {activeDropdown === "circulationZone" && (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-white">
                <thead>
                  <tr>
                    <th className="text-black px-4 py-2 border-b">Zone</th>
                    <th className="text-black px-4 py-2 border-b"># Boxes</th>
                    <th className="text-black px-4 py-2 border-b">Collected 2024</th>
                    <th className="text-black px-4 py-2 border-b">% Collected in 2024</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-black px-4 py-2 border-b">Salmiya</td>
                    <td className="text-black px-4 py-2 border-b">20</td>
                    <td className="text-black px-4 py-2 border-b">15</td>
                    <td className="text-black px-4 py-2 border-b">75%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div> */}

        {/* Collected This Month */}
        {/* <div
          className="border-2 border-black text-white p-6 shadow-md w-full max-w-2xl cursor-pointer hover:scale-105"
          onClick={() => toggleDropdown("collectedMonth")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaMoneyBillTransfer size={48} color="black" />
              <h2 className="text-black text-lg font-bold">Collected This Month</h2>
            </div>
            {activeDropdown === "collectedMonth" ? (
              <IoIosArrowUp size={24} color="black" />
            ) : (
              <IoIosArrowDown size={24} color="black" />
            )}
          </div>
          {activeDropdown === "collectedMonth" && (
            <div className="text-black mt-4 text-center">
              <p>Detailed collection statistics can go here.</p>
            </div>
          )}
        </div> */}

        {/* Yearly Collection Details */}
        {/* <div
          className="border-2 border-black text-white p-6 shadow-md w-full max-w-4xl cursor-pointer hover:scale-105"
          onClick={() => toggleDropdown("yearlyCollection")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaMoneyBillTransfer size={48} color="black" />
              <h2 className="text-black text-lg font-bold">Yearly Collection Details</h2>
            </div>
            {activeDropdown === "yearlyCollection" ? (
              <IoIosArrowUp size={24} color="black" />
            ) : (
              <IoIosArrowDown size={24} color="black" />
            )}
          </div>
          {activeDropdown === "yearlyCollection" && (
            <div className="mt-4">
              <div className="flex justify-center mb-4">
                <label className="text-black font-bold mr-2">Select Year:</label>
                <select
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="border p-2 rounded"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border-spacing-0 border border-black">
                  <thead>
                    <tr>
                      <th className="text-black px-4 py-2 border">Month</th>
                      <th className="text-black px-4 py-2 border">Total</th>
                      <th className="text-black px-4 py-2 border">Salmiya</th>
                      <th className="text-black px-4 py-2 border">Farwaniya</th>
                      <th className="text-black px-4 py-2 border">Fahaheel</th>
                      <th className="text-black px-4 py-2 border">Hawally</th>
                      <th className="text-black px-4 py-2 border">Jleeb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, index) => (
                      <tr key={index}>
                        <td className="text-black px-4 py-2 border">{month}</td>
                        <td className="text-black px-4 py-2 border">100</td>
                        <td className="text-black px-4 py-2 border">20</td>
                        <td className="text-black px-4 py-2 border">25</td>
                        <td className="text-black px-4 py-2 border">15</td>
                        <td className="text-black px-4 py-2 border">25</td>
                        <td className="text-black px-4 py-2 border">15</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Sandouqchaglance;
