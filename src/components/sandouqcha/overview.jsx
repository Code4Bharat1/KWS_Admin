"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { PiTreasureChestFill } from "react-icons/pi";
import { useRouter } from "next/navigation";

const Overview = () => {
  const router = useRouter();

  const [counts, setCounts] = useState({
      transactions: 0,
      boxes: 0,
    });

    const fetchDashboardCounts = async () => {
      try {
        const [boxesRes, transactionsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/sandouqcha/getcount`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/sandouqchaTransaction/getcount`),

        ]);
  
        const transactionsData = await transactionsRes.json();
        const boxesData = await boxesRes.json();
      
        setCounts({
          transactions: transactionsData.count || 0,
          boxes: boxesData.count || 0,
         
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
  
   useEffect(() => {
      fetchDashboardCounts();
    }, []);

  const handleTransaction = () => {
    router.push("/sandouqcha/transactions");
  };
  const handleBoxes = () => {
    router.push("/sandouqcha/boxes");
  };

  return (
    <div className="p-4 bg-gray-50">
        <h1 className="mt-8 text-3xl md:text-5xl text-[#355F2E] text-center font-syne font-bold">
        Sandouqcha Dashboard
      </h1>
    <div className=" mt-12 flex justify-center items-center ">
        
      <div className="grid grid-cols-2 gap-12">

        <div
          onClick={handleTransaction}
          className=" border-2 border-[#355F2E] text-[#355F2E] p-6 shadow-md flex flex-col items-center  transition duration-300 cursor-pointer hover:scale-105"
        >
          <FaMoneyBillTransfer size={48} />
          <h2 className="text-lg mt-4 text-center">Transactions</h2>
          <p className="text-2xl font-bold mt-2">{counts.transactions}</p>
        </div>

        <div
          onClick={handleBoxes}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6  shadow-md flex flex-col items-center  hover:scale-105 transition duration-300 cursor-pointer"
        >
          <PiTreasureChestFill size={48} />
          <h2 className="text-lg mt-4 text-center">Sandouqcha Boxes</h2>
          <p className="text-2xl font-bold mt-2">{counts.boxes}</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Overview;
