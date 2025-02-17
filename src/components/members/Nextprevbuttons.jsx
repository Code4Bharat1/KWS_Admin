"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
const Nextprevbuttons = () => {
      const router = useRouter();
        const searchParams = useSearchParams();
      
      const userId = searchParams.get("id"); 

      const handleNext = () => {
        const nextId = parseInt(userId) + 1;
        router.push(`/members/edit-member?id=${nextId}`);
      };
    
      const handlePrevious = () => {
        const prevId = parseInt(userId) - 1;
        router.push(`/members/edit-member?id=${prevId}`);
      };
  return (
    <div>
  <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Next
            </button>
          </div>
    </div>
  )
}

export default Nextprevbuttons;