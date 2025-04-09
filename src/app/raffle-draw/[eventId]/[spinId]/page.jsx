"use client";

import Spin from "@/components/raffleDraw/luckySpin/spin";
import Navbar from "@/components/raffleDraw/Navbar";
import Copyright from "@/components/layouts/copyright/copyright";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
  const { eventId: raffleId, spinId } = useParams();

  const [attendees, setAttendees] = useState([]);
  const [winner, setWinner] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [result, setResult] = useState(null);
  const [prize, setPrize] = useState("");

  const participants = attendees
    ?.filter((person) => person.kws_id?.length === 10)
    .map((person) => person.kws_id.slice(4));

  // Fetch attendees on mount
  useEffect(() => {
    if (!raffleId) return;

    const fetchSpinnAttendance = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/${raffleId}`
        );

        const fetchPrize = response?.data?.luckyDraws?.filter(
          (draw) => Number(draw.id) === Number(spinId)
        );

        setPrize(fetchPrize[0]?.prize);

        setAttendees(response.data.attendance);
      } catch (error) {
        console.error("Error fetching Participants:", error);
      }
    };

    fetchSpinnAttendance();
  }, [raffleId, spinId, winner]);

  // Fetch winner
  useEffect(() => {
    if (!spinId || isNaN(Number(spinId))) return;

    const fetchSpinnAttendance = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/winner/${spinId}`
        );

        const winner = response?.data?.winner;

        if (!winner) {
          return;
        }

        setWinnerData(winner);
        setWinner(true);
      } catch (error) {
        console.error(
          "Error fetching winner:",
          error?.response?.data || error.message
        );
      }
    };

    fetchSpinnAttendance();
  }, [spinId]);

  // Update lucky draw winner when a winner is chosen
  useEffect(() => {
    if (!spinId || !winner || !result) return;

    const winnerDetails = attendees.filter((a) => a.kws_id === result);
    setWinnerData(winnerDetails[0]);

    const updateLuckyDraw = async () => {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_API_KEY}/raffle/${spinId}`,
          {
            winnerData: winnerData,
            prize,
            attendees,
          }
        );
      } catch (error) {
        console.error("Error updating lucky draw:", error);
      }
    };

    updateLuckyDraw();
  }, [winner, spinId, attendees, result]);

  return (
    <>
      <Navbar />
      <Spin
        participants={participants}
        setWinner={setWinner}
        winner={winner}
        winnerData={winnerData}
        result={result}
        setResult={setResult}
      />
      <Copyright />
    </>
  );
};

export default Page;
