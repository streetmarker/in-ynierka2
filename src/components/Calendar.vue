<template>
  <div class="calendar">
    <p>Wybrana data: {{ formattedDate }}</p>
    <vue-cal v-model:selected-date="selectedDate" :events="events" :week-start="1" :show-weekend="true"
    active-view="week"
    :disable-views="['years']"
      @cell-click="handleDayClick" :show-all-day-events="true">
      <template v-slot:event="{ event }">
    <div :class="['custom-event', { 'all-day': event.allDay, 'split': event.split }]">
      <button>Wizyta</button>
      <!-- <p class="title">{{ event.title }}</p>
      <p class="time">{{ event.start.toLocaleTimeString() }} - {{ event.end.toLocaleTimeString() }}</p> -->
    </div>
  </template>
</vue-cal>

  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  components: {
    VueCal,
  },
  data() {
    return {
      selectedDate: null,
      formattedDate: null,
      events: [
        {
          start: new Date(new Date().setHours(28, 0, 0)),
          end: new Date(new Date().setHours(30, 0, 0)),
          // allDay: true,
          title: 'Event 1',
          split: 2
        },
        {
          start: new Date(new Date().setHours(2, 0, 0)),
          end: new Date(new Date().setHours(3, 0, 0)),
          title: 'Event 2',
          split: 2
        },
        {
          start: new Date(new Date().setHours(5, 0, 0)),
          end: new Date(new Date().setHours(6, 0, 0)),
          title: 'Event 3',
          split: 2
        }
      ],
    };
  },
  methods: {
    handleDayClick(date) {
      date.setMinutes(0);
      this.selectedDate = date;
      this.formattedDate = date.toLocaleString();
      // Tutaj możesz dodać logikę obsługi kliknięcia na dzień kalendarza
      // Na przykład otwierając formularz do umawiania wizyt na wybraną datę
    },
  },
};
</script>
<!-- 
<style scoped>
/* Stylizacja eventów */
.vue-cal-event {
  background-color: #007bff; /* Kolor tła */
  color: #403dd3; /* Kolor tekstu */
  border-radius: 4px; /* Zaokrąglenie rogów */
  padding: 5px; /* Wewnętrzny margines */
  margin-bottom: 5px; /* Zewnętrzny margines */
}

/* Stylizacja eventów typu allDay */
.vue-cal-event-all-day {
  background-color: #28a745; /* Inny kolor tła dla eventów całodniowych */
}

/* Stylizacja eventów z opcją split */
.vue-cal-event-split {
  border: 1px solid #ffc107; /* Obramowanie dla eventów z opcją split */
}

/* Dodatkowe style dla tytułu eventu */
.vue-cal-event-title {
  font-weight: bold; /* Pogrubienie tytułu */
}

/* Dodatkowe style dla czasu eventu */
.vue-cal-event-time {
  font-style: italic; /* Kursywa dla czasu */
}

/* Dodatkowe style dla eventów z opcją split */
.vue-cal-event-split:before {
  content: ''; /* Pusty element przed eventem */
  display: block; /* Wyświetl jako blok */
  width: 0; /* Szerokość */
  height: 0; /* Wysokość */
  border-left: 4px solid transparent; /* Lewa krawędź (pusta) */
  border-right: 4px solid transparent; /* Prawa krawędź (pusta) */
  border-top: 4px solid #ffc107; /* Górna krawędź (kolor) */
  position: absolute; /* Pozycja absolutna */
  top: -4px; /* Przesunięcie góra/dół */
  left: 50%; /* Wyrównanie do środka */
  transform: translateX(-50%); /* Przesunięcie do środka */
};

</style> -->

