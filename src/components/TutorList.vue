<script setup>
import {
  CCard,
  CImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CButton,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CNavItem,
  CNav,
  CNavbar,
  CContainer,
  CNavbarNav,
  CCollapse,
  CNavbarToggler,
  CNavbarBrand,
  CForm,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CRow,
  CCol
} from "@coreui/vue";
import { ref, computed, onMounted } from 'vue';
import Calendar from "./Calendar.vue";
import MakeVisitDialog from './MakeVisitDialog.vue'; // załóżmy, że taka jest nazwa twojego komponentu dialogowego
import { db, storage, perf, analytics } from "../firebaseInitializer";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { ref as firebaseRef, getDownloadURL } from "firebase/storage";
import { trace } from "firebase/performance";
import { logEvent } from "firebase/analytics";

let visible = ref(true)
const tutors = ref([]);
const selectedTutor = ref({
  id: '',
  data: {
    last: '',
    userId: '',
    level: '',
    first: '',
    subject: '',
    born: '',
    isActiveTutor: true,
    description: '',
    hourRate: 0
  },
  img: ''
});
const visibleTop = ref(false);
const subjectFilter = ref('');
const locationFilter = ref('');
const priceFilter = ref(null);
const ratingFilter = ref(null);
const sortOption = ref('');

const filteredTutors = computed(() => {
  let result = tutors.value;

  if (subjectFilter.value) {
    result = result.filter(tutor => tutor.data.subject.includes(subjectFilter.value));
  }
  if (locationFilter.value) {
    result = result.filter(tutor => tutor.data.location && tutor.data.location.includes(locationFilter.value));
  }
  if (priceFilter.value !== null) {
    result = result.filter(tutor => tutor.data.hourRate <= priceFilter.value);
  }
  if (ratingFilter.value !== null) {
    result = result.filter(tutor => tutor.data.rating && tutor.data.rating >= ratingFilter.value);
  }

  if (sortOption.value) {
    if (sortOption.value === 'price') {
      result = result.sort((a, b) => a.data.hourRate - b.data.hourRate);
    } else if (sortOption.value === 'rating') {
      result = result.sort((a, b) => b.data.rating - a.data.rating);
    }
  }

  return result;
});

// Inicjalizacja zmiennej, która przechowa referencję do trace
let t;
const startTime = performance.now()
// Funkcja do sprawdzania, czy zmienna `perf` została zainicjowana
const checkPerfInitialization = () => {
  try {
    t = trace(perf, "choose_tutor_time");
  } catch (e) {
    setTimeout(checkPerfInitialization, 100); // Sprawdź ponownie za 100 milisekund
  }
};

// Wywołanie funkcji sprawdzającej inicjalizację zmiennej `perf`
checkPerfInitialization();

const getTutors = async () => {
  tutors.value = [];
  const querySnapshot = await getDocs(collection(db, "tutor")); // TODO warunek isActiveTutor
  querySnapshot.forEach(async (doc) => {
    // console.log(`${doc.id} => ${doc.data()}`);
    let data = doc.data();

    const today = new Date();
    const born = new Date(data.born);
    let mils = today - born;
    data.age = Math.floor(mils / (1000 * 60 * 60 * 24 * 365.25));

    let img = await getProfileImg(data.userId);
    let formatData = { id: doc.id, data: data, img: img };
    tutors.value.push(formatData);
  });
  // perf
  try {
    t.start();
  } catch (e) {
    console.error(e);
  }

};

const getProfileImg = async (uid) => {
  let spaceRef = firebaseRef(storage, `profile-img/${uid}.jpg`);
  let defRef = firebaseRef(storage, 'profile-img/default-img.png');
  try {
    let url = await getDownloadURL(spaceRef)
      .then((url) => {

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        return url
      })
      .catch((error) => {
        // Handle any errors
      });
    return url

  } catch (error) {
    let url = await getDownloadURL(defRef)
      .then((url) => {

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        return url
      })
      .catch((error) => {
        // Handle any errors
      });
    return url
  }
};

const tutorDetails = (tutor) => {
  selectedTutor.value = tutor;
  visibleTop.value = true;
};

