<template>
  <div>
    <VisitsList />
  </div>
</template>

<script>
// @ is an alias to /src
import VisitsList from "@/components/VisitsList.vue";

export default {
  name: "HomeView",
  components: {
    VisitsList,
  },
};
</script>
