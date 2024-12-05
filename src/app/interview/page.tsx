"use client"; // Enable client-side rendering

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";

const InterviewPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState<number>(0); // Track the current step
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [heardSound, setHeardSound] = useState<boolean | null>(null); // For speaker check
  const [checkStatus, setCheckStatus] = useState({
    camera: false,
    audio: false,
    speaker: false,
    screenShare: false,
  }); // Track the status of each check
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Track audio playing status

  const router = useRouter();

  // Camera permission check
  const handleCameraCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCheckStatus((prevState) => ({ ...prevState, camera: true }));
      setStep(2); // Move to the next step (audio check)
    } catch (err: any) {
      setErrorMessage("Camera access was denied or not available.");
    }
  };

  // Audio check
  const handleAudioCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setCheckStatus((prevState) => ({ ...prevState, audio: true }));
      setStep(3); // Move to the next step (speaker check)
    } catch (err: any) {
      setErrorMessage("Audio access was denied or not available.");
    }
  };

  // Speaker check
  const handleSpeakerCheck = () => {
    if (audioRef.current && !isAudioPlaying) {
      audioRef.current.play();
      setIsAudioPlaying(true); // Set audio playing status to true
    }
  };

  const handleAnswer = (answer: boolean) => {
    setHeardSound(answer);
    setCheckStatus((prevState) => ({ ...prevState, speaker: answer }));
    setIsAudioPlaying(false); // Stop the audio after confirming
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the audio
      audioRef.current.currentTime = 0; // Reset the audio to the beginning
    }

    // Move to the next step (screen share check)
    setStep(4);
  };

  // Screen share check
  const handleScreenShareCheck = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      if (stream) {
        alert("Screen sharing started successfully!");
        setCheckStatus((prevState) => ({ ...prevState, screenShare: true }));
        setStep(5); // All checks passed, proceed
      }
    } catch (err) {
      setErrorMessage("Screen sharing was denied. Please enable it.");
    }
  };

  const handleBack = () => {
    router.push("/"); // Go back to the home page
  };

  const handleStartInterview = () => {
    router.push("/instructions");
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Ready to Proceed</h1>
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

          {/* Right Panel: Check Steps */}
          <div className="flex-1 lg:ml-6 mt-6 lg:mt-0">
            <div className="flex flex-col gap-6 mb-6">
              {/* Camera Check */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    checkStatus.camera ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p>Camera Check</p>
              </div>

              {/* Audio Check */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    checkStatus.audio ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p>Audio Check</p>
              </div>

              {/* Speaker Check */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    checkStatus.speaker ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p>Speaker Check</p>
              </div>

              {/* Screen Share Check */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full ${
                    checkStatus.screenShare ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <p>Screen Share Check</p>
              </div>
            </div>

            {step === 0 && (
              <>
                <p className="text-sm">Proceed to begin the checks.</p>
                <button
                  onClick={handleCameraCheck}
                  className="mt-6 bg-[#3B82F6] px-6 py-3 rounded-md text-sm font-medium hover:bg-[#2563EB] transition"
                >
                  Start Camera Check
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-sm">
                  Camera check passed. Now, proceed with audio check.
                </p>
                <button
                  onClick={handleAudioCheck}
                  className="mt-6 bg-[#3B82F6] px-6 py-3 rounded-md text-sm font-medium hover:bg-[#2563EB] transition"
                >
                  Start Audio Check
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col items-center justify-center p-4">
                  <h2 className="text-xl font-semibold mb-4">Speaker Check</h2>
                  <button
                    onClick={handleSpeakerCheck}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
                  >
                    Test Sound
                  </button>

                  {heardSound === null && (
                    <div className="mt-4">
                      <p className="mb-2">Did you hear the sound?</p>
                      <button
                        onClick={() => handleAnswer(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                      >
                        No
                      </button>
                    </div>
                  )}
                  {heardSound !== null && (
                    <p
                      className={`mt-4 ${
                        heardSound ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {heardSound
                        ? "Great! You're ready for the interview!"
                        : "Please check your speakers and try again."}
                    </p>
                  )}

                  <audio ref={audioRef} src="/test-sound.mp3" preload="auto" />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-sm">
                  Speaker check passed. Now, proceed with screen share check.
                </p>
                <button
                  onClick={handleScreenShareCheck}
                  className="mt-6 bg-[#3B82F6] px-6 py-3 rounded-md text-sm font-medium hover:bg-[#2563EB] transition"
                >
                  Start Screen Share Check
                </button>
              </>
            )}

            {step === 5 && (
              <div>
                <p className="text-sm">
                  All checks completed successfully! You can now proceed with
                  the interview.
                </p>
                <button
                  className="mt-6 bg-[#3B82F6] px-6 py-3 rounded-md text-sm font-medium 
                hover:bg-[#2563EB] transition"
                  onClick={handleStartInterview}
                >
                  Start Interview
                </button>
              </div>
            )}

            {errorMessage && (
              <p className="mt-6 text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
