"use client";

import Navbar from "@/components/raffleDraw/Navbar";
import Copyright from "@/components/layouts/copyright/copyright";
import WinnerTable from "@/components/raffleDraw/Tables/winner.table";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PageContent = () => {
  const searchParams = useSearchParams();
  const raffleId = searchParams.get("id");

  return (
    <div className="w-full p-6 md:p-10 bg-white shadow-lg rounded-3xl border border-gray-200">
      <WinnerTable raffleId={raffleId} />
    </div>
  );
};

const Page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading winner data...</div>}>
        <PageContent />
      </Suspense>
      <Copyright />
    </div>
  );
};

export default Page;
