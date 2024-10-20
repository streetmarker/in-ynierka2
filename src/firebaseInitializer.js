import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from './store/index';
import { doc, addDoc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import Loader from '../public/loader'
import * as idb from './idb'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import router from "./router/index";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { trace } from "firebase/performance";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


Loader.open();
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592

export const env = process.env.NODE_ENV;

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
// IDB //////////////////////////
export const dbPromiseTutors = idb.open('tutor', 1, function (db) { // TODO globalne funkcje obsługi idb
  if (!db.objectStoreNames.contains('tutor')) {
    db.createObjectStore('tutor', { keyPath: 'id' });
  }
})
export const dbPromiseVisits = idb.open('visit', 1, function (db) { // TODO del on logout
  if (!db.objectStoreNames.contains('visit')) {
    db.createObjectStore('visit', { keyPath: 'id' });
  }
})

export const getIdbData = async (dbPromise) => {
  try {
    const dbPromiseGet = await dbPromise;
    const dbName = dbPromiseGet.name;
    return new Promise((resolve, reject) => {
      const transaction = dbPromiseGet.transaction([dbName], 'readonly');
      const objectStore = transaction.objectStore(dbName);
      const request = objectStore.getAll();

      resolve(request)
      // request.then((e) => {
      //   return e
      // })
    });

  } catch (error) {
    console.log('eror', error);
  }
};
export const putIdbData = async (dbPromise, dataArray) => {
  var dbPromiseIn = await dbPromise;
  const dbName = dbPromiseIn.name;
  var tx = dbPromiseIn.transaction(dbName, 'readwrite');
  var storeDb = tx.objectStore(dbName);
  dataArray.forEach(el => {
    storeDb.put(el);
  });
};
export const deleteIdbData = async (dbPromise) => { // TODO coś lepszego
  var dbPromiseIn = await dbPromise;
  const dbName = dbPromiseIn.name;
  idb.delete(dbName)
}
export const isUpdated = async (dbPromise, idbData) => { // TODO coś mniej podatnego na błąd
  var dbPromiseIn = await dbPromise;
  const dbData = getIdbData(dbPromiseIn);
  const dbName = dbPromiseIn.name;
  // const res = null;

  const querySnapshot = await getDocs(collection(db, dbName));
  // querySnapshot.forEach((doc) => {
  //   res.push(doc.data())
  // });
  // console.log('len', querySnapshot.docs.length != idbData.length,  querySnapshot.docs.length, idbData.length);
  if (querySnapshot.docs.length != idbData.length) {
    console.log('isUpdated:update:', dbData);
    return true
  }
  else {
    console.log('isUpdated:data from cache:', dbData);
    return false
  }
}
///////////////////////////////
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Performance Monitoring and get a reference to the service
export const perf = getPerformance(app);

const t = trace(perf, "init_firebase_objects");
t.start();
export const timeTutor = trace(perf, "choose_tutor_time");

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export { firebase };

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);


// Initialize the FirebaseUI Widget using Firebase.
export var ui = new firebaseui.auth.AuthUI(auth);

export const analytics = getAnalytics(app);

export const storage = getStorage();

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
// const appCheck = 
if (process.env.NODE_ENV === "production") {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.VUE_APP_RECAPTCHA_PRD),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
  });
} else {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.VUE_APP_RECAPTCHA_DEV),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
  });
}

export const token = getToken(messaging, {
  vapidKey:
    process.env.VUE_APP_VAPID_KEY,
})
  .then((currentToken) => {
    if (currentToken) {
      console.log(`TOKEN: ${currentToken}`);
      return currentToken;
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  })
  .catch((err) => {
    console.log(`An error occurred while retrieving token - ${err}`);
  });

t.stop();

export const logOut = () => {  
  auth.signOut();
  deleteIdbData(dbPromiseVisits);
  store.commit('resetUser');
  store.commit('setUserRole', { type: '', loggedIn: false });
  // function tmp(cb) {
  //   try {
  //     renderLoginUI();
  //     Loader.close();
  //   } catch (error) {
  //     setTimeout(() => {
  //       tmp();
  //     }, 1000);
  //   }
  // }
  // tmp();
}

export async function saveErrorInDb(stackTrace, router, component, method) {
  const today = new Date();
  try {
    var user = {
      uid: auth ? auth.currentUser.uid : null,
      displayName: auth ? auth.currentUser.displayName : null
    }
    addDoc(collection(db, "error"), {
      date: today || null,
      router: router || null,
      component: component || null,
      method: method || null,
      user: user || null,
      stack: stackTrace ? String(stackTrace) : null
    });
    
  } catch (error) {
    
  }
  // waitForCurrentUser(() => {
  // }, 3000); // Max czas oczekiwania: 3 sekundy
}

async function getTestDoc() {
  try {
    // Pobranie utworzonego dokumentu
    // const snapshot = await db.collection('visit').get();
    // const docRef = doc(db, "visit");
    // const docSnap = await getDoc(docRef);
    const querySnapshot = await getDocs(collection(db, "visit"));

    // Wyświetlenie danych dokumentu
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });

    console.log('Pobranie dokumentu zakończone sukcesem.');

  } catch (error) {
    console.error('Błąd podczas testowania reguł Firestore:', error);
  }
}

