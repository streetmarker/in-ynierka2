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
  COffcanvasBody
} from "@coreui/vue";
</script>

<template>
  <div class="hello">
    <div v-if="tutors.length > 0">
      <ul>
        <li v-for="(tutor, index) in tutors" :key="index">
          <!-- <img :src="tutor.img" alt="">
          {{ tutor.data.first }} {{ tutor.data.last }} (Ur.
          {{ tutor.data.born }}), {{ tutor.data.subject }},
          {{ tutor.data.level }} -->

          <CCard style="width: 18rem">
            <CImage width="50" height="50" :src="tutor.img" />
            <CCardBody>
              <CCardTitle>{{ tutor.data.first }} {{ tutor.data.last }}</CCardTitle>
              <CCardText>Wiek: {{ tutor.data.age }}<br>
                Przedmiot:{{ tutor.data.subject }}<br>
                Poziom: {{ tutor.data.level }} <br>
                Stawka (h) {{ tutor.data.hourRate }} <br>
                Bio: {{ tutor.data.description }}</CCardText>

              <!-- <CButton color="primary" href="#">Szczegóły</CButton> -->
              <CButton color="primary" @click="tutorDetails(tutor)">Szczegóły</CButton>
            </CCardBody>
          </CCard>
        </li>
      </ul>
    </div>
    <!-- <CButton color="primary" @click="() => { visibleTop = !visibleTop }">Toggle top offcanvas</CButton> -->
    <COffcanvas placement="start" :visible="visibleTop" @hide="() => { visibleTop = !visibleTop }">
      <COffcanvasHeader>
        <div v-if="tutors.length > 0">
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
        <MakeVisitDialog  btnText="Umów" :showDialog="visitDialog" :tutor="selectedTutor" @mounted="handleModalMounted" />
        <Calendar />
      </COffcanvasBody>
    </COffcanvas>
  </div>
</template>

<script>
import Calendar from "./Calendar.vue";
import { ref } from 'vue';
import MakeVisitDialog from './MakeVisitDialog.vue'; // załóżmy, że taka jest nazwa twojego komponentu dialogowego

// const dialogOpen = ref(false);
import { db, storage, perf } from "../firebaseInitializer";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref as firebaseRef, getDownloadURL } from "firebase/storage";
import { trace } from "firebase/performance";

// setTimeout(() => {
//   console.log(perf);
// }, 2000);
// Inicjalizacja zmiennej, która przechowa referencję do trace
let t;

// Funkcja do sprawdzania, czy zmienna `perf` została zainicjowana
const checkPerfInitialization = () => {
  try {
    t = trace(perf, "choose_tutor_time");
  } catch (e) {
    setTimeout(checkPerfInitialization, 100); // Sprawdź ponownie za 100 milisekund
  }
  // if (perf && perf.initialized === true) {
  //   // `perf` jest zainicjowane, możemy wykonać logikę związana z tym
  //   t = trace(perf, "choose_tutor_time");

  //   // Tutaj możesz wykonać inne czynności, które wymagają zmiennej `perf`
  //   // np. dodanie oznaczeń do śledzenia wydajności
  // } else {
  //   // Zmienna `perf` nie została jeszcze zainicjowana, czekamy i sprawdzamy ponownie za krótki okres czasu
  //   setTimeout(checkPerfInitialization, 100); // Sprawdź ponownie za 100 milisekund
  // }
};

// Wywołanie funkcji sprawdzającej inicjalizację zmiennej `perf`
checkPerfInitialization();

export default {
  name: "Dashboard",
  components: {
    Calendar,
  },
  data() {
    return {
      visitDialog:false,
      tutors: [],
      selectedTutor: {
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
      },
      visibleTop: false,
    };
  },
  mounted() {
    this.getTutors();
  },
  methods: {
    handleModalMounted() {
      // perf
      t.stop();

    },
    async getTutors() {
      this.tutors = [];
      const querySnapshot = await getDocs(collection(db, "tutor")); // TODO warunek isActiveTutor
      querySnapshot.forEach(async (doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        let data = doc.data();

        const today = new Date();
        const born = new Date(data.born);
        let mils = today - born;
        data.age = Math.floor(mils / (1000 * 60 * 60 * 24 * 365.25));

        let img = await this.getProfileImg(data.userId);
        let formatData = { id: doc.id, data: data, img: img };
        this.tutors.push(formatData);
      });
      // perf
      t.start();

    },
    tutorDetails(tutor) {
      this.selectedTutor = tutor;
      this.visibleTop = true;
    },
    async getProfileImg(uid) {

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
    }
  },
};
</script>

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
