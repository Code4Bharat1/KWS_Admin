"use client";
import React from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { PiTreasureChestFill } from "react-icons/pi";
import { useRouter } from "next/navigation";

const Overview = () => {
  const router = useRouter();

  const handleTransaction = () => {
    router.push("/cms-admin/newsletter/create-newsletter");
  };
  const handleBoxes = () => {
    router.push("/cms-admin/newsletter/edit-newsletter");
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
        </div>

        <div
          onClick={handleBoxes}
          className="border-2 border-[#355F2E] text-[#355F2E] p-6  shadow-md flex flex-col items-center  hover:scale-105 transition duration-300 cursor-pointer"
        >
          <PiTreasureChestFill size={48} />
          <h2 className="text-lg mt-4 text-center">Sandouqcha Boxes</h2>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Overview;
