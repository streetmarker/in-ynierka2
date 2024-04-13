<template>
  <div class="home">
    <!-- <div class="container">
      <div class="row">
        <div class="col-sm"></div> -->
        <div v-if="userData.fullName.length !== 0">
          <img alt="Vue logo" src="../assets/logo.png" />
          <h1>{{ userData.fullName }}</h1>
          <p>{{ userData.email }}</p>
          <img :src="userData.photo">
        </div>
        <!-- <div class="col-sm"></div>
      </div>
    </div> -->
  </div>
</template>

<script>

export default {
  name: "ClientPanel",
  // data() {
  //   return {
  //     userData: null
  //   };
  // },
  computed: {
    userData() {
      return this.$store.state.user; // TODO do komponentu
    },
  },
};
</script>
