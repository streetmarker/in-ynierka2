<script setup>
import {
  CModal,
  CButton,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from "@coreui/vue";
const emit = defineEmits(['open'])

function makeReservation() {
  emit('open')
}
</script>
<template>
  <CButton color="primary" @click="() => { visibleLiveDemo = true }">{{btnText}}</CButton>
  <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }" aria-labelledby="LiveDemoExampleLabel">
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">Potwierdzenie wizyty</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <h2>Korepetytor: {{ tutor.data.first+" "+tutor.data.last }}</h2>
      <p>Termin: {{ visitDate }}</p>
      <!-- <button @click="confirmBooking">Potwierdź i opłać przez PayPal</button> -->
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        Zamknij
      </CButton>
      <CButton @click="makeReservation" color="primary">Potwierdź i przejdź do płatności</CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import { defineEmits } from 'vue';

// defineEmits(['open']);
// const emit = defineEmits(['open'])


export default {
  props: {
    // showDialog: {
    //   type: Boolean,
    //   required: true
    // },
    tutor: {
      type: Object,
      required: true
    },
    btnText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visibleLiveDemo: false,
      date: null
    }
  },
  computed: {
    visitDate() {
      this.date = this.$store.state.tmpVisitDate;
      return this.$store.state.tmpVisitDate.toLocaleString(); // TODO do komponentu
    },
  },
  // mounted() {
  //   this.visibleLiveDemo = this.showDialog;
  // },
  methods: {
    // makeReservation() {
    //   emit('open');
    // }
  }
}
</script>