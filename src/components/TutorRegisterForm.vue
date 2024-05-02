<template>
  <div>
    <h3>Formularz rejestracyjny</h3>
    <form @submit.prevent="addTutor">
      <label for="firstName">Imię:</label>
      <input type="text" id="firstName" v-model="newTutor.first" required />
      <label for="lastName">Nazwisko:</label>
      <input type="text" id="lastName" v-model="newTutor.last" required />
      <label for="birthDate">Data urodzenia:</label>
      <input type="date" id="birthDate" v-model="newTutor.born" required />
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
      Stawka
      <input type="number" id="hourRate" v-model="newTutor.hourRate" required />
      Opis
      <input
        type="text"
        id="description"
        v-model="newTutor.description"
        required
      />
      <button type="submit">Wyślij zgłoszenie</button>
    </form>
  </div>
</template>

<script>
import { db, token, auth } from "../firebaseInitializer";
import { collection, addDoc } from "firebase/firestore";

export default {
  name: "Tutor Form",
  data() {
    return {
      newTutor: {
        first: "",
        last: "",
        born: null,
        subject: "",
        level: "",
        userId: "",
        description: "",
        hourRate: 0,
        isActiveTutor: false,
      },
      token: null,
    };
  },
  mounted() {
    this.getToken();
  },
  methods: {
    async getToken() {
      this.token = await token;
    },
    async addTutor() {
      this.newTutor.userId = auth.currentUser.uid; // TODO docelowo zaczytywane na formularzu rejestracyjym
      try {
        await addDoc(collection(db, "tutor"), this.newTutor); // TODO FIX rozdział na user i tutor
        console.log("Nowy korepetytor (niezatwierdzony) został dodany.");
      } catch (error) {
        console.error("Błąd podczas rejestracji korepetytora:", error);
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
