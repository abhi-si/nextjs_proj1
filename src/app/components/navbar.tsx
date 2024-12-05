/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { auth, signInWithPopup, provider } from "../../../firebaseConfig"; // Use the provider imported from firebaseConfig

const Navbar = () => {
  const handleLogin = async () => {
    try {
      // Trigger Google sign-in popup using the imported provider
      await signInWithPopup(auth, provider);
      // If successful, you can redirect or handle the user state
      console.log("User logged in successfully");
    } catch (err: any) {
      console.error("Error logging in: ", err);
      alert("Failed to log in. Please try again.");
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-semibold">Zeko AI</div>
      <div>
        <button
          onClick={handleLogin} // Add the onClick handler
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition"
        >
          Login / SignUp
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
