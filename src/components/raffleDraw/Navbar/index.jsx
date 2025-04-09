"use client";

import Link from "next/link";
import { ExitToApp, Home } from "@mui/icons-material";
import { useParams } from "next/navigation";

export default function Navbar() {
  const { eventId, spinId } = useParams();
  return (
    <header className="bg-white shadow-md z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4 md:p-6 lg:px-8"
      >
        {/* Logo Section */}
        <div className="flex flex-1">
          <div className="-m-1.5 p-1.5 flex items-center">
            <span className="sr-only">Your Company</span>
            <img
              alt="KWS Logo"
              src="/kws.png"
              className="h-14 w-auto sm:h-16 md:h-20"
            />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-widest bg-gradient-to-r from-[#86b663] to-[#A8D5BA] text-transparent bg-clip-text drop-shadow-md text-center md:flex-1 whitespace-nowrap text-ellipsis px-4 md:px-8 lg:px-12">
          KOKAN WELFARE SOCIETY
        </div>

        {/* Navigation Icon */}
        <div className="md:flex md:flex-1 md:justify-end">
          {spinId ? (
            <Link
              className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200"
              href={`/raffle-draw/${eventId}`}
            >
              <Home className="sm:h-7 sm:w-7 md:h-10 md:w-10 lg:h-12 lg:w-12 text-gray-700 hover:text-gray-900" />
            </Link>
          ) : (
            <Link
              className="p-2 rounded-full transition-all duration-300 hover:bg-gray-200"
              href="/raffle-draw"
            >
              <ExitToApp className="h-6 w-6 sm:h-7 sm:w-7 md:h-10 md:w-10 text-gray-700 hover:text-gray-900" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
