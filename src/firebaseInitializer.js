import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from './store/index';
import { doc, getDoc, setDoc } from "firebase/firestore";
import Loader from '../public/loader'
import * as idb from './idb'

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
console.log(idb);
var dbPromise  = idb.open('tutors', 1, function (db) {
  if (!db.objectStoreNames.contains('tutor')){
    db.createObjectStore('tutor', {keyPath: 'id'})
  }
})
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize the FirebaseUI Widget using Firebase.
export var ui = new firebaseui.auth.AuthUI(auth);

console.log('test change file SW - 15');

export const token = getToken(messaging, {
  vapidKey:
    process.env.VUE_APP_VAPID_KEY,
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


async function startUi() {
  // document.getElementById('loading').style.display = 'initial';
  // modalLoading.init(true);
  Loader.open();

  setTimeout(() => {
    // console.log("start ui:", auth.currentUser);
    if (auth.currentUser) {
      let formatDataLogged = {
        id: auth.currentUser.uid,
        fullName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photo: auth.currentUser.photoURL,
        provider: auth.currentUser.providerData.providerId,
        // role:
      }
      store.commit('setUser', formatDataLogged);
      // dbPromise.then(function(db) {
      //   var tx = db.transaction('tutor', 'readwrite');
      //   var store = tx.objectStore('tutor');
      //   store.put(formatDataLogged);
      //   return tx.complete;
      // })
      (async () => {
        try {
      var dbPromiseIn = await dbPromise;
      var tx = dbPromiseIn.transaction('tutor', 'readwrite');
      var storeDb = tx.objectStore('tutor');
      storeDb.put(formatDataLogged);
      console.log('add to idb: ',tx.complete);
    } catch (error) {
      console.error('Błąd podczas pobierania roli z Firestore:', error);
    }
  })();

        (async () => {
        try {
          const roleFromFirestore = await getUserRoleFirebase(auth.currentUser.uid);
          store.commit('setUserRole', { type: roleFromFirestore, loggedIn: true });
        } catch (error) {
          console.error('Błąd podczas pobierania roli z Firestore:', error);
        }
      })();

      document.getElementById('sign-out').style.display = 'initial';
      document.getElementById('sign-in').style.display = 'none';
    } else {
      ui.start('#firebaseui-auth-container', {
        // signInSuccessUrl: '/',
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // Process result. This will not trigger on merge conflicts.
            // On success redirect to signInSuccessUrl.
            let uid = authResult.user.uid;
            let formatData = {
              id: uid,
              fullName: authResult.user.displayName,
              email: authResult.user.email,
              photo: authResult.user.photoURL,
              provider: authResult.user.providerData.providerId
            }
            // console.log('STATE TMP ROLE', store.getters.getTmpRole);
            let tmpRole = store.getters.getTmpRole; // first time login
            (async () => {
              try {
                const roleFromFirestore = await getUserRoleFirebase(uid); // pobieramy by porównać dane na front i w db

                if (tmpRole.length == 0 || tmpRole != roleFromFirestore) { // sprawdzenie czy zaznaczono jak w db jeżeli jest i uzupełnienie
                  store.commit('setUserRole', { type: roleFromFirestore, loggedIn: true });
                }
                else {
                  store.commit('setUserRole', { type: tmpRole, loggedIn: true });
                }
              } catch (error) {
                console.error('Błąd podczas pobierania roli z Firestore:', error);
                store.commit('setUserRole', { type: tmpRole, loggedIn: true });
              }
            })();

            insertUserFirestore(uid, authResult, tmpRole);

            store.commit('setUser', formatData);

            document.getElementById('sign-out').style.display = 'initial';
            document.getElementById('sign-in').style.display = 'none';

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
    }
    // TUTOR ONLY PART
    // TODO
    // const userRole = store.getters.getUserRole;
    // if (userRole.type == 'T') {
    //   (async () => {
    //     try {
    //       const tutorData = await getTutorFirebase(uid);
    //       store.commit('setTutor', tutorData);
    //       if (tutorData.active == false) {
    //         router.push('/tutor-register'); // TODO blokada routingu
    //       }
    //     } catch (error) {
    //       console.error('Błąd podczas pobierania tutor z Firestore:', error);
    //     }
    //   })();
    // }
    //
    Loader.close();
  }, 4000);
}
async function insertUserFirestore(uid, authResult, tmpRole) {
  const docRef = doc(db, "user", uid);
  const docSnap = await getDoc(docRef);
  console.log('docSnap: ', docSnap);
  if (!!docSnap._document) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    let data = {
      id: uid,
      fullName: authResult.user.displayName,
      email: authResult.user.email,
      registerDate: new Date(),
      role: tmpRole
    };
    setDoc(doc(db, "user", uid), data);
  }
}
async function getUserRoleFirebase(uid) {
  const docRef = doc(db, "user", uid); // get saved role
  const docSnap = await getDoc(docRef);
  console.log('get user role: ', docSnap.data());
  return docSnap.data().role
}
async function getTutorFirebase(uid) { // pobranie po userId
  const docRef = doc(db, "tutor", uid); // get saved role
  const docSnap = await getDoc(docRef);
  console.log('get tutor: ', docSnap.data());
  return docSnap.data()
}
var initApp = function () {
  // document.getElementById('sign-in-with-redirect').addEventListener(
  //     'click', signInWithRedirect);
  // document.getElementById('sign-in-with-popup').addEventListener(
  //     'click', signInWithPopup);
  document.getElementById('sign-out').addEventListener('click', function () {
    auth.signOut();
    // let user = {
    //   id: "",
    //   fullName: "",
    //   email: "",
    //   photo: "",
    //   provider: ""
    // }
    // store.commit('setUser', user); // TO DEL
    store.commit('resetUser');
    store.commit('setUserRole', { type: '', loggedIn: false });

    document.getElementById('sign-out').style.display = 'none';
    document.getElementById('sign-in').style.display = 'initial';
    auth.signOut();
    startUi();
  });
  document.getElementById('sign-out').style.display = 'none';
  document.getElementById('sign-in').style.display = 'initial';
  // document.getElementById('delete-account').addEventListener(
  //     'click', function() {
  //       deleteAccount();
  //     });

  // document.getElementById('recaptcha-normal').addEventListener(
  //     'change', handleConfigChange);
  // document.getElementById('recaptcha-invisible').addEventListener(
  //     'change', handleConfigChange);
  // // Check the selected reCAPTCHA mode.
  // document.querySelector(
  //     'input[name="recaptcha"][value="' + getRecaptchaMode() + '"]')
  //     .checked = true;

  // document.getElementById('email-signInMethod-password').addEventListener(
  //     'change', handleConfigChange);
  // document.getElementById('email-signInMethod-emailLink').addEventListener(
  //     'change', handleConfigChange);
  // // Check the selected email signInMethod mode.
  // document.querySelector(
  //     'input[name="emailSignInMethod"][value="' + getEmailSignInMethod() + '"]')
  //     .checked = true;
  // document.getElementById('email-disableSignUp-status').addEventListener(
  //     'change', handleConfigChange);
  // document.getElementById("email-disableSignUp-status").checked =
  //     getDisableSignUpStatus();  
  // document.getElementById('admin-restricted-operation-status').addEventListener(
  //     'change', handleConfigChange);
  // document.getElementById("admin-restricted-operation-status").checked =
  //     getAdminRestrictedOperationStatus();  
};
startUi();
window.addEventListener('load', initApp);



onMessage(messaging, async (payload) => {
  console.log(`Message received: ${payload}`);
  setTimeout(() => {
    appendMessage(payload);
    let date = new Date().toLocaleString()
    let data = {
      recipientId: auth.currentUser.uid,
      recipientFullName: auth.currentUser.fullName,
      text: payload.notification.title,
      status: 'recived',
      reciveDate: date
    };
    setDoc(doc(db, "notification", date), data);
  }, 5000);
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