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
  // setTimeout(() => {
  //   appendMessage(payload);
  //   let data = {
  //     recipientId: auth.currentUser, // TODO change to id
  //     text: payload.notification.title, // TODO change text only
  //     status: 'recived'
  //   };
  // }, 5000);
  // await db.collection('notification').doc(new Date()).set(data)
  // Customize notification here
  // const notificationTitle = 'Background Message Title';
  // const notificationOptions = {
  //   body: 'Background Message body.',
  //   icon: '/firebase-logo.png'
  // };

  // self.registration.showNotification(notificationTitle,
  //   notificationOptions);
});

