<template>
  <div class="hello">
    <button @click="addTutor">ADD TUTOR</button>
    <button @click="getTutors">TEST</button>
    {{ tutorsList }}
  </div>
</template>
  
<script>
import { db } from "../../firebaseInitializer";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default {
  name: "Dashboard",
  data() {
    return {
      tutorsList: [],
    };
  },
  methods: {
    async addTutor(
      // firstName,
      // lastName,
      // specialization,
      // description,
      // pricePerHour
    ) {
      try {
        const docRef = await addDoc(collection(db, "tutors"), {
          first: 'firstName',
          last: 'lastName',
          specialization: "Mata",
          description: 'description',
          pricePerHour: 100,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },
    async getTutors() {
      try {
        const querySnapshot = await getDocs(collection(db, "tutors"));
        querySnapshot.forEach((doc) => {
          this.tutorsList.push(doc.data())
          console.log(`${doc.id} => ${doc.data()}`);
        });
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    },
    async updateTutor(tutorId, newData) {
      try {
        await updateDoc(doc(db, "tutors", tutorId), newData);
        console.log("Document successfully updated!");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },
    async deleteTutor(tutorId) {
      try {
        await deleteDoc(doc(db, "tutors", tutorId));
        console.log("Document successfully deleted!");
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    },
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
  