<template>
  <div>
    <div class="notification-bar" id="notificationBar"></div>
    <nav>
      <router-link to="/">Home</router-link> |
      <!-- <router-link to="/login">Login</router-link> | -->
      <!-- <router-link to="/admin">admin[TODO]</router-link> | -->
      <router-link to="/visit">Umów wizytę</router-link> |
      <router-link to="/panel">Panel klienta</router-link> |
      <router-link to="/tutor-list">Lista korepetytorów</router-link> |
      <!-- <router-link to="/tutor-admin">tutor-admin[TODO]</router-link> | -->
      <!-- <router-link to="/tutor-manager">tutor-manager[TODO]</router-link> -->

      <button id="sign-out">Wyloguj się</button>
    </nav>
    <div class="container">
      <div id="features" class="row text-center">
        <div class="col">
          <router-view />
        </div>
      </div>
    </div>
    <!-- <button @click="dumpLogs">DUMP</button> -->
    <!-- <button @click="test">TEST</button> -->

    <div id="firebaseui-auth-container"></div>
    <!-- <br />
  <div class="container">
    <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm">
        <div id="paypal-btn"></div>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
  <br /> -->

    <!-- {{ logs }} -->
  </div>
</template>

<script>
import { db, auth, token } from "./firebaseInitializer";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";

// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'

export default {
  data() {
    return {
      logs: [],
      showLoginDialog: false,
    };
  },
  computed: {
    userData() {
      return this.$store.state.user; // TODO do komponentu
    },
  },
  mounted() {
    // this.initLogs();
    this.requestPermission();
    setTimeout(() => {
      this.logEntry();
    }, 3000);
  },
  methods: {
    // async initPaypal() {
    //   let paypal;

    //   try {
    //     paypal = await loadScript({
    //       clientId: process.env.VUE_APP_PAYPAL_CLIENT_ID,
    //       currency: "PLN",
    //     });
    //   } catch (error) {
    //     console.error("failed to load the PayPal JS SDK script", error);
    //   }

    //   if (paypal) {
    //     try {
    //       await paypal
    //         .Buttons({
    //           style: {
    //             layout: "vertical",
    //             color: "blue",
    //             shape: "pill",
    //             label: "paypal",
    //           },
    //         })
    //         .render("#paypal-btn");
    //     } catch (error) {
    //       console.error("failed to render the PayPal Buttons", error);
    //     }
    //   }
    // },
    requestPermission() {
      console.log("Requesting permission...");
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    },
    captureLogs(message) {
      this.logs.push(message);
    },
    initLogs() {
      console.log = this.captureLogs;
      console.error = this.captureLogs;
      // console.warn = this.captureLogs;
      console.log("INIT CAPTURE");
    },
    async dumpLogs() {
      let data = {
        device: navigator.userAgent,
        log: this.logs,
        date: new Date(),
      };
      await addDoc(collection(db, "logs"), data);
    },
    async logEntry() {
      const docRef = doc(db, "mock", 'MYDATA');
      const docSnap = await getDoc(docRef);
      if(docSnap._document.val === 'Y'){
        let tokenIn = await token;
        let date = new Date().toLocaleString();
        let authIn = auth.currentUser ? auth.currentUser.displayName : null;
        let data = {
          token: tokenIn,
          auth: authIn,
          date: date
        };
        await addDoc(collection(db, "entries"), data);
      }
    },
    test() {
      //
    },
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.notification-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
  display: none;
}

.notification-bar img {
  max-width: 50px;
  max-height: 50px;
  vertical-align: middle;
  margin-right: 10px;
}
.col {
  display: flex; /* Ustawia elementy w rzędzie */
  align-items: center; /* Wyśrodkowuje zawartość w pionie */
  justify-content: center; /* Wyśrodkowuje zawartość w poziomie */
}
</style>
