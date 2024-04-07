<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <TutorsList />
  </div>
</template>

<script>
// @ is an alias to /src
import TutorsList from "@/components/TutorList.vue";

export default {
  name: "HomeView",
  components: {
    TutorsList,
  },
};
</script>
