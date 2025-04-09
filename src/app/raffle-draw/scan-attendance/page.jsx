import ScanAttendance from "@/components/raffleDraw/attendance/scan-attendance";
import Copyright from "@/components/layouts/copyright/copyright";
import Navbar from "@/components/layouts/navbar/navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <ScanAttendance />
      <Copyright />
    </div>
  );
};

export default page;
