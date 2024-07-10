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
  CNavbar,
  CContainer,
  CNavbarNav,
  CNavbarBrand,
  CForm,
  CFormInput,
  CDropdown,
  CDropdownToggle,
} from "@coreui/vue";
import { ref, computed, onMounted, watch } from 'vue';
import store from '../store/index';
import MakeVisitDialog from './MakeVisitDialog.vue';
import { db, storage, perf, analytics, dbPromiseTutors, getIdbData, putIdbData, isUpdated } from "../firebaseInitializer";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { ref as firebaseRef, getDownloadURL } from "firebase/storage";
import { trace } from "firebase/performance";
import { logEvent } from "firebase/analytics";
import { pl } from 'date-fns/locale';
import { format } from 'date-fns';

// Initialize trace variable for performance monitoring
let t;
const startTime = performance.now();
const tutors = ref([]);
const tutorVisits = ref([]);
const date = ref(new Date());
const today = new Date();
const attrs = computed(() => [
  ...tutorVisits.value.map(visit => ({
    dates: today,
    dot: {
      color: 'green',
    },
    popover: true,
    customData: visit,
  })),
]);

const rules = ref({
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

// Filtered Tutors Computed Property
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

// Function to process tutor document
const processTutorDoc = async (doc) => {
  const data = doc.data();
  const born = new Date(data.born);
  data.age = Math.floor((today - born) / (1000 * 60 * 60 * 24 * 365.25));
  const img = await getProfileImg(data.userId);
  return { id: doc.id, data, img };
};

// Function to get tutors
const getTutors = async () => {
  tutors.value = [];
  const tutorsIdb = await getIdbData(dbPromiseTutors);

  const processAllDocs = async () => {
    const querySnapshot = await getDocs(collection(db, "tutor"));
    const data = await Promise.all(querySnapshot.docs.map(processTutorDoc));
    return data;
  };

  const dbPromiseTutorsIn = await dbPromiseTutors;

  if (tutorsIdb.length > 0 && isUpdated(dbPromiseTutorsIn, tutorsIdb)) {
    tutors.value.push(...tutorsIdb);
  } else {
    const tmp = await processAllDocs();
    tutors.value = tmp;
    putIdbData(dbPromiseTutors, tmp);
  }
};

// Function to get profile image
const getProfileImg = async (uid) => {
  const defaultUrl = await getDownloadURL(firebaseRef(storage, 'profile-img/default-img.png')).catch(() => '');
  const userUrl = await getDownloadURL(firebaseRef(storage, `profile-img/${uid}.jpg`)).catch(() => defaultUrl);
  return userUrl;
};

// Function to handle tutor details view
const tutorDetails = (tutor) => {
  selectedTutor.value = tutor;
  visibleTop.value = true;
};

// Function to handle modal opened event
const handleModalOpened = () => {
  try {
    t.stop();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    logEvent(analytics, 'choose_tutor_time', { value: executionTime.toFixed(2) });
  } catch (error) {
    console.error(error);
  }
};

// onMounted Lifecycle Hook
onMounted(async () => {
  getTutors();
  store.commit('setTmpVisitDate', date);
  try {
    t = trace(perf, "choose_tutor_time");
    t.start();
  } catch (e) {
    console.error(e);
  }
});

// Watcher for date
watch(date, newDate => store.commit('setTmpVisitDate', newDate));

// Watcher for selected tutor
watch(selectedTutor, async (newVal) => {
  const q = query(collection(db, "visit"), where("tutorId", "==", newVal.id));
  const querySnapshotVisit = await getDocs(q);
  tutorVisits.value = querySnapshotVisit.docs.map(doc => {
    const data = doc.data();
    data.visitDate = formatDate(data.visitDate);
    return data;
  });
});

// Function to format date
function formatDate(date) {
  const timestamp = new Timestamp(date.seconds, date.nanoseconds);
  return format(timestamp.toDate(), 'Pp', { locale: pl });
}
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
              <CImage style="position: absolute" width="100" height="100" :src="tutor.img" />
              <CCardBody>
                <CCardTitle>{{ tutor.data.first }} {{ tutor.data.last }}</CCardTitle>
                <CCardText>
                  Wiek: {{ tutor.data.age }}<br>
                  Przedmiot: {{ tutor.data.subject }}<br>
                  Poziom: {{ tutor.data.level }}<br>
                  Stawka (h): {{ tutor.data.hourRate }}<br>
                  Bio: {{ tutor.data.description }}<br>
                  Ocena: ⭐⭐⭐⭐<br>
                  🗺️ ul. Testowa {{ Math.floor(tutor.data.hourRate * 1.33) }} Warszawa
                </CCardText>
                <CButton color="primary" @click="tutorDetails(tutor)">Szczegóły</CButton>
              </CCardBody>
            </CCard>
          </li>
        </ul>
      </div>
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
        Przedmiot: {{ selectedTutor.data.subject }}<br>
        Poziom: {{ selectedTutor.data.level }}<br>
        Stawka (h): {{ selectedTutor.data.hourRate }}<br>
        Bio: {{ selectedTutor.data.description }}<br>
        <MakeVisitDialog btnText="Umów" :tutor="selectedTutor" @open="handleModalOpened" />
        <br>
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
