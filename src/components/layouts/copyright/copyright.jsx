import React from "react";

const Copyright = () => {
  return (
    <footer className="bg-[#DDFFBC] text-center py-4 shadow-md">
      <p className="text-black text-sm font-medium">
        Copyright © {new Date().getFullYear()}{" "}
        <span className="text-black font-bold">Kokan Welfare Society</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Copyright;