function waitForCurrentUser(callback, maxWaitTime = 3000, interval = 500) {
  let elapsedTime = 0;

  function checkCurrentUser() {
    if (auth.currentUser) {
      callback();
      initLoggedUser(); // załaduj UI dla usera który się nie wylogował
      Loader.close();
    } else if (elapsedTime >= maxWaitTime) {
      console.error("Przekroczono limit czasu oczekiwania na uzyskanie danych użytkownika.");
      // renderLoginUI(); // załaduj UI dla usera który się wylogował lub nie ma konta
      Loader.close();
    } else {
      setTimeout(() => {
        elapsedTime += interval;
        checkCurrentUser();
      }, interval);
    }
  }

  checkCurrentUser();
}
async function startUi() {
  const t = trace(perf, "init_ui");
  t.start();


  waitForCurrentUser(() => {
  }, 3000); // Max czas oczekiwania: 3 sekundy


  t.stop();
  // TUTOR ONLY PART
  // TODO
  setTimeout(async () => {
    const userRole = await store.getters.getUserRole;
    if (userRole.type == 'T') {
      (async () => {
        try {
          const tutorData = await getTutorFirebase(store.getters.getUID);
          // console.log("Tutor data: ", store.getters.getUID);
          // console.log("Tutor data: ", tutorData);
          store.commit('setTutor', tutorData);
          if (tutorData.isActiveTutor == false) {
            router.push('/tutor-register'); // TODO blokada routingu
          }
        } catch (error) {
          console.error('Błąd podczas pobierania tutor z Firestore:', error);
        }
      })();
    }
  }, 4000);
}
async function insertUserFirestore(uid, authResult, tmpRole) {

  const docRef = doc(db, "user", uid);
  const docSnap = await getDoc(docRef);
  // console.log('docSnap: ', docSnap);
  if (!docSnap._document) {
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
  // const startTime = performance.now()
  const t = trace(perf, "get_user_role_firebase");
  t.start();

  const docRef = doc(db, "user", uid); // get saved role
  const docSnap = await getDoc(docRef);
  // console.log('get user role: ', docSnap.data());


  t.stop();
  // const endTime = performance.now()
  // const executionTime = endTime - startTime
  // const logData = { name: 'getUserRoleFirebase', value: executionTime.toFixed(2) + "ms" }

  // logEvent(analytics, logData.name, {
  //   value: logData.value + " time:  " + new Date()
  // });

  return docSnap.data().role
}
async function getTutorFirebase(uid) { // pobranie po userId
  const t = trace(perf, "get_tutor_firebase");
  t.start();
  let res = null;
  const q = query(collection(db, "tutor"), where("userId", "==", uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    res = doc.data();
  });
  t.stop();
  return res
}
async function getUserFirebase(uid) {

  const docRef = doc(db, "user", uid);
  const docSnap = await getDoc(docRef);

  return docSnap.data()
}
async function initLoggedUser() {
  let user = auth.currentUser;
  if (auth.currentUser.displayName) { // from Google TODO refactor
    let formatDataLogged = {
      id: user.uid,
      fullName: user.displayName,
      email: user.email,
      photo: user.photoURL,
      provider: user.providerData.providerId,
      // role:
    }
    store.commit('setUser', formatDataLogged);
  } else {
    let userFirebase = await getUserFirebase(user.uid)
    let formatDataLogged = {
      id: userFirebase.id,
      fullName: userFirebase.fullName,
      email: userFirebase.email,
      photo: '', // TODO
      provider: 'email',
      // role:
    }
    store.commit('setUser', formatDataLogged);
  }
  // dbPromise.then(function(db) {
  //   var tx = db.transaction('tutor', 'readwrite');
  //   var store = tx.objectStore('tutor');
  //   store.put(formatDataLogged);
  //   return tx.complete;
  // })

  //   (async () => {
  //     try {
  //   var dbPromiseIn = await dbPromise;
  //   var tx = dbPromiseIn.transaction('tutor', 'readwrite');
  //   var storeDb = tx.objectStore('tutor');
  //   storeDb.put(formatDataLogged);
  //   console.log('add to idb: ',tx.complete);
  // } catch (error) {
  //   console.error('Błąd podczas pobierania roli z Firestore:', error);
  // }
  // })();

  (async () => {
    try {
      const roleFromFirestore = await getUserRoleFirebase(user.uid);
      store.commit('setUserRole', { type: roleFromFirestore, loggedIn: true });
    } catch (error) {
      console.error('Błąd podczas pobierania roli z Firestore:', error);
    }
  })();
  // document.getElementById('sign-out').style.display = 'initial';
  // document.getElementById('sign-in').style.display = 'none';
}
export const renderLoginUI = () => {

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
        if (authResult.user.displayName) { // from Google TODO refactor
          let formatData = {
            id: uid,
            fullName: authResult.user.displayName,
            email: authResult.user.email,
            photo: authResult.user.photoURL,
            provider: authResult.user.providerData // can be list if more than one method for email ex. google and password (logged by google)
          }
          store.commit('setUser', formatData);
        } else {

          (async () => {
            let userFirebase = await getUserFirebase(uid)
            let formatData = {
              id: userFirebase.id,
              fullName: userFirebase.fullName,
              email: userFirebase.email,
              photo: '', // TODO
              provider: 'email',
              // role:
            }
            store.commit('setUser', formatData);
          })();
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

        // store.commit('setUser', formatData);

        // document.getElementById('sign-out').style.display = 'initial';
        // document.getElementById('sign-in').style.display = 'none';

        return false;
      },

      // signInFailure callback must be provided to handle merge conflicts which
      // occur when an existing credential is linked to an anonymous user.
      // signInFailure: function(error) {
    }
  });
}

