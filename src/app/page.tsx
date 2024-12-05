/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "./components/navbar";

import { useRouter } from "next/navigation";
import {
  auth,
  signInWithPopup,
  onAuthStateChanged,
  provider,
} from "../../firebaseConfig";

const HomePage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // Adjust the user type as needed

  useEffect(() => {
    // Camera access logic
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Error accessing camera: ", err);
        if (err.name === "NotAllowedError") {
          alert(
            "Camera access was denied. Please allow camera permissions in browser settings."
          );
        } else if (err.name === "NotFoundError") {
          alert("No camera device found. Please connect a camera.");
        } else {
          alert("An unknown error occurred: " + err.message);
        }
      }
    };

    startCamera();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleStartNow = async () => {
    if (user) {
      router.push("/interview"); // Navigate to the interview page if logged in
    } else {
      try {
        await signInWithPopup(auth, provider); // Sign in with Google
        router.push("/interview"); // Navigate to the interview page after login
      } catch (err) {
        console.error("Error logging in: ", err);
        alert("Failed to log in. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Trainee Interview</h1>
        <div className="w-full max-w-5xl bg-[#1A1E35] p-6 rounded-md shadow-lg flex flex-col lg:flex-row items-start">
          {/* Left Panel: Video Stream */}
          <div className="flex-1 bg-[#0B0D17] border border-[#303952] rounded-md h-64 lg:h-auto relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Right Panel */}
          <div className="flex-1 lg:ml-6 mt-6 lg:mt-0">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>
                Ensure stable internet and choose a clean, quiet location.
              </li>
              <li>
                Permission for access to camera, microphone, and screen sharing
                is required.
              </li>
              <li>Be in professional attire and avoid distractions.</li>
              <li>
                Give a detailed response, providing as much information as you
                can.
              </li>
              <li>
                Answer the question with examples and projects you’ve worked on.
              </li>
            </ol>

            <a href="#" className="text-blue-500 text-sm underline mt-4 block">
              Click here to try a mock interview with Avya, our AI interviewer,
              and build your confidence before the main interview!
            </a>
          </div>
        </div>
        <button
          onClick={handleStartNow}
          className="mt-6 bg-[#3B82F6] px-6 py-3 rounded-md text-sm font-medium hover:bg-[#2563EB] transition"
        >
          Start Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;
