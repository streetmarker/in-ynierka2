importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/9.2.0');
importScripts('/__/firebase/init.js');
// import "firebase/firestore";
// import "firebase/auth";
// importScripts('/__/firebase/9.2.0/firebase')

// importScripts('../firebaseInitializer.js');
// webpack://tutor-app/firebaseInitializer.js
// import { db, auth} from "../firebaseInitializer";
// import { collection, addDoc } from "firebase/firestore";

const messaging = firebase.messaging();
// const db = app.firestore();
// const auth = app.auth();


messaging.onBackgroundMessage(async function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '../assets/logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
