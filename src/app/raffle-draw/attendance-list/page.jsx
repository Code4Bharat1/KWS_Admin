import AttendanceList from "@/components/raffleDraw/attendance/AttendanceList";
import Copyright from "@/components/layouts/copyright/copyright";
import Navbar from "@/components/layouts/navbar/navbar";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>Loading attendance list...</div>}>
        <AttendanceList />
      </Suspense>
      <Copyright />
    </div>
  );
};

export default page;
