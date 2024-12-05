"use client"; // Enable client-side rendering

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const QuestionPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks: Blob[] = []; // To store recorded data

  const [questions] = useState([
    "What is your biggest strength?",
    "Describe a challenging project you've worked on.",
    "What motivates you at work?",
    "Tell us about a time you failed and how you handled it.",
    "Why do you want to join our company?",
    "Where do you see yourself in 5 years?",
    "What are your technical skills?",
    "Describe your leadership style.",
    "What makes you different from other candidates?",
    "What do you do to stay updated in your field?",
  ]); // Static questions array

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // Timer for 1 minute
  const [isRecording, setIsRecording] = useState(false); // To manage recording state

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestionIndex < questions.length - 1) {
      handleSaveAndNext(); // Auto move to next question when time is up
    }
  }, [timeLeft, currentQuestionIndex]); // Re-run on timeLeft and currentQuestionIndex change

  useEffect(() => {
    // Start live video feed
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices", err);
      }
    };
    startVideo();

    return () => {
      // Stop video feed on component unmount
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    // Read the current question using SpeechSynthesis API
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      questions[currentQuestionIndex]
    );
    synth.speak(utterance);
  }, [currentQuestionIndex]); // Trigger whenever the question changes

  const startRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoURL = URL.createObjectURL(blob);
        console.log("Recorded video URL:", videoURL); // You can upload this blob to the server
      };
    }
  };

  const handleSaveAndNext = () => {
    stopRecording(); // Stop the recording for the current question
    setCurrentQuestionIndex((prev) => prev + 1); // Move to next question
    setTimeLeft(60); // Reset timer for the next question
    if (currentQuestionIndex >= questions.length - 1) {
      router.push("/"); // Navigate to the home page after the last question
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">
        Question {currentQuestionIndex + 1}/10
      </h1>
      <p className="text-lg mb-4">{questions[currentQuestionIndex]}</p>

      {/* Video Preview */}
      <div className="mb-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-80 h-60 border-2 border-blue-500 rounded-lg"
        />
      </div>

      {/* Timer */}
      <p className="text-lg font-semibold mb-4">Time Left: {timeLeft}s</p>

      {/* Controls */}
      <div className="flex space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md"
          >
            Stop Recording
          </button>
        )}
        <button
          onClick={handleSaveAndNext}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md"
        >
          {currentQuestionIndex === questions.length - 1
            ? "Submit"
            : "Save & Next"}
        </button>
      </div>
    </div>
  );
};

export default QuestionPage;
