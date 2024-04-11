<template>
  <div class="notification-bar" id="notificationBar"></div>

  <nav>
    <router-link to="/">Home</router-link> |
    <!-- <router-link to="/login">Login</router-link> | -->
    <router-link to="/admin">admin[TODO]</router-link> |
    <router-link to="/visit">visit[TODO]</router-link> |
    <router-link to="/panel">panel</router-link> |
    <router-link to="/tutor-list">tutor-list</router-link> |
    <router-link to="/tutor-admin">tutor-admin[TODO]</router-link> |
    <router-link to="/tutor-manager">tutor-manager[TODO]</router-link>
  </nav>
  <router-view />
  <!-- <button @click="dumpLogs">DUMP</button> -->
  <!-- <button @click="test">TEST</button> -->
  
  <div id="firebaseui-auth-container"></div>
  <dialog v-if="showLoginDialog">
  </dialog>
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
</template>

<script>
import { db} from "../firebaseInitializer";
import { collection, addDoc } from "firebase/firestore";
import { loadScript } from "@paypal/paypal-js";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// import firebase from 'firebase/compat/app';
// import * as firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'

export default {
  data() {
    return {
      logs: [],
      showLoginDialog: false
    };
  },
  beforeMount() {
    // this.initLogs();
    this.requestPermission();
    this.logEntry();
    // this.initPaypal();
  },
  methods: {
    async initPaypal() {
      let paypal;

      try {
        paypal = await loadScript({
          clientId: process.env.VUE_APP_PAYPAL_CLIENT_ID,
          currency: "PLN",
        });
      } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
      }

      if (paypal) {
        try {
          await paypal
            .Buttons({
              style: {
                layout: "vertical",
                color: "blue",
                shape: "pill",
                label: "paypal",
              },
            })
            .render("#paypal-btn");
        } catch (error) {
          console.error("failed to render the PayPal Buttons", error);
        }
      }
    },
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
      let data = {
        device: navigator.userAgent,
        date: new Date(),
      };
      await addDoc(collection(db, "entries"), data);
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
</style>
