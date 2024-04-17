<template>
  <div class="home">

    <div id="paypal-btn"></div>

  </div>
</template>

<script>
// @ is an alias to /src
// import Dashboard from "@/components/WelcomePage.vue";
import { loadScript } from "@paypal/paypal-js";

export default {
  name: "HomeView",
  data() {
    return {
      //
    };
  },
  mounted() {
    this.initPaypal();

  },
  methods: {
    async initPaypal() {
      let paypal;

      try {
        paypal = await loadScript({
          clientId: process.env.VUE_APP_PAYPAL_CLIENT_ID,
          currency: "PLN",
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
