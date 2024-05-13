<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CButton,
  CCloseButton,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  
} from "@coreui/vue";
import { ref, watch } from "vue";
const role = ref("C");

watch(role, (newRole, oldRole) => {
  console.log("tmpRole WATCH");
  store.commit("setTmpRole", newRole);
});
</script>

<template>
  <div>
    <div class="notification-bar" id="notificationBar"></div>
    <!-- <CButton
      color="primary"
      @click="
        () => {
          visible = !visible;
        }
      "
      >Logowanie / Rejestracja</CButton
    > -->
    <div v-if="!$store.state.role.loggedIn">
    <COffcanvas
      dark
      placement="start"
      :visible="visible"
      @hide="
        () => {
          visible = !visible;
        }
      "
    >
      <COffcanvasHeader>
        <COffcanvasTitle>Wybierz metodę logowania/rejestracji</COffcanvasTitle>
        <CCloseButton
          class="text-reset"
          @click="
            () => {
              visible = false;
            }
          "
        />
      </COffcanvasHeader>
      <COffcanvasBody>
        Wybierz swoją rolę
        <select id="role" v-model="role">
          <option value="C">Uczeń</option>
          <option value="T">Korepetytor</option>
        </select>
        <!-- <CButton
          @click="selectRole()"
          >Zapisz wybór</CButton
        > -->
        <div id="firebaseui-auth-container"></div>
      </COffcanvasBody>
      <CButton
        color="primary"
        @click="
          () => {
            visible = !visible;
          }
        "
        >Powrót</CButton
      >
    </COffcanvas>
    </div>

    <nav>
      <router-link to="/"><b>Tutor App</b></router-link> |
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> | -->
      <!-- TODO Manager do zmiany - zarządzanie wizytami i do zmiany na dg ofertami-->
      <div v-if="clientAccess">
        <router-link v-if="clientAccess" to="/panel">Panel klienta</router-link>
        |
        <router-link v-if="clientAccess" to="/visit">Umów wizytę</router-link> |
        <router-link v-if="clientAccess" to="/tutor-list"
          >Lista korepetytorów</router-link
        >
        |
      </div>
<!--  -->
      <div v-if="tutorAccess">
        <router-link v-if="tutorAccess" to="/tutor-manager"
          >Zarządzanie wizytami</router-link
        >
        |
        <router-link v-if="tutorAccess" to="/tutor-admin"
          >Zarządzanie ofertą</router-link
        >
        |
      </div>
<!--  -->
      <div v-if="adminAccess">
        <router-link v-if="adminAccess" to="/admin"
          >Administracja aplikacją</router-link
        >
        |
      </div>
      <CButton
        id="sign-in"
        @click="
          () => {
            visible = !visible;
          }
        "
        ><u>Logowanie / Rejestracja</u></CButton
      >
      <b><i>{{ $store.state.user.fullName }}</i></b>
      <CButton id="sign-out"> <u>Wyloguj się</u></CButton>
    </nav>
    <div class="container">
      <div id="features" class="row text-center">
        <div class="col">
          <router-view />
        </div>
      </div>
    </div>
    <!-- TODO -->
    <!-- <div v-if="process.env.VUE_APP_NODE_ENV === 'development'">
      {{ tokenIn }}
    </div> -->
  </div>
</template>

<script>
import { db, auth, token } from "./firebaseInitializer";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import store from "./store/index"; // TODO TMP
import { getToken } from "firebase/messaging";
// import DarkModeBtn from './components/DarkModeBtn.vue' // TODO

export default {
  // components: {
  //   DarkModeBtn
  // },
  data() {
    return {
      logs: [],
      showLoginDialog: false,
      visible: false,
      role: "C",
      loggedInFront: false,
      tokenIn: ''
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
    // tmpRole() {

    // }
  },
  mounted() {
    // this.initLogs();
    this.requestPermission();
    this.getToken();
  },
  methods: {
    async getToken(){
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
      const docRef = doc(db, "mock", "MYDATA");
      const docSnap = await getDoc(docRef);
      if (docSnap._document.val === "Y") {
        let tokenIn = await token;
        let date = new Date().toLocaleString();
        let authIn = auth.currentUser ? auth.currentUser.displayName : null;
        let data = {
          token: tokenIn,
          auth: authIn,
          date: date,
        };
        await addDoc(collection(db, "entries"), data);
      }
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  /* background-color: #f0f0f0; */
  background-image: radial-gradient(circle, #f0f0f0 0%, #61c75e 140%);
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
