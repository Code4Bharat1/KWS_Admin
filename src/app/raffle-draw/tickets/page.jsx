import RaffleTickets from "@/components/raffleDraw/tickets/Tickets.raffle";
import Copyright from "@/components/layouts/copyright/copyright";
import Navbar from "@/components/layouts/navbar/navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <RaffleTickets />
      <Copyright />
    </div>
  );
};

export default page;
