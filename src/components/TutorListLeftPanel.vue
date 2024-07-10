<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CImage,
  CButton,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CListGroup,
  CListGroupItem
} from "@coreui/vue";
import { ref, computed, watch } from 'vue';
import { db, perf, app, timeTutor } from "../firebaseInitializer";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import MakeVisitDialog from './MakeVisitDialog.vue';
import { pl } from 'date-fns/locale';
import { format } from 'date-fns';

const props = defineProps({
  selectedTutor: {
    type: Object,
    required: true
  }
})
var tutorVisits = ref([]);
let date = ref(new Date());
var visible = ref(false);

var attrs = computed(() => [
  ...tutorVisits.value.map(visit => ({
    dates: visit.visitDate.toDate(),
    dot: {
      color: 'green',
    },
    popover: true,
    customData: visit,
  })),
]);
const rules = ref({
  // hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});

watch(() => props.selectedTutor, async (newVal, oldVal) => {
  // selectedTutorIn = newVal;
  // console.log('watch panel');
  try {
    const q = query(collection(db, "visit"), where("tutorId", "==", newVal.id));
    // console.log('tutotid', newVal.id);
  
    const querySnapshotVisit = await getDocs(q);
    // console.log('visits db',querySnapshotVisit.docs);
    tutorVisits.value = querySnapshotVisit.docs.map(doc => {
      const data = doc.data();
      data.visitDateFront = formatDate(data.visitDate);
      // console.log(data);
      return data;
    });
    // console.log('tutorVisits',tutorVisits);
    function formatDate(date) {
      const timestamp = new Timestamp(date.seconds, date.nanoseconds);
      return format(timestamp.toDate(), 'Pp', { locale: pl });
    }
    
  } catch (error) {
    console.log(error);
  }
});
const formatDate = (date) => {
  // Convert Firestore Timestamp to JS Date object if necessary
  if (date instanceof Timestamp) {
    date = date.toDate();
    return date
  }

  return format(date, 'Pp', { locale: pl });
};
const checkSameDate = (first, second) => {
  if (first.getDate() == second.getDate() && first.getMonth() == second.getMonth() && first.getYear() == second.getYear()) {
    return true
  }
  else { return false }
}
</script>
<template>
  <div>
    <CButton color="primary" @click="() => { visible = !visible }">Szczegóły</CButton>

    <!-- <div v-if="selectedTutor"> -->
      <COffcanvas placement="start" :visible="visible" @hide="() => { visible = !visible }">
        <COffcanvasHeader>
          <COffcanvasTitle>
            <CImage width="50" height="50" :src="selectedTutor.img" alt="" /> {{ selectedTutor.data.first }} {{
              selectedTutor.data.last }}
          </COffcanvasTitle>
          <CCloseButton class="text-reset" @click="() => { visible = false }" />
        </COffcanvasHeader>
        <COffcanvasBody>
          Wiek: {{ selectedTutor.data.age }}<br>
          Przedmiot: {{ selectedTutor.data.subject }}<br>
          Poziom: {{ selectedTutor.data.level }}<br>
          Stawka (h): {{ selectedTutor.data.hourRate }}<br>
          Bio: {{ selectedTutor.data.description }}<br>
          <MakeVisitDialog btnText="Umów" :tutor="selectedTutor" />
          <br>
          Kalendarz dostępności
          <br>
          <VCalendar :attributes="attrs">
            <template #day-popover="{ day, format, masks }">
              <div class="px-2">
                <div class="text-xs text-gray-700 dark:text-gray-300 font-semibold text-center">
                  Wizyty danego dnia:
                  <br>
                </div>
                <CListGroup v-for="{ key, customData } in attrs" :key="key">
                  <CListGroupItem v-if="checkSameDate(day.date, formatDate(customData.visitDate))">
                    {{ customData.visitDateFront }}
                  </CListGroupItem>
                </CListGroup>
              </div>
            </template>
          </VCalendar>
          <br>
          Wybrana data: {{ date }}
          <br>
          <VDatePicker v-model="date" :rules="rules" mode="dateTime" is-required />
        </COffcanvasBody>
      </COffcanvas>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "TutorListLeftPanel",
  data() {
    return {
      visible: false,
      visibleWithBothOptions: false
      // tutorVisits: null,
      // selectedTutorIn: null
    };
  }
}
</script>
