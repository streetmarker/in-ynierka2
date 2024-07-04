<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CButton,
  CRow,
  CCol,
  CCollapse,
  CCard,
  CCardBody,
  CContainer,
  CCardTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CFormSelect
} from "@coreui/vue";
</script>

<template>
  <div class="home">
    <CContainer>
      <CRow>
        <CCol sm="auto">
          <CCard>
            <CCardBody>
              <div v-if="userData.fullName.length !== 0">
                <h1>{{ userData.fullName }}</h1>
                <p>{{ userData.email }}</p>
                <!-- <img style="width: 50px; height: 50px;"
                  src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg"
                  alt="User Photo" /> -->
                <img style="width: 50px; height: 50px;" :src="userData.photo" alt="User Photo" />
              </div>
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
      </CRow>
    </CContainer>

    <VisitsList />
  </div>
</template>

<script>
import VisitsList from "@/components/VisitsList.vue";
import Multiselect from 'vue-multiselect';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseInitializer";

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
      ],
      // visitsDb: []
    };
  },
  mounted() {
    // this.getVisits();
  },
  computed: {
    userData() {
      return this.$store.state.user;
    },
  },
  watch: {
    userData: {
      immediate: true,
      handler(newValue) {
        this.editableData = { ...newValue };
      }
    }
  },
  methods: {
    saveChanges() {
      this.$store.commit('updateUser', this.editableData);
    },
    async getVisits() { // TODEL
      const visitdsIdb = await getIdbData(dbPromiseVisits);
      
      if (visitdsIdb.length > 0){
        this.visitsDb = visitdsIdb;
      } else {
        var UID = this.$store.state.user.id;
        const q = query(collection(db, "visit"), where("clientId", "==", UID));
        const data = [];

        const querySnapshot = await getDocs(q); querySnapshot.forEach(async (doc) => {
          data.push(doc.data());
        });
        this.visitsDb = data;
        putIdbData(dbPromiseVisits, data);

      }
    }
  }
};
</script>
<style src="../../node_modules/vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.edit-buttons {
  display: flex;
  gap: 10px;
}

.appointments {
  margin-top: 30px;
  width: 100%;
}

.appointments h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
}

.appointments ul {
  list-style-type: none;
  padding: 0;
}

.appointments li {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.appointments li p {
  margin: 5px 0;
}
</style>
