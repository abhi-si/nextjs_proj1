"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const InstructionsPage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/question"); // Route to the question screen
  };

  useEffect(() => {
    // Trigger fullscreen mode when the page loads
    const enterFullScreen = async () => {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    };

    enterFullScreen();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Interview Instructions</h1>
      <p className="text-lg mb-4">
        Please follow the instructions carefully before starting the interview.
      </p>
      <ul className="text-left mb-6">
        <li>1. You will have limited time to answer each question.</li>
        <li>2. Follow the on-screen instructions for recording answers.</li>
      </ul>
      <button
        onClick={handleNext}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-md"
      >
        Proceed to Questions
      </button>
    </div>
  );
};

export default InstructionsPage;
