// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCtTHl1hd2RiAP0YR5-stZjDv1m5jxAehY",
  authDomain: "nextjsproj1.firebaseapp.com",
  projectId: "nextjsproj1",
  storageBucket: "nextjsproj1.firebasestorage.app",
  messagingSenderId: "845290442799",
  appId: "1:845290442799:web:5fd68215192690dbf936da",
  measurementId: "G-6X2CZJDS5G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Export necessary functions and providers
const provider = new GoogleAuthProvider();

export { auth, signInWithPopup, onAuthStateChanged, provider };
