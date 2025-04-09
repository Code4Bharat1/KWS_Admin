"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import WinnerModal from "./WinnerModel";

const Spin = ({ participants, setWinner, winner, winnerData, setResult }) => {
  const [slotValues, setSlotValues] = useState(["0", "0", "0", "0", "0"]);
  const [spinningSlots, setSpinningSlots] = useState(new Array(5).fill(false));
  const [spinningLetter, setSpinningLetter] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("W");

  const [spinning, setSpinning] = useState(false);

  const getRandomID = () => {
    return participants[Math.floor(Math.random() * participants.length)];
  };

  const spinSlots = async () => {
    setSpinning(true);
    setSlotValues(["0", "0", "0", "0", "0"]);
    setSpinningLetter(true);

    // Pick a random ID from the provided list
    const randomID = getRandomID();
    const letter = randomID[0]; // First character (W or M)
    const digits = randomID.slice(1).split("");

    // Spin the letter slot
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSpinningLetter(false);
    setSelectedLetter(letter);

    // Spin number slots one by one
    for (let i = 0; i < digits.length; i++) {
      setSpinningSlots((prev) => {
        const updated = [...prev];
        updated[i] = true;
        return updated;
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSpinningSlots((prev) => {
        const updated = [...prev];
        updated[i] = false;
        return updated;
      });

      setSlotValues((prev) => {
        const updated = [...prev];
        updated[i] = digits[i];
        return updated;
      });
    }

    setResult("KWSK" + randomID);
    setWinner(true);
    setSpinning(false);
  };

  const slotAnimation = {
    spinning: {
      y: ["0%", "-100%"],
      transition: {
        duration: 0.1,
        repeat: Infinity,
        ease: "linear",
      },
    },
    stopped: {
      y: "0%",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-green-400 text-green-900">
      <motion.h1
        className="text-5xl font-extrabold mb-12"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        🎰 Lucky Draw 🎰
      </motion.h1>

      <motion.div
        className="flex space-x-4 mb-10 bg-white rounded-2xl p-6 shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <div className="relative w-24 h-24 border-4 border-green-600 rounded-lg flex items-center justify-center bg-green-100 text-5xl font-extrabold text-green-700">
          K
        </div>
        <div className="relative w-24 h-24 border-4 border-green-600 rounded-lg flex items-center justify-center bg-green-100 text-5xl font-extrabold text-green-700">
          <motion.div
            animate={{ rotate: spinningLetter ? [0, 180, 360] : 0 }}
            transition={
              spinningLetter
                ? { duration: 0.2, repeat: Infinity }
                : { duration: 0.5 }
            }
          >
            {spinningLetter
              ? Math.random() < 0.5
                ? "W"
                : "M"
              : selectedLetter}
          </motion.div>
        </div>

        {slotValues.map((digit, index) => (
          <div
            key={index}
            className="relative w-24 h-24 border-4 border-green-600 rounded-lg flex items-center justify-center bg-green-100 text-5xl font-extrabold text-green-700"
          >
            <motion.div
              variants={slotAnimation}
              animate={spinningSlots[index] ? "spinning" : "stopped"}
              className="absolute"
            >
              {spinningSlots[index] ? Math.floor(Math.random() * 10) : digit}
            </motion.div>
          </div>
        ))}
      </motion.div>

      <motion.button
        onClick={spinSlots}
        disabled={spinning || winner || !participants.length}
        className="px-8 py-4 text-xl bg-green-700 hover:bg-green-800 text-white rounded-xl shadow-lg transition-all disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {winner
          ? "Spinned"
          : spinning
          ? "Spinning..."
          : !participants.length
          ? "No Participants"
          : "Spin to Win"}
      </motion.button>

      <AnimatePresence>
        {winner && (
          <>
            <WinnerModal winnerData={winnerData} />
            <Confetti />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Spin;
