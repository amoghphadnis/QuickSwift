import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {

  apiKey: "AIzaSyAuxSIUbWffyqo4Z4BJv4N52XgbJUNV0Fg",
  authDomain: "quickswift-delivery.firebaseapp.com",
  databaseURL: "https://quickswift-delivery-default-rtdb.firebaseio.com",
  projectId: "quickswift-delivery",
  storageBucket: "quickswift-delivery.firebasestorage.app",
  messagingSenderId: "115587492327",
  appId: "1:115587492327:web:66ed4e9ed8c32408607542",
  measurementId: "G-99CFM3XN1X"

}


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);         
const storage = getStorage(app);  
const db = getFirestore(app); 

export { auth, storage,db };