var initApp = function () {
  if (!auth.currentUser) {
    // document.getElementById('sign-out').style.display = 'none';
    // document.getElementById('sign-in').style.display = 'initial';
  }
  // document.getElementById('sign-out').addEventListener('click', function () {

  //   auth.signOut();
  //   deleteIdbData(dbPromiseVisits);

  //   // let user = {
  //   //   id: "",
  //   //   fullName: "",
  //   //   email: "",
  //   //   photo: "",
  //   //   provider: ""
  //   // }
  //   // store.commit('setUser', user); // TO DEL
  //   store.commit('resetUser');
  //   store.commit('setUserRole', { type: '', loggedIn: false });

  //   // document.getElementById('sign-out').style.display = 'none';
    // document.getElementById('sign-in').style.display = 'initial';

  //   Loader.open();
  //   function tmp(cb) {
  //     try {
  //       renderLoginUI();
  //       Loader.close();
  //     } catch (error) {
  //       setTimeout(() => {
  //         tmp();
  //       }, 1000);
  //     }
  //   }
  //   tmp();
  // });
  // // document.getElementById('sign-out').style.display = 'none'; // był comment
  // document.getElementById('sign-in').style.display = 'initial';
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
// window.addEventListener('load', initApp);

onMessage(messaging, async (payload) => {
  console.log(`Message received: ${payload}`);
  setTimeout(() => {
    appendMessage(payload);
  }, 5000);
  // let date = new Date().toLocaleString();
  // let data = {
  //   recipientId: auth.currentUser.uid,
  //   recipientFullName: !!auth.currentUser.displayName ? auth.currentUser.displayName : 'undefined',
  //   text: payload.notification.title,
  //   status: 'recived',
  //   reciveDate: date
  // };
  // setDoc(doc(db, "notification", date), data);
});

function appendMessage(payload) {
  triggerToastFromExternalJS(payload.notification.title, payload.notification.body, payload.notification.image);
}

function triggerToastFromExternalJS(title, content, photoUrl) {
  const event = new CustomEvent('trigger-toast', {
    detail: { title, content, photoUrl, hide: false }
  });
  window.dispatchEvent(event);
}
