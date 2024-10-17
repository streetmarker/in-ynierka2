<template>
  <div>
    <CButton color="primary" @click="() => { initPaypal() }">Opłać wizytę</CButton>
    <CModal :visible="visibleScrollingLongContentDemo" @close="() => { visibleScrollingLongContentDemo = false }"
      aria-labelledby="ScrollingLongContentExampleLabel">
      <CModalHeader>
        <CModalTitle id="ScrollingLongContentExampleLabel">Umawianie wizyty</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <h2>Dokonaj płatności za wizytę</h2><br>
        Korepetytor: {{ tutor.data.first + " " + tutor.data.last }}<br>
        Data: {{ visitDate }}<br>
        Przedmiot: {{ tutor.data.subject }}<br>
        Poziom: {{ tutor.data.level }} <br>
        Stawka godzinowa: {{ tutor.data.hourRate }} <br>
        Ilość godzin: 1 <br>
        Do zapłaty: {{ tutor.data.hourRate }} zł<br><br>
        <div id="paypal-btn"></div>
      </CModalBody>
    </CModal>
  </div>
</template>

<script>
// @ is an alias to /src
// import Dashboard from "@/components/WelcomePage.vue";
import { loadScript } from "@paypal/paypal-js";
// import TutorList from "@/components/TutorList.vue";
import { collection, addDoc } from "firebase/firestore";
import { db, deleteIdbData, dbPromiseVisits} from "../firebaseInitializer";

export default {
  name: "PaypalView",
  props: {
    visitDate: {
      type: Date,
      required: true
    },
    tutor: {
      type: Object,
      required: true
    },
    visitId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      visibleScrollingLongContentDemo: false,
    };
  },
  beforeMount() {
    // this.initPaypal(true);

  },
  methods: {
    async initPaypal(onlyMount) {

      if (!onlyMount) {
        this.visibleScrollingLongContentDemo = true;
        this.$emit('reserved');
      }
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
              createOrder: (data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: 0 // this.tutor.data.hourRate // Kwota do zapłaty
                    }
                  }]
                });
              },
              onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                  this.handlePayment(details);
                });
              }
              })
            .render("#paypal-btn");
        } catch (error) {
          console.error("failed to render the PayPal Buttons", error);
        }
      }
    },
    async handlePayment(details) {
      var today = new Date();
      var UID = this.$store.state.user.id;
      try {
        await addDoc(collection(db, "payment"), {
          id: Math.random() * 100,
          clientId: UID,
          tutorId: this.tutor.id,
          visitId: this.visitId, // TODEL ?
          cost: details.purchase_units[0].amount.value,
          currency: details.purchase_units[0].amount.currency_code,
          transactionDate: today,
          transactionStatus: details.status,
          details: details
        });
        deleteIdbData(dbPromiseVisits); // TODO przejściowe rozwiązanie

        const event = new CustomEvent('trigger-toast', {
          detail: { title:'Opłacono wizytę', content:'', photoUrl:'https://cdn-icons-png.flaticon.com/512/4436/4436481.png', hide: true  }
        });
        window.dispatchEvent(event);
      } catch (error) {
        const event = new CustomEvent('trigger-toast', {
          detail: { title:'Wystąpił problem z płatnością', content:'Prosimy o kontakt z administratorem', hide: true }
        });
        window.dispatchEvent(event);
      }
      this.visibleScrollingLongContentDemo = false;
      this.$emit('paid');
    }
  }
};
</script>
