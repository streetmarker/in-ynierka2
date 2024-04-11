<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <img alt="Vue logo" src="../assets/logo.png" />
          <h1>{{ userData.fullName }}</h1>
          <p>{{ userData.email }}</p>
          <img :src="userData.photo">
        </div>
        <div class="col-sm"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex"; // Importowanie hooka useStore z Vuex

export default {
  name: "ClientPanel",
  // data() {
  //   return {
  //     userData: null
  //   };
  // },
  computed: {
    userData() {
      return this.$store.state.user;
    },
  },
};
</script>
