import React from "react";
import { motion } from "framer-motion";

const WinnerModel = ({ winnerData }) => {
  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 top-[128px] bg-black bg-opacity-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-extrabold mb-4">🎉 Winner 🎉</h2>
        <p className="text-2xl font-semibold mb-2">Name: {winnerData?.name}</p>
        <p className="text-2xl font-semibold">
          KWS ID: {winnerData?.kwsid || winnerData?.kws_id}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WinnerModel;
