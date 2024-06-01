<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody
} from "@coreui/vue";
</script>
<template>
  <div>
    <CButton color="primary" @click="() => { initPaypal() }">Umów wizytę</CButton>
    <CModal :visible="visibleScrollingLongContentDemo" @close="() => { visibleScrollingLongContentDemo = false }"
      aria-labelledby="ScrollingLongContentExampleLabel">
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel">Umawianie wizyty</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h2>Dokonaj płatności za wizytę</h2><br>
        Korepetytor: Agata Kwiatkowska<br>
        Data: 15.05.2024<br>
        Przedmiot: Matematyka<br>
        Poziom: Studia (rozszerzenie) <br>
        Stawka godzinowa: 80 <br>
        Ilość godzin: 1 <br>
        Do zapłaty: 80 zł<br><br>
        <div id="paypal-btn"></div>
      </CModalBody>
    </CModal>
    <!-- <TutorList /> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import Dashboard from "@/components/WelcomePage.vue";
import { loadScript } from "@paypal/paypal-js";
import TutorList from "@/components/TutorList.vue";

export default {
  name: "HomeView",
  data() {
    return {
      visibleScrollingLongContentDemo: false,
    };
  },
  mounted() {
    this.initPaypal();

  },
  methods: {
    async initPaypal() {
      this.visibleScrollingLongContentDemo = true;
      let paypal;

      try {
        paypal = await loadScript({
          clientId: process.env.VUE_APP_PAYPAL_CLIENT_ID,
          currency: "PLN"
        });
      } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
      }

      if (paypal) {
        try {
          await paypal
            .Buttons({
              style: {
                layout: "vertical",
                color: "blue",
                shape: "pill",
                label: "paypal",
              },
            })
            .render("#paypal-btn");
        } catch (error) {
          console.error("failed to render the PayPal Buttons", error);
        }
      }
    },
  }
};
</script>
