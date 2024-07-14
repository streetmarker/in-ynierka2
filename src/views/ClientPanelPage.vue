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
        <CCol sm="auto">
          <CCard>
            <CButton class="bg-light" @click="logOutIn()">Wyloguj się</CButton>
            <CCardBody>
              <!-- <div v-if="userData.fullName.length !== 0"> -->
                <h1>{{ userData.fullName }}</h1>
                <p>{{ userData.email }}</p>
                <!-- <img style="width: 50px; height: 50px;"
                  src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                  alt="User Photo" /> -->
                <img style="width: 50px; height: 50px;" :src="userData.photo" alt="User Photo" />
              <!-- </div> -->
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CRow class="mt-3">
            <CCol xs="12">
              <CCollapse :visible="visibleB">
                <CCard style="margin-right: 10px;">
                  <CCardTitle>Edycja preferencji</CCardTitle>
                  <CCardBody>
                    <CForm class="px-4 py-4">
                      <div class="mb-3">
                        <CFormLabel>Miasto</CFormLabel>
                        <Multiselect v-model="selectedOptionsC" :options="optionsC" :multiple="true" label="name"
                          track-by="id" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel>Przedmioty</CFormLabel>
                        <Multiselect v-model="selectedOptionsS" :options="optionsS" :multiple="true" label="name"
                          track-by="id" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel>Poziom</CFormLabel>
                        <Multiselect v-model="selectedOptionsL" :options="optionsL" :multiple="false" label="name"
                          track-by="id" />
                      </div>
                      <CButton color="primary" type="submit" @click="saveChanges">Zapisz zmiany</CButton>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCollapse>
            </CCol>
          </CRow>
          <br>
          <CCol sm="auto">
            <div class="edit-buttons">
              <CButton color="primary" @click="visibleA = !visibleA">Edycja danych osobowych</CButton>
              <CButton color="primary" @click="visibleB = !visibleB">Edycja preferencji</CButton>
            </div>
          </CCol>
        </CCol>
        <VisitsList />
      </div>
</template>

<script>

export default {
  name: "ClientPanel",
  data() {
    return {
      editableData: {
        age: null,
        city: '',
        subjectPreferences: '',
        level: ''
      },
      visibleA: false,
      visibleB: false,
      selectedOptionsC: [],
      selectedOptionsS: [],
      selectedOptionsL: [],
      optionsC: [
        { name: 'Warszawa', id: 1 }
      ], optionsS: [
        { name: 'Matematyka', id: 1 },
        { name: 'Fizyka', id: 2 }
      ], optionsL: [
        { name: 'Studia(rozszerzenie)', id: 1 }
      ]
    };
  },
  mounted() {
    //
  },
  computed: {
    userData() {
      return this.$store.state.user;
    },
  },
  methods: {
    saveChanges() {
      this.$store.commit('updateUser', this.editableData);
    },
  }
};
</script>
<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>
