<template>
  <div>
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
