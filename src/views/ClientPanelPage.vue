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
                <img style="width: 50px; height: 50px;" src="https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg" alt="User Photo" />
                <!-- <img :src="userData.photo" alt="User Photo" /> -->
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CRow class="mt-3">
            <!-- <CCol xs="6">
              <CCollapse :visible="visibleA">
                <CCard>
                  <CCardBody>
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                    richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                    cred nesciunt sapiente ea proident.
                  </CCardBody>
                </CCard>
              </CCollapse>
            </CCol> -->
            <CCol xs="12">
              <CCollapse :visible="visibleB">
                <CCard style="margin-right: 10px;">
                  <CCardTitle>Edycja preferencji</CCardTitle>
                  <CCardBody>
                    <CForm class="px-4 py-4">
                      <!-- <div class="mb-3">
                        <CFormLabel for="exampleDropdownFormEmail1">Email address</CFormLabel>
                        <CFormInput type="email" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                      </div> -->
                      <div class="mb-3">
                        <CFormLabel>Miasto</CFormLabel>
                        <Multiselect v-model="selectedOptionsC" :options="optionsC" :multiple="true" label="name" track-by="id" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel>Przedmioty</CFormLabel>
                        <Multiselect v-model="selectedOptionsS" :options="optionsS" :multiple="true" label="name" track-by="id" />
                      </div>
                      <div class="mb-3">
                        <CFormLabel>Poziom</CFormLabel>
                        <Multiselect v-model="selectedOptionsL" :options="optionsL" :multiple="false" label="name" track-by="id" />
                      </div>
                      <!-- <label>
                      Miasto:
                      <input type="text" v-model="editableData.city" />
                    </label>
                    <label>
                      Preferencje dotyczące przedmiotów:
                      <input type="text" v-model="editableData.subjectPreferences" />
                    </label>
                    <label>
                      Poziom:
                      <input type="text" v-model="editableData.level" />
                    </label> -->
                      <!-- <div class="mb-3">
                        <CFormCheck id="dropdownCheck" label="Remember me" />
                      </div> -->
                      <CButton color="primary" type="submit" @click="saveChanges">Zapisz zmiany</CButton>
                    </CForm>
                    <!-- <label>
                      Miasto:
                      <input type="text" v-model="editableData.city" />
                    </label>
                    <label>
                      Preferencje dotyczące przedmiotów:
                      <input type="text" v-model="editableData.subjectPreferences" />
                    </label>
                    <label>
                      Poziom:
                      <input type="text" v-model="editableData.level" />
                    </label>
                    <button @click="saveChanges">Zapisz zmiany</button> -->
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

    <div class="appointments">
      <h2>Umówione wizyty</h2>
      <ul>
        <li v-for="appointment in userData.appointments" :key="appointment.id">
          <p>Data: {{ appointment.date }}</p>
          <p>Korepetytor: {{ appointment.tutorName }}</p>
          <p>Przedmiot: {{ appointment.subject }}</p>
        </li>
      </ul>
    </div>
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Korepetytor</CTableHeaderCell>
          <CTableHeaderCell scope="col">Przedmiot</CTableHeaderCell>
          <CTableHeaderCell scope="col">Data</CTableHeaderCell>
          <CTableHeaderCell scope="col">Stawka</CTableHeaderCell>
          <CTableHeaderCell scope="col">Ilość godz.</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow active>
          <CTableHeaderCell scope="row">1</CTableHeaderCell>
          <CTableDataCell>Agata Kwiatkowska</CTableDataCell>
          <CTableDataCell>Matematyka</CTableDataCell>
          <CTableDataCell>31.05.2024, 02:00:00</CTableDataCell>
          <CTableDataCell>80</CTableDataCell>
          <CTableDataCell>1</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">2</CTableHeaderCell>
          <CTableDataCell>Agata Kwiatkowska</CTableDataCell>
          <CTableDataCell>Matematyka</CTableDataCell>
          <CTableDataCell>06.06.2024, 04:00:00</CTableDataCell>
          <CTableDataCell>80</CTableDataCell>
          <CTableDataCell>2</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

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
