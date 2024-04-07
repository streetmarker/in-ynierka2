<template>
  <div class="hello">
    <button @click="test2">TEST</button>
    {{ tmp }}
  </div>
</template>
  
<script>
import { db } from "../../firebaseInitializer";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default {
  name: "Dashboard",
  data () {
    return {
      tmp: []
    }
  },
  methods: {
    async test() {
      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async test2() {
      this.tmp=[];
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        this.tmp.push(doc.data())
      });
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
  