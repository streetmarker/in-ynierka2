<template>
  <div class="hello">
    <div v-if="tutors.length > 0">
      <h3>Lista Korepetytorów:</h3>
      <ul>
        <li v-for="(tutor, index) in tutors" :key="index">
          {{ tutor.data.first }} {{ tutor.data.last }} (Ur.
          {{ tutor.data.born }}), {{ tutor.data.subject }},
          {{ tutor.data.level }}
          <button @click="confirmDeleteTutor(tutor)">Usuń</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { db, token, auth} from "../firebaseInitializer";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default {
  name: "Dashboard",
  data() {
    return {
      tutors: [],
      selectedTutor: null,
    };
  },
  mounted() {
    this.getTutors();
    this.getToken();
  },
  methods: {
    async getTutors() {
      this.tutors = [];
      const querySnapshot = await getDocs(collection(db, "tutor")); // TODO warunek isActiveTutor
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        let formatData = { id: doc.id, data: doc.data() };
        this.tutors.push(formatData);
      });
    },
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
  position: relative; /* Dodane dla przycisku usuwania */
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
