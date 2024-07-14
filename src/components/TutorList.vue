<script setup>
// import {
//   CCard,
//   CImage,
//   CCardBody,
//   CCardTitle,
//   CCardText,
//   CNavbar,
//   CContainer,
//   CNavbarNav,
//   CNavbarBrand,
//   CForm,
//   CFormInput,
//   CDropdown,
//   CDropdownToggle,
// } from "@coreui/vue";
import { ref, computed, onMounted, watch } from 'vue';
import store from '../store/index';
import TutorListLeftPanel from './TutorListLeftPanel.vue';
import { db, storage, dbPromiseTutors, getIdbData, putIdbData, isUpdated, timeTutor } from "../firebaseInitializer";
import { collection, getDocs } from "firebase/firestore";
import { ref as firebaseRef, getDownloadURL } from "firebase/storage";

// Inicjalizacja zmiennej, która przechowa referencję do trace
const startTime = performance.now();
const tutors = ref([]);
let date = ref(new Date());
var today = new Date();


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
    result = result.sort((a, b) => sortOption.value === 'price' ? a.data.hourRate - b.data.hourRate : b.data.rating - a.data.rating);
  }

  return result;
});


const processTutorDoc = async (doc) => {
  const data = doc.data();
  const born = new Date(data.born);
  data.age = Math.floor((today - born) / (1000 * 60 * 60 * 24 * 365.25));
  const img = await getProfileImg(data.userId);
  return { id: doc.id, data, img };
};

const getTutors = async () => {
  tutors.value = [];
  const tutorsIdb = await getIdbData(dbPromiseTutors);

  // pobranie z zapisem do cache
  const processAllDocs = async () => {
    const querySnapshot = await getDocs(collection(db, "tutor")); // TODO warunek isActiveTutor
    const data = await Promise.all(querySnapshot.docs.map(processTutorDoc));
    return data
  }
    const dbPromiseTutorsIn = await dbPromiseTutors;

    // pobieramy z firestore pod warunkiem, domyślnie cache
    if (tutorsIdb.length > 0 && isUpdated(dbPromiseTutorsIn, tutorsIdb)) { // TODO zamiast odpytywać db, podczas używania aplikacji zrobić oczekiwanie na update z firebase a tak to tylko na init
      tutors.value.push(...tutorsIdb);
      console.log('dane z cache');
      // TODO obsługa updatu listy i refactor
    } else {
      const tmp = await processAllDocs();
      tutors.value = tmp;
      putIdbData(dbPromiseTutors, tmp);
      console.log('dane z DB');
    }
  }
  // perf
  try {
    timeTutor.start();
  } catch (e) {
    console.log(e);
  }

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




// Funkcja do sprawdzania, czy zmienna `perf` została zainicjowana TODO
// const checkPerfInitialization = () => {
//   try {
//     t = trace(perf, "choose_tutor_time");
//   } catch (e) {
//     setTimeout(checkPerfInitialization, 100); // Sprawdź ponownie za 100 milisekund
//   }
// };

onMounted(async () => {
  getTutors();
  store.commit('setTmpVisitDate', date);
  // Wywołanie funkcji sprawdzającej inicjalizację zmiennej `perf`
  // checkPerfInitialization();
});

watch(date, newDate => store.commit('setTmpVisitDate', newDate));

</script>

<template>
  <div>
    <CNavbar expand="lg" color-scheme="dark" class="bg-light" style="padding: 3px; border-radius: 10px;">
      <CNavbarBrand>Filtry</CNavbarBrand>
      <CContainer fluid>
        <CNavbarNav>
          <CForm class="d-flex">
            <CFormInput class="me-2" v-model="subjectFilter" placeholder="Przedmiot" />
            <CFormInput class="me-2" v-model="subjectFilter" placeholder="Poziom" />
            <CFormInput class="me-2" v-model="locationFilter" placeholder="Lokalizacja" />
            <CFormInput class="me-2" v-model.number="priceFilter" type="number" placeholder="Maks stawka" />
            <CDropdown class="bg-light" variant="nav-item" :popper="false">
              <CDropdownToggle color="secondary">Sortowanie</CDropdownToggle>
            </CDropdown>
          </CForm>
        </CNavbarNav>
      </CContainer>
    </CNavbar>

    <CContainer>
      <div v-if="filteredTutors.length > 0">
        <ul>
          <li v-for="(tutor, index) in filteredTutors" :key="index">
            <CCard>
              <CImage style="position: absolute" width="100" height="100" :src="tutor.img" loading="lazy" />
              <CCardBody>
                <CCardTitle>{{ tutor.data.first }} {{ tutor.data.last }}</CCardTitle>
                <CCardText>
                  Wiek: {{ tutor.data.age }}<br>
                  Przedmiot: {{ tutor.data.subject }}<br>
                  Poziom: {{ tutor.data.level }}<br>
                  Stawka (h): {{ tutor.data.hourRate }}<br>
                  Bio: {{ tutor.data.description ? tutor.data.description.substring(0, 100) + '...' : '' }}<br>
                  Ocena: ⭐⭐⭐⭐<br>
                  🗺️ ul. Testowa {{ Math.floor(tutor.data.hourRate * 1.33) }} Warszawa
                </CCardText>
                <TutorListLeftPanel :selectedTutor="selectedTutor" @click="tutorDetails(tutor)"/>
              </CCardBody>
            </CCard>
          </li>
        </ul>
      </div>
    </CContainer>
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
