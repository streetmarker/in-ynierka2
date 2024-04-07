<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/admin">admin</router-link> |
    <router-link to="/visit">visit</router-link> |
    <router-link to="/panel">panel</router-link> |
    <router-link to="/tutor-list">tutor-list</router-link> |
    <router-link to="/tutor-admin">tutor-admin</router-link> |
    <router-link to="/tutor-manager">tutor-manager</router-link>
  </nav>
  <router-view />
  <button @click="dumpLogs">DUMP</button>
  {{ logs }}
</template>

<script>
import { db } from '../firebaseInitializer'
// import { onMessage } from './firebase-messaging-sw'
import { collection, addDoc } from "firebase/firestore";

export default {
  data() {
    return {
      logs: []
    };
  },
  beforeMount() {
    this.initLogs();
    this.requestPermission();
    // this.setupMessaging();
    this.logEntry();
  },
  methods: {
    requestPermission() {
      console.log("Requesting permission...");
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    },
    // setupMessaging() {
    //   onMessage(messaging, (payload) => {
    //     console.log("Message received. ", payload);
    //     // ...
    //   });
    // },
    captureLogs(message) {
      this.logs.push(message);
    },
    initLogs() {
      console.log = this.captureLogs;
      console.error = this.captureLogs;
      // console.warn = this.captureLogs;
      console.log('INIT CAPTURE');
    },
    async dumpLogs() {
      let data = {
        device: navigator.userAgent,
        log: this.logs,
        date: new Date()
      }
      await addDoc(collection(db, "logs"), data);
    },
    async logEntry() {
      let data = {
        device: navigator.userAgent,
        date: new Date()
      }
      await addDoc(collection(db, "entries"), data);
    }
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
</style>
