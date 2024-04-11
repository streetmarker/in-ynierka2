import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from './src/store/index';


// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_APP_DOMAIN,
  databaseURL:
    process.env.VUE_APP_DATABASE_URL
  ,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// console.log(auth);
// Initialize the FirebaseUI Widget using Firebase.
export var ui = new firebaseui.auth.AuthUI(auth);
// console.log(firebase);
ui.start('#firebaseui-auth-container', {
  // signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // Process result. This will not trigger on merge conflicts.
      // On success redirect to signInSuccessUrl.
      let formatData = {
        fullName: authResult.user.displayName,
        email: authResult.user.email,
        photo: authResult.user.photoURL,
        provider: authResult.user.providerData.providerId
      }
      console.log(redirectUrl);
      store.commit('setUser', formatData);
      // console.log(JSON.stringify(authResult, null, 2)+'||||'+redirectUrl);

      return false;
    },
    // signInFailure callback must be provided to handle merge conflicts which
    // occur when an existing credential is linked to an anonymous user.
    // signInFailure: function(error) {
    //   // For merge conflicts, the error.code will be
    //   // 'firebaseui/anonymous-upgrade-merge-conflict'.
    //   if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
    //     return Promise.resolve();
    //   }
    //   // The credential the user tried to sign in with.
    //   var cred = error.credential;
    //   // If using Firebase Realtime Database. The anonymous user data has to be
    //   // copied to the non-anonymous user.
    //   var app = firebase.app();
    //   // Save anonymous user data first.
    //   return app.database().ref('users/' + firebase.auth().currentUser.uid)
    //       .once('value')
    //       .then(function(snapshot) {
    //         data = snapshot.val();
    //         // This will trigger onAuthStateChanged listener which
    //         // could trigger a redirect to another page.
    //         // Ensure the upgrade flow is not interrupted by that callback
    //         // and that this is given enough time to complete before
    //         // redirection.
    //         return firebase.auth().signInWithCredential(cred);
    //       })
    //       .then(function(user) {
    //         // Original Anonymous Auth instance now has the new user.
    //         return app.database().ref('users/' + user.uid).set(data);
    //       })
    //       .then(function() {
    //         // Delete anonymnous user.
    //         return anonymousUser.delete();
    //       }).then(function() {
    //         // Clear data in case a new user signs in, and the state change
    //         // triggers.
    //         data = null;
    //         // FirebaseUI will reset and the UI cleared when this promise
    //         // resolves.
    //         // signInSuccessWithAuthResult will not run. Successful sign-in
    //         // logic has to be run explicitly.
    //         window.location.assign('<url-to-redirect-to-on-success>');
    //       });

    // }
  }
});

// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     console.log(user);
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(error);
//   });
// No redirect URL has been found. You must either specify a signInSuccessUrl 
// in the configuration, pass in a redirect URL to the widget URL, or return 
// false from the callback.  Dismiss
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed up 
//     const user = userCredential.user;
//     console.log(user);
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(error);
//   });

// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     console.log(user);
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(error);
//   });

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

onMessage(messaging, (payload) => {
  console.log(`Message received: ${payload}`);
  appendMessage(payload);
});

// Add a message to the messages element.
function appendMessage(payload) {
  showNotification(
    payload.notification.title,
    payload.notification.body,
    payload.notification.image
  );
}

function showNotification(title, body, image) {
  const notificationBar = document.getElementById("notificationBar");
  const notificationContent = document.createElement("div");
  const imageElement = document.createElement("img");
  imageElement.src = image;
  const textElement = document.createElement("span");
  textElement.textContent = `${title}: ${body}`;
  notificationContent.appendChild(imageElement);
  notificationContent.appendChild(textElement);
  notificationBar.innerHTML = "";
  notificationBar.appendChild(notificationContent);
  notificationBar.style.display = "block";
  setTimeout(() => {
    notificationBar.style.display = "none";
  }, 5000);
}