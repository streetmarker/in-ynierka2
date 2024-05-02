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
      <h3>Lista Korepetytorów:</h3>
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
              <CCardText>(Ur.
                {{ tutor.data.born }}), {{ tutor.data.subject }},
                {{ tutor.data.level }}
              </CCardText>
              <!-- <CButton color="primary" href="#">Szczegóły</CButton> -->
              <CButton color="primary" @click="tutorDetails(tutor)">Szczegóły</CButton>
            </CCardBody>
          </CCard>
        </li>
      </ul>
    </div>
    <!-- <CButton color="primary" @click="() => { visibleTop = !visibleTop }">Toggle top offcanvas</CButton> -->
  <COffcanvas placement="top" :visible="visibleTop" @hide="() => { visibleTop = !visibleTop }">
    <COffcanvasHeader>
      <div v-if="tutors.length > 0">
        <COffcanvasTitle><CImage width="50" height="50" :src="selectedTutor.img" alt="" /> {{ selectedTutor.data.first }} {{ selectedTutor.data.last }}</COffcanvasTitle>
      </div>
      <!-- <COffcanvasTitle>{{ selectedTutor }}</COffcanvasTitle> -->
      <CCloseButton class="text-reset" @click="() => { visibleTop = false }"/>
    </COffcanvasHeader>
    <COffcanvasBody>
      Opis
      Kalendaż
      Umów wizytę
      <Calendar />
    </COffcanvasBody>
  </COffcanvas>
  </div>
</template>

<script>
import Calendar from "./Calendar.vue";
import { db, storage } from "../firebaseInitializer";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";


export default {
  name: "Dashboard",
  components: {
    Calendar,
  },
  data() {
    return {
      tutors: [],
      selectedTutor: {
        id: '',
        data: {
          last:'',
          userId:'',
          level:'',
          first:'',
          subject:'',
          born:''},
        img:''},
      visibleTop: false,
    };
  },
  mounted() {
    this.getTutors();
  },
  methods: {
    async getTutors() {
      this.tutors = [];
      const querySnapshot = await getDocs(collection(db, "tutor")); // TODO warunek isActiveTutor
      querySnapshot.forEach(async (doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        let data = doc.data()
        let img = await this.getProfileImg(data.userId);
        let formatData = { id: doc.id, data: data, img: img };
        this.tutors.push(formatData);
      });
    },
    tutorDetails(tutor){
      this.selectedTutor = tutor;
      this.visibleTop = true;
    },
    async getProfileImg(uid) {

      let spaceRef = ref(storage, `profile-img/${uid}.jpg`);
      let defRef = ref(storage, 'profile-img/default-img.png');
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
