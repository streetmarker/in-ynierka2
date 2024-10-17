<script setup>
const emit = defineEmits(['open'])

function makeReservation() {
  emit('open')
}
</script>
<template>
  <CButton color="primary" @click="() => { visibleLiveDemo = true }">{{ btnText }}</CButton>
  <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }" aria-labelledby="LiveDemoExampleLabel">
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">Potwierdzenie wizyty</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h2>Korepetytor: {{ tutor.data.first + " " + tutor.data.last }}</h2>
      <p>Termin: {{ visitDate }}</p>
      <!-- <button @click="confirmBooking">Potwierdź i opłać przez PayPal</button> -->
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        Zamknij
      </CButton>
      <!-- <CButton @click="() => { visibleLiveDemo = false }" color="primary">Potwierdź i przejdź do płatności</CButton> -->
      <ClientMakeVisit @reserved="saveVisit()" @paid="closePaid()" :tutor="tutor" :visitDate="date"
        :visitId="visitId" />
    </CModalFooter>
  </CModal>
</template>
<script>
import { db, timeTutor } from "../firebaseInitializer";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { defineEmits } from 'vue';
import ClientMakeVisit from '@/components/VisitPaymentDialog.vue'
import { logEvent } from "firebase/analytics";

export default {
  props: {
    tutor: {
      type: Object,
      required: true
    },
    btnText: {
      type: String,
      required: true
    }
    // selectedDate: { // TODO store czy prop
    //   type: Date,
    //   required: true
    // }
  },
  data() {
    return {
      visibleLiveDemo: false,
      date: null,
      visitId: ''
    }
  },
  mounted() {
    this.stats();
  },
  computed: {
    visitDate() {
      this.date = !!this.$store.state.tmpVisitDate ? this.$store.state.tmpVisitDate : new Date();
      return this.$store.state.tmpVisitDate.toLocaleString(); // TODO do komponentu
    },
  },
  methods: {
    async saveVisit() {
      var today = new Date();
      var details = this.tutor.data;
      var UID = this.$store.state.user.id;
      try {
        var docRef = await addDoc(collection(db, "visit"), {
          id: Math.random() * 100,
          clientId: UID,
          tutorId: this.tutor.id,
          reciveDate: today,
          visitDate: this.date,
          status: 'active',
          details: details
        });
        this.visitId = docRef.id;

        const event = new CustomEvent('trigger-toast', {
          detail: { title: 'Umówiono wizytę', content: '', photoUrl: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png', hide: true }
        });
        window.dispatchEvent(event);
        // perf
        try {
          timeTutor.stop();
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        const event = new CustomEvent('trigger-toast', {
          detail: { title: 'Wystąpił problem', content: 'Prosimy o kontakt z administratorem', hide: true }
        });
        window.dispatchEvent(event);
        console.log(error);
      }
    },
    stats() {
      // try {
      //   perf.stop();
      //   const endTime = performance.now();
      //   const executionTime = endTime - startTime;
      //   logEvent(analytics, 'choose_tutor_time', { value: executionTime.toFixed(2) });
      // } catch (error) {
      //   console.log('error perf tutor', error);
      // }
    },
    closePaid() {
      this.visibleLiveDemo = false;
    }
  }
}
</script>