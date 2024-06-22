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
  CFooter,
  CLink,
  CNavbar,
  CContainer,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CNavbarText,
  CRow,
  CCol
} from "@coreui/vue";
import { ref, watch } from "vue";
const role = ref("C");

watch(role, (newRole, oldRole) => {
  console.log("tmpRole WATCH");
  store.commit("setTmpRole", newRole);
});
</script>

<template>
  <div id="app">
    <!-- <div class="notification-bar" id="notificationBar"></div> -->
    <ToastMsg />
    <div v-if="!$store.state.role.loggedIn">
      <COffcanvas dark placement="start" :visible="visible" @hide="() => {
        visible = !visible;
      }
        ">
        <COffcanvasHeader>
          <COffcanvasTitle>Wybierz metodę logowania/rejestracji</COffcanvasTitle>
          <CCloseButton class="text-reset" @click="() => {
            visible = false;
          }
            " />
        </COffcanvasHeader>
        <COffcanvasBody>
          Wybierz swoją rolę
          <select id="role" v-model="role">
            <option value="C">Uczeń</option>
            <option value="T">Korepetytor</option>
          </select>
          <div id="firebaseui-auth-container"></div>
        </COffcanvasBody>
        <CButton color="primary" @click="() => {
          visible = !visible;
        }
          ">Powrót</CButton>
      </COffcanvas>
    </div>

    <CNavbar color-scheme="dark" class="bg-dark">
      <CContainer>
        <CNavbarText></CNavbarText>

        <CNavbarBrand href="#" class="bg-dark">
          <!-- <img src="../firebase-logo.png" alt="" width="22" height="24" class="d-inline-block align-top" /> -->
          <CNavbarBrand><router-link style="text-decoration: none" to="/">
            <img src="../firebase-logo.png" alt="" width="22" height="24" class="d-inline-block align-top" />Tutor App</router-link></CNavbarBrand>
        </CNavbarBrand>
        <CNavbarText></CNavbarText>
      </CContainer>
    </CNavbar>
    <div class="bg-dark">
    <CNavbar style="border-bottom: 2px solid grey;" lor-scheme="dark" class="bg-dark">
      <CContainer fluid>
        <div style="width: 30%;"></div>
        <div v-if="clientAccess">
          <CNavbarBrand><router-link style="text-decoration: none" v-if="clientAccess" to="/panel">Panel
              klienta</router-link></CNavbarBrand>

          <!-- <CNavbarBrand><router-link style="text-decoration: none" v-if="clientAccess" to="/visit">Umów
              wizytę</router-link></CNavbarBrand> -->
              
          <CNavbarBrand><router-link style="text-decoration: none" v-if="clientAccess" to="/tutor-list">Lista
              korepetytorów</router-link>
          </CNavbarBrand>

        </div>
        <!--  -->
        <div v-if="tutorAccess">
          <CNavbarBrand><router-link style="text-decoration: none" v-if="tutorAccess" to="/tutor-manager">Zarządzanie
              wizytami</router-link>
          </CNavbarBrand>
          <CNavbarBrand><router-link style="text-decoration: none" v-if="tutorAccess" to="/tutor-admin">Zarządzanie
              ofertą</router-link>
          </CNavbarBrand>
        </div>
        <!--  -->
        <div v-if="adminAccess">
          <CNavbarBrand><router-link style="text-decoration: none" v-if="adminAccess" to="/admin">Administracja
              aplikacją</router-link></CNavbarBrand>
        </div>
        <div style="width: 30%;">
          <CButton id="sign-in" class="bg-dark" style="text-decoration: none;" @click="() => {
            visible = !visible;
          }
            "><u>Logowanie / Rejestracja</u></CButton>
          <b><i>{{ $store.state.user.fullName }}</i></b>
          <CButton id="sign-out" style="text-decoration: none;" class="bg-dark"> <u>Wyloguj się</u></CButton>
        </div>
        <!-- <CNavbarText></CNavbarText> -->
      </CContainer>
    </CNavbar>
  </div>

    <div class="main-content container">
      <div id="features" class="row text-center">
        <div class="col">
          <!-- <div style="opacity: 0%;" id="firebaseui-auth-container"></div> -->
          <router-view />
        </div>
      </div>
    </div>
    <!-- TODO -->
    <!-- <div v-if="process.env.VUE_APP_NODE_ENV === 'development'">
      {{ tokenIn }}
    </div> -->
    <CFooter style="border-top: 2px solid grey;" class="bg-dark">
      <div>
        <!-- <CLink href="https://coreui.io">Tutor App</CLink>
        <span>&copy; 2024</span> -->
      </div>
      <div>
        <!-- <span>Powered by</span>
        <CLink href="https://coreui.io">CoreUI</CLink> -->
        <CLink href="https://coreui.io">Tutor App</CLink>
        <span>&copy; 2024</span>
      </div>
    </CFooter>
    <!-- <reCAPTCHA /> -->
  </div>
</template>

<script>
import { db, auth, token } from "./firebaseInitializer";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import store from "./store/index"; // TODO TMP
import reCAPTCHA from './components/reCAPTCHA.vue' // TODO
import ToastMsg from './components/ToastMsg.vue'

export default {
  components: {
    reCAPTCHA,
    ToastMsg
  },
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
  },
  mounted() {
    // this.initLogs();
    this.requestPermission();
    this.getToken();
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
  /* color: #2c3e50; */
  /* background-color: #f0f0f0; */
  background-image: radial-gradient(circle, #f0f0f0 0%, #61c75e 140%);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.bg-dark {
  /* background-image: radial-gradient(circle, #f0f0f0 0%, #3f8d3c 140%); */
  /* background-color: #2c3e50; */
  color: #fff;
  text-decoration: none;

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
  display: flex;
  /* Ustawia elementy w rzędzie */
  align-items: center;
  /* Wyśrodkowuje zawartość w pionie */
  justify-content: center;
  /* Wyśrodkowuje zawartość w poziomie */
}
</style>
