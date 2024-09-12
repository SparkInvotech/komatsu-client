// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGHK6aYjUwJke1B4YEPmaq66EgnHlsIUc",
  authDomain: "komatsu-server.firebaseapp.com",
  databaseURL:
    "https://komatsu-server-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "komatsu-server",
  storageBucket: "komatsu-server.appspot.com",
  messagingSenderId: "461959491251",
  appId: "1:461959491251:web:55d3b75b923b6544d3cac6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
