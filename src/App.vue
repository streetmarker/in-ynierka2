<script setup>
// import "@coreui/coreui/dist/css/coreui.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   CButton,
//   CCloseButton,
//   COffcanvas,
//   COffcanvasHeader,
//   COffcanvasTitle,
//   COffcanvasBody,
//   CFooter,
//   CLink,
//   CNavbar,
//   CContainer,
//   CNavbarBrand,
//   CNavbarToggler,
//   CCollapse,
//   CNavbarNav,
//   CNavItem,
//   CNavLink,
//   CNavbarText,
//   CRow,
//   CCol
// } from "@coreui/vue";
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
    <!-- <div v-if="!$store.state.role.loggedIn">
      <COffcanvas dark placement="start" :visible="visibleLogin" @hide="() => {
        visibleLogin = !visibleLogin;
      }
        ">
        <COffcanvasHeader>
          <COffcanvasTitle>Wybierz metodę logowania/rejestracji</COffcanvasTitle>
          <CCloseButton class="text-reset" @click="() => {
            visibleLogin = false;
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
          visibleLogin = !visibleLogin;
        }
          ">Powrót</CButton>
      </COffcanvas>
    </div> -->

    <CNavbar style="border-bottom: 2px solid grey;" color-scheme="dark" class="bg-dark">
      <CContainer fluid>
          <CNavbarBrand><router-link style="text-decoration: none" to="/">
            <img src="../firebase-logo.png" alt="" width="22" height="24" class="d-inline-block align-top" />Tutor
            App</router-link></CNavbarBrand>
          <CNavbarBrand >
            <!-- <CButton v-if="!$store.state.role.loggedIn" id="sign-in" class="bg-light" style="text-decoration: none;" @click="() => {
              visibleLogin = !visibleLogin;
            }
              "><u>Logowanie / Rejestracja</u></CButton> -->
            <CButton href="#/panel">
            <img style="width: 30px; height: 30px; border: 1px solid transparent;" src="../public/5964729.png" />
          </CButton>
            <!-- <b><i>{{ $store.state.user.fullName }}</i></b> -->
            <!-- <CButton id="sign-out" style="text-decoration: none; color: white"> <u>Wyloguj się</u></CButton> -->
          </CNavbarBrand>
        <CNavbarToggler class="bg-light" @click="visible = !visible"/>
        <CCollapse class="navbar-collapse" :visible="visible">
          <CNavbarNav>
            <div v-if="clientAccess">
              <CNavItem><router-link style="text-decoration: none" v-if="clientAccess" to="/panel">Panel
                  klienta</router-link></CNavItem>
              <CNavItem><router-link style="text-decoration: none" v-if="clientAccess" to="/tutor-list">Lista
                  korepetytorów</router-link>
              </CNavItem>
            </div>
            <!--  -->
            <div v-if="tutorAccess">
              <CNavItem><router-link style="text-decoration: none" v-if="tutorAccess"
                  to="/tutor-manager">Zarządzanie
                  wizytami</router-link>
              </CNavItem>
              <CNavItem><router-link style="text-decoration: none" v-if="tutorAccess" to="/tutor-admin">Zarządzanie
                  ofertą</router-link>
              </CNavItem>
            </div>
            <!--  -->
            <div v-if="adminAccess">
              <CNavItem><router-link style="text-decoration: none" v-if="adminAccess" to="/admin">Administracja
                  aplikacją</router-link></CNavItem>
            </div>
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
<!--  -->
    <div class="main-content container">
      <div id="features" class="row text-center">
        <div class="col">
          <div class="bgcolor">
            <router-view />
          </div>
        </div>
      </div>
    </div>

    <!-- TODO -->
    <!-- <div v-if="process.env.VUE_APP_NODE_ENV === 'development'">
      {{ tokenIn }}
    </div> -->
    <CFooter style="border-top: 2px solid grey;" class="bg-dark">
      <div>
        <CLink href="https://coreui.io">Tutor App</CLink>
        <span> &copy; 2024</span>
      </div>
      <div>
        <!-- right side -->
      </div>
    </CFooter>
  </div>
</template>

<script>
import { db, auth, token } from "./firebaseInitializer";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import store from "./store/index"; // TODO TMP
import ToastMsg from './components/ToastMsg.vue'

export default {
  components: {
    ToastMsg
  },
  data() {
    return {
      logs: [],
      showLoginDialog: false,
      visibleLogin: false,
      role: "C",
      loggedInFront: false,
      tokenIn: '',
      visible: false
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
  /* background-image: radial-gradient(circle, #f0f0f0 0%, #61c75e 140%); */
  background: url('../public/bg.svg');
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

.bgcolor {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
}

/* .main-content > * {
  background-color: rgba(255, 255, 255, 1);
  padding: 20px;
} */
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
  /* display: flex; */
  /* Ustawia elementy w rzędzie */
  align-items: center;
  /* Wyśrodkowuje zawartość w pionie */
  justify-content: center;
  /* Wyśrodkowuje zawartość w poziomie */
}

#fire_app_check_\[DEFAULT\] {
  display: initial !important
}
</style>
