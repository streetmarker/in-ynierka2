<!-- <template>
  <Dialog :open="isOpen" @close="showDialog = false">
    <div class="dialog-content">
      <h2>Korepetytor: {{ tutor.data.first }}</h2>
      <p>Termin: {{ selectedDate }}</p>
      <button @click="confirmBooking">Potwierdź i opłać przez PayPal</button>
    </div>
  </Dialog>
</template>

<script setup>
  import { ref } from 'vue'
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
  } from '@headlessui/vue'

  const isOpen = ref(true)

  function setIsOpen(value) {
    isOpen.value = value
  }
</script>

<script>
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
    selectedDate: {
      type: String,
      required: true
    }
  },
  // setup(props) {
  //   const showPayPalDialog = ref(false);

  //   const confirmBooking = () => {
  //     // Tutaj możesz umieścić kod do potwierdzenia rezerwacji i otwarcia okna PayPal
  //     showPayPalDialog.value = true;
  //   };

  //   return {
  //     confirmBooking,
  //     showPayPalDialog
  //   };
  // }
};
</script> -->
<script setup>
import {
  CModal,
  CButton,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from "@coreui/vue";
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
      <CButton color="primary">Potwierdź i przejdź do płatności</CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
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
  // }
}
</script>