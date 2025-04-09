import Copyright from "@/components/layouts/copyright/copyright";
import Navbar from "@/components/layouts/navbar/navbar";
import RaffleDraws from "./RaffleDraws";

const page = () => {
  return (
    <div>
      <Navbar />
      <RaffleDraws />
      <Copyright />
    </div>
  );
};

export default page;
