<template>
  <div>
    <TutorsList />
  </div>
</template>

<script>
// @ is an alias to /src
import TutorsList from "@/components/TutorListNew.vue";

export default {
  name: "HomeView",
  components: {
    TutorsList,
  },
};
</script>
