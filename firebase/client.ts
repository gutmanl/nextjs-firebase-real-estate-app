// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const apiKey = "AIzaSyDMvNeFvnFKWA97PX_cvCOX_vKqewmy58E";

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "nextjs-15-and-firebase-6d96e.firebaseapp.com",
    projectId: "nextjs-15-and-firebase-6d96e",
    storageBucket: "nextjs-15-and-firebase-6d96e.firebasestorage.app",
    messagingSenderId: "1045152423994",
    appId: "1:1045152423994:web:05a82e40370769c31b5503"
};

// Initialize Firebase
const currentApps  : FirebaseApp[] = getApps();

const app =
  currentApps && currentApps.length ?
      currentApps[0] :
      initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

export { auth, storage, apiKey };

