import AttendanceList from "@/components/raffleDraw/attendance/AttendanceList";
import Copyright from "@/components/layouts/copyright/copyright";
import Navbar from "@/components/layouts/navbar/navbar";

const page = () => {
  return (
    <div>
      <Navbar />
      <AttendanceList />
      <Copyright />
    </div>
  );
};

export default page;
