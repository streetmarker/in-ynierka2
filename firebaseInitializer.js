import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyBtt46_fY2yH8X3hsn69BUoeo95qqriTUY",
  authDomain: "justfirstsite.firebaseapp.com",
  databaseURL:
    "https://justfirstsite-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "justfirstsite",
  storageBucket: "justfirstsite.appspot.com",
  messagingSenderId: "169829791352",
  appId: "1:169829791352:web:c3b4fd24828eef92719f8d",
  measurementId: "G-DF53F33B5K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
