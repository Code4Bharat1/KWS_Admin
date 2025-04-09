import { Suspense } from "react";

import ViewTicket from "@/components/raffleDraw/tickets/viewTicket";
import Copyright from "@/components/layouts/copyright/copyright";
import Navbar from "@/components/layouts/navbar/navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <Navbar />
      <ViewTicket />
      <Copyright />
    </div>
  );
};

export default page;
