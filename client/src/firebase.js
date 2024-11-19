// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuxSIUbWffyqo4Z4BJv4N52XgbJUNV0Fg",
  authDomain: "quickswift-delivery.firebaseapp.com",
  databaseURL: "https://quickswift-delivery-default-rtdb.firebaseio.com",
  projectId: "quickswift-delivery",
  storageBucket: "quickswift-delivery.firebasestorage.app",
  messagingSenderId: "115587492327",
  appId: "1:115587492327:web:66ed4e9ed8c32408607542",
  measurementId: "G-99CFM3XN1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);