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
import store from '../store/index';
import { ref, computed, onMounted, watch } from 'vue';
// import SimpleCalendar from "./SimpleCalendar.vue";
import MakeVisitDialog from './MakeVisitDialog.vue'; // załóżmy, że taka jest nazwa twojego komponentu dialogowego
import { db, storage, perf, analytics, dbPromiseTutors, getIdbData, putIdbData, isUpdated } from "../firebaseInitializer";
import {
  collection,
  getDocs,
  query, where, Timestamp
} from "firebase/firestore";
import { ref as firebaseRef, getDownloadURL } from "firebase/storage";
import { trace } from "firebase/performance";
import { logEvent } from "firebase/analytics";
import { pl } from 'date-fns/locale'
import { format } from 'date-fns';

let visible = ref(true)
const tutors = ref([]);
var tutorVisits = ref([]);
let date = ref(new Date());
var today = new Date();

const visitsCal = ref([
  {
    date: today,
    color: 'green',
    description: '14:00-15:00 Testowa wizyta'
  },
  {
    date: today,
    color: 'green',
    description: '16:00-17:00 Testowa wizyta'
  }
])
var attrs = computed(() => [
  // ...visitsCal.value.map(visit => ({
  //   dates: visit.date,
  //   dot: {
  //     color: visit.color,
  //     // ...(visit.isComplete && { class: 'opacity-75' }),
  //   },
  //   // popover: {
  //   //   label: visit.description,
  //   // },
  //   popover: true,
  //   customData: visit,
  // })),
  ...tutorVisits.value.map(visit => ({
    dates: today,
    dot: {
      color: 'green',
      // ...(visit.isComplete && { class: 'opacity-75' }),
    },
    // popover: {
    //   label: visit.description,
    // },
    popover: true,
    customData: visit,
  })),
]);
const rules = ref({
  // hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});
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
  const tutorsIdb = await getIdbData(dbPromiseTutors);
  // obsługa danych
  const processDoc = async (doc) => {
    let data = doc.data();

    const today = new Date();
    const born = new Date(data.born);
    let mils = today - born;
    data.age = Math.floor(mils / (1000 * 60 * 60 * 24 * 365.25));

    let img = await getProfileImg(data.userId);
    let formatData = { id: doc.id, data: data, img: img };

    tutors.value.push(formatData);
    return formatData;
  };
  // pobranie z zapisem do cache
  const processAllDocs = async () => {
    const querySnapshot = await getDocs(collection(db, "tutor")); // TODO warunek isActiveTutor
    const data = [];
    const promises = [];

    querySnapshot.forEach((doc) => {
      promises.push(processDoc(doc).then((formatData) => data.push(formatData)));
    });

    await Promise.all(promises);

    if (data.length > 0) {
      putIdbData(dbPromiseTutors, data);
    }
  };
  // console.log('len met', tutorsIdb.length > 0 && !isUpdated(dbPromiseTutors, tutorsIdb),  tutorsIdb.length, !isUpdated(dbPromiseTutors, tutorsIdb));

  // pobieramy z firestore pod warunkiem, domyślnie cache
  if (tutorsIdb.length > 0 && !isUpdated(dbPromiseTutors, tutorsIdb)) {
    tutorsIdb.forEach(el => { // TODO obsługa updatu listy i refactor
      tutors.value.push(el);
    });
  } else {
    processAllDocs();
  }

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
  store.commit('setTmpVisitDate', date);
});

watch(date, (newDate, oldDate) => {
  // console.log("tmpdate WATCH");
  // newDate.setMinutes(0);
  // this.selectedDate = date;
  // this.formattedDate = date.toLocaleString();
  store.commit('setTmpVisitDate', newDate);
});
watch(selectedTutor, async (newVal, oldVal) => {
  const q = query(collection(db, "visit"), where("tutorId", "==", newVal.id));
  console.log('tutotid', newVal.id);
  const querySnapshotVisit = await getDocs(q);
  let arr = [];
  querySnapshotVisit.docs.forEach(element => {
    let e = element.data();
    e.visitDate = formatDate(e.visitDate)
    arr.push(e);
  });
  tutorVisits.value = arr;
  console.log('selectedTutor', tutorVisits);

  function formatDate(date) {
    const timestamp = new Timestamp(date.seconds, date.nanoseconds);
    var tmp = format(timestamp.toDate(), 'Pp', { locale: pl });
    return tmp
  }
})
</script>

<template>
  <div>
    <CNavbar expand="lg" color-scheme="dark" class="bg-light" style="padding: 3px; border-radius: 10px;">
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
        <MakeVisitDialog btnText="Umów" :tutor="selectedTutor" @open="handleModalOpened" />
        <br>
        <!-- <SimpleCalendar /> -->
        Kalendarz dostępności
        <br>
        <VCalendar :attributes="attrs">
          <template #day-popover="{ dayTitle }">
            <div class="px-2">
              <div class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center">
                Wizyty danego dnia:
                <br>
              </div>
              <ul>
                <li v-for="{ key, customData } in attrs" :key="key"
                  class="block text-xs text-gray-700 dark:text-gray-300 bg-red-100">
                  {{ customData.visitDate }}
                </li>
              </ul>
            </div>
          </template>
        </VCalendar>
        <br>
        Wybrana data: {{ date }}
        <br>
        <VDatePicker v-model="date" :rules="rules" mode="dateTime" is-required />
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
