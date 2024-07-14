<script setup>
import VisitsList from "@/components/VisitsList.vue";
import { logOut, renderLoginUI } from "@/firebaseInitializer";
import { onMounted, ref, watch } from "vue";
import store from "../store/index";

onMounted(async () => {
  if(!store.state.role.loggedIn)
  renderLoginUI();
});

const role = ref("C");

watch(role, (newRole, oldRole) => {
  console.log("tmpRole WATCH");
  store.commit("setTmpRole", newRole);
});

function logOutIn() {
  logOut();
  setTimeout(() => {
    renderLoginUI();
  }, 2000);
}
</script>

<template>
        <CCard v-if="!$store.state.role.loggedIn">
          <CCardHeader>Wybierz metodę logowania/rejestracji
          </CCardHeader>
          <CCardBody>
          <CCloseButton class="text-reset" @click="() => {
            visibleLogin = false;
          }
            " />
          Wybierz swoją rolę
          <select id="role" v-model="role">
            <option value="C">Uczeń</option>
            <option value="T">Korepetytor</option>
          </select>
          <div id="firebaseui-auth-container"></div>
        </CCardBody>
        </CCard>
  <div v-else>
    <CButton class="bg-light" @click="logOutIn()">Wyloguj się</CButton>

    <VisitsList />
  </div>
</template>

<script>
// @ is an alias to /src
// import VisitsList from "@/components/VisitsList.vue";

export default {
  name: "HomeView",
  components: {
    VisitsList,
  },
};
</script>
