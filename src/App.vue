<script setup>
import { ref, watch } from "vue";
const role = ref("C");

watch(role, (newRole, oldRole) => {
  console.log("tmpRole WATCH");
  store.commit("setTmpRole", newRole);
});
</script>

<template>
  <div id="app">
    <ToastMsg />

    <Navbar />

    <div class="main-content container">
      <div id="features" class="row text-center">
        <div class="col">
          <div class="bgcolor">
            <router-view />
          </div>
        </div>
      </div>
    </div>

    <CFooter style="border-top: 2px solid grey;" class="bg-dark">
      <div>
        <!-- left side -->
        <CLink href="https://coreui.io">Tutor App</CLink>
        <span> &copy; 2024</span>
      </div>
      <div>
        <!-- right side -->
      </div>
    </CFooter>
    <div v-if="env === 'development'">
      <CCard>
        <CCardHeader> {{ tokenIn }}
        </CCardHeader>
      </CCard>
    </div>
    <div v-else>
      <PinLock />
    </div>
    <PinLock />

  </div>
</template>

<script>
import { db, auth, token, env } from "./firebaseInitializer";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import store from "./store/index"; // TODO TMP
import ToastMsg from './components/ToastMsg.vue'
import Navbar from './components/Navbar.vue'
import PinLock from "./components/PinLock.vue";

export default {
  setup() {
    useHead({
      title: 'Tutor App',
      meta: [
        {
          name: 'description',
          content: 'This is a description Tutor App'
        },
        {
          property: 'og:title',
          content: 'Tutor App'
        }
      ]
    })
  },
  components: {
    ToastMsg,
    PinLock
  },
  data() {
    return {
      logs: [],
      showLoginDialog: false,
      visibleLogin: false,
      role: "C",
      loggedInFront: false,
      tokenIn: '',
      // visible: false,
      visibleExternalContent: false,
    };
  },
  computed: {
    clientAccess() {
      return (
        this.$store.state.role.loggedIn == true &&
        this.$store.state.role.type == "C"
      );
    },
    tutorAccess() {
      return (
        this.$store.state.role.loggedIn == true &&
        this.$store.state.role.type == "T"
      );
    },
    adminAccess() {
      return (
        this.$store.state.role.loggedIn == true &&
        this.$store.state.role.type == "A"
      );
    },
  },
  mounted() {
    this.requestPermission();
    this.getToken();
    if (process.env.NODE_ENV === "production") {
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      this.initLogs();
      this.logEntry();
      setTimeout(() => {
        this.dumpLogs();
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      }, 4000);
    }
  },
  methods: {
    async getToken() {
      this.tokenIn = await token;
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
      // const docRef = doc(db, "mock", "MYDATA");
      // const docSnap = await getDoc(docRef);
      // if (docSnap._document.val === "Y") {
      // let tokenIn = await token;
      let date = new Date().toLocaleString();
      let authIn = auth.currentUser ? auth.currentUser.displayName : null;

      function getPosition() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                // const coords = position.coords;

                // const latitude = coords.latitude;
                // const longitude = coords.longitude;
                // const altitude = coords.altitude;
                // const accuracy = coords.accuracy;
                // const altitudeAccuracy = coords.altitudeAccuracy;
                // const heading = coords.heading;
                // const speed = coords.speed;
                lat: position.coords.latitude,
                lon: position.coords.longitude
              });
            },
            (error) => {
              reject(error);
            }
          );
        });
      }
      async function getIPAddress() {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          const ipAddress = data.ip;
          // console.log('Adres IP:', ipAddress);
          return ipAddress;
        } catch (error) {
          return 'Błąd przy pobieraniu adresu IP:' + error;
          // console.error('Błąd przy pobieraniu adresu IP:', error);
        }
      }

      const userIP = await getIPAddress();
      const position = await getPosition();

      let data = {
        // token: tokenIn,
        auth: authIn,
        date: date,
        location: position || null,
        userAgent: navigator.userAgent || null,
        IP: userIP
      };
      await addDoc(collection(db, "entries"), data);
      // }
    },
    test() {
      //
      let role = this.role;
      let logged = this.loggedInFront;
      store.commit("setUserRole", { type: role, loggedIn: logged });
    },
  },
};
</script>
<style>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* background: url('../public/bg.svg'); */
  /* background: url('../public/bg.min.svg') no-repeat center center fixed; */
  background-size: cover;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}


.main-content {
  flex: 1;
}

.bg-dark {
  color: #fff;
  text-decoration: none;

}

.bgcolor {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
}

a {
  color: #fff;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #ffffff;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.notification-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: mediumseagreen;
  color: #fff;
  padding: 10px;
  text-align: center;
  display: none;
  z-index: 1000;
}

.notification-bar img {
  max-width: 50px;
  max-height: 50px;
  vertical-align: middle;
  margin-right: 10px;
}

.col {
  align-items: center;
  justify-content: center;
}

#fire_app_check_\[DEFAULT\] {
  display: initial !important
}
</style>
