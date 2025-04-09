"use client";

import Navbar from "@/components/raffleDraw/Navbar";
import Copyright from "@/components/layouts/copyright/copyright";
import LuckySpins from "@/components/raffleDraw/Tables/spins.table";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
  const { eventId: raffleId } = useParams();

  const [luckyDraws, setLuckyDraws] = useState([]);
  const [attendance, setAttendance] = useState(0);

  // Fetch lucky draws from API
  useEffect(() => {
    if (!raffleId) return;

    const fetchSpinnAttendance = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/${raffleId}`
        );

        // Sort draws by the nearest start_time
        const sortedDraws = response?.data?.luckyDraws?.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );

        const liveAttendance = response?.data?.attendance.reduce(
          (accu, currVal) => accu + currVal.num_people,
          0
        );

        setAttendance(liveAttendance);

        setLuckyDraws(sortedDraws);
      } catch (error) {
        console.error("Error fetching lucky draws:", error);
      }
    };

    const interval = setInterval(fetchSpinnAttendance, 10000);
    fetchSpinnAttendance();

    return () => clearInterval(interval);
  }, [raffleId]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {/* Live Attendance Box at Top Center */}
        <div className="w-full flex justify-center pt-5 px-4">
          <div className="w-full max-w-md p-6 md:p-10 bg-white/20 backdrop-blur-lg shadow-lg rounded-3xl flex flex-col items-center justify-center border border-white/30">
            <div className="flex items-center gap-2.5">
              <span className="text-4xl font-bold text-red-500">•</span>
              <span className="text-2xl font-bold text-red-500">
                Live Attendees
              </span>
            </div>
            <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-lg">
              {attendance}
            </span>
          </div>
        </div>

        {/* LuckySpins Section */}
        <div className="w-full py-10 px-4 flex-grow">
          <LuckySpins
            luckyDraws={luckyDraws}
            setLuckyDraws={setLuckyDraws}
            raffleId={raffleId}
          />
        </div>

        {/* Table Section Full Width */}
        <div className="w-full px-4 pb-10">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-xl overflow-hidden">
              {/* table head and body */}
            </table>
          </div>
        </div>

        <Copyright />
      </div>
    </>
  );
};

export default Page;
