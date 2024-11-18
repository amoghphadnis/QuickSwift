import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {

  apiKey: "AIzaSyBhJJvdVsh1tAldUGQcp-S0ZOR7sf843o8",
  authDomain: "quickswiftproject.firebaseapp.com",
  projectId: "quickswiftproject",
  storageBucket: "quickswiftproject.firebasestorage.app",
  messagingSenderId: "638754807792",
  appId: "1:638754807792:web:b0231c16ba6d3d1fd08735"

}


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);         
const storage = getStorage(app);  
const db = getFirestore(app); 

export { auth, storage,db };
