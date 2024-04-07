import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

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
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
export const token = getToken(messaging, {
  vapidKey:
    "BN_Xiy-m8C2C6deXMpU1HWTf0sM29X64zEBn6z1t5mSBdpaZ2Z0lM1U0Qz7ITCHTuUcn4_Smb5wT6bPNO8d7BGc",
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      // ...
      console.log(currentToken);
      return currentToken;
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
      // ...
    }
  })
  .catch((err) => {
    console.log(`An error occurred while retrieving token - ${err}`);
    // ...
  });

// onMessage(messaging, (payload) => {
//   console.log('Message received. ', payload);
//   // ...
// });

// onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