const handleModalOpened = () => {
  // perf
  try {
    t.stop();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    const logData = { name: 'choose_tutor_time', value: Number(executionTime.toFixed(2)) }
    logEvent(analytics, logData.name, { value: logData.value });
    
  } catch (error) {
    
  }

};

onMounted(() => {
  getTutors();
});
</script>

<template>
  <div>
    <CNavbar expand="lg" style="background-color: rgba(255, 255, 255, 0);">
      <CNavbarBrand>Filtry</CNavbarBrand>
      <CContainer fluid>
        <CNavbarNav>
          <CForm class="d-flex">
            <CFormInput class="me-2" id="subject" v-model="subjectFilter" placeholder="Przedmiot" />
            <CFormInput class="me-2" id="subject" v-model="subjectFilter" placeholder="Poziom" />
            <CFormInput class="me-2" id="location" v-model="locationFilter" placeholder="Lokalizacja" />
            <CFormInput class="me-2" id="price" v-model.number="priceFilter" type="number" placeholder="Maks stawka" />
            <CDropdown class='bg-light' variant="nav-item" :popper="false">
              <CDropdownToggle color="secondary">Sortowanie</CDropdownToggle>
              <!-- <CDropdownMenu id="sort" v-model="sortOption">
                <CDropdownItem value="">test</CDropdownItem>
                <CDropdownItem value="price">Cena</CDropdownItem>
                <CDropdownItem value="rating">Ocena</CDropdownItem>
              </CDropdownMenu> -->

              <!-- <select id="sort" v-model="sortOption">
                  <option value="">Sortowanie</option>
                  <option value="price">Cena</option>
                  <option value="rating">Ocena</option>
                </select> -->
            </CDropdown>
            <!-- <CButton type="submit" color="success" variant="outline">
              Search
            </CButton> -->
          </CForm>
        </CNavbarNav>
      </CContainer>
    </CNavbar>
    
    <CContainer>
      <!-- <CRow> -->
        <!-- <CCol class="align-self-center"> -->
          <div v-if="filteredTutors.length > 0">
            <ul>
              <li v-for="(tutor, index) in filteredTutors" :key="index">
                <CCard style="">
                  <CImage style="position: absolute" width="100" height="100" :src="tutor.img" />
                  <CCardBody>
                    <CCardTitle>{{ tutor.data.first }} {{ tutor.data.last }}</CCardTitle>
                    <CCardText>Wiek: {{ tutor.data.age }}<br>
                      Przedmiot:{{ tutor.data.subject }}<br>
                      Poziom: {{ tutor.data.level }} <br>
                      Stawka (h) {{ tutor.data.hourRate }} <br>
                      Bio: {{ tutor.data.description }} <br>
                      Ocena ⭐⭐⭐⭐<br>
                      🗺️ ul. Testowa {{ Math.floor(tutor.data.hourRate * 1.33) }} Warszawa<br></CCardText>
                    <CButton color="primary" @click="tutorDetails(tutor)">Szczegóły</CButton>
                  </CCardBody>
                </CCard>
              </li>
            </ul>
          </div>
        <!-- </CCol> -->
      <!-- </CRow> -->
    </CContainer>

    <COffcanvas placement="start" :visible="visibleTop" @hide="() => { visibleTop = !visibleTop }">
      <COffcanvasHeader>
        <div v-if="selectedTutor">
          <COffcanvasTitle>
            <CImage width="50" height="50" :src="selectedTutor.img" alt="" /> {{ selectedTutor.data.first }} {{
              selectedTutor.data.last }}
          </COffcanvasTitle>
        </div>
        <CCloseButton class="text-reset" @click="() => { visibleTop = false }" />
      </COffcanvasHeader>
      <COffcanvasBody>
        Wiek: {{ selectedTutor.data.age }}<br>
        Przedmiot:{{ selectedTutor.data.subject }}<br>
        Poziom: {{ selectedTutor.data.level }} <br>
        Stawka (h) {{ selectedTutor.data.hourRate }} <br>
        Bio: {{ selectedTutor.data.description }}<br>
        <MakeVisitDialog btnText="Umów"  :tutor="selectedTutor" @open="handleModalOpened" />
        <Calendar />
      </COffcanvasBody>
    </COffcanvas>
  </div>
</template>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  position: relative;
  /* Dodane dla przycisku usuwania */
}

form {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
