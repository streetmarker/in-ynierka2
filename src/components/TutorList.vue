<template>
  <div class="hello">
    <div class="container">
      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
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
          <div>
            <h3>Dodaj Korepetytora:</h3>
            <form @submit.prevent="addTutor">
              <label for="firstName">Imię:</label>
              <input
                type="text"
                id="firstName"
                v-model="newTutor.first"
                required
              />
              <label for="lastName">Nazwisko:</label>
              <input
                type="text"
                id="lastName"
                v-model="newTutor.last"
                required
              />
              <label for="birthDate">Data urodzenia:</label>
              <input
                type="date"
                id="birthDate"
                v-model="newTutor.born"
                required
              />
              <label for="subject">Przedmiot:</label>
              <select id="subject" v-model="newTutor.subject" required>
                <option value="Matematyka">Matematyka</option>
                <option value="Fizyka">Fizyka</option>
                <option value="Chemia">Chemia</option>
              </select>
              <label for="level">Poziom:</label>
              <select id="level" v-model="newTutor.level" required>
                <option value="Szkoła podstawowa">Szkoła podstawowa</option>
                <option value="Szkoła średnia">Szkoła średnia</option>
                <option value="Szkoła średnia rozszerzenie">
                  Szkoła średnia rozszerzenie
                </option>
                <option value="Studia">Studia</option>
              </select>
              <button type="submit">Dodaj Korepetytora</button>
            </form>
          </div>
        </div>
        <div class="col-sm"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, token } from "../../firebaseInitializer";
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
      newTutor: {
        first: "",
        last: "",
        born: null,
        subject: "",
        level: "",
      },
      token: null,
      selectedTutor: null,
    };
  },
  mounted() {
    this.getTutors();
    this.getToken();
  },
  methods: {
    async getToken() {
      this.token = await token;
    },
    async addTutor() {
      try {
        await addDoc(collection(db, "users"), this.newTutor);
        console.log("Nowy korepetytor został dodany.");
        this.newTutor = {
          first: "",
          last: "",
          born: null,
          subject: "",
          level: "",
        }; // Czyść formularz po dodaniu
        await this.getTutors(); // Odśwież listę korepetytorów po dodaniu
      } catch (error) {
        console.error("Błąd podczas dodawania korepetytora:", error);
      }
    },
    async getTutors() {
      this.tutors = [];
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        let formatData = { id: doc.id, data: doc.data() };
        this.tutors.push(formatData);
      });
    },
    async confirmDeleteTutor(tutor) {
      this.selectedTutor = tutor;
      if (
        confirm(
          `Czy na pewno chcesz usunąć korepetytora ${tutor.data.first} ${tutor.data.last}?`
        )
      ) {
        await this.deleteTutor();
      }
    },
    async deleteTutor() {
      try {
        if (this.selectedTutor) {
          await deleteDoc(doc(db, "users", this.selectedTutor.id));
          console.log("Korepetytor został usunięty.");
          this.selectedTutor = null;
          await this.getTutors(); // Odśwież listę korepetytorów po usunięciu
        }
      } catch (error) {
        console.error("Błąd podczas usuwania korepetytora:", error);
      }
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
