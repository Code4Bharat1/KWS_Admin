"use client";

import Navbar from "@/components/raffleDraw/Navbar";
import Copyright from "@/components/layouts/copyright/copyright";
import WinnerTable from "@/components/raffleDraw/Tables/winner.table";

import { useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();

  const raffleId = searchParams.get("id");

  return (
    <div>
      <Navbar />
      {/* 🎉 Winner Table (Now Same Width as Live Attendees) */}
      <div className="w-full p-6 md:p-10 bg-white shadow-lg rounded-3xl border border-gray-200">
        <WinnerTable raffleId={raffleId} />
      </div>
      <Copyright />
    </div>
  );
};

export default page;
