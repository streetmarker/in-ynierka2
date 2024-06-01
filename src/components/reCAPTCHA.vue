<template>
  <div>
    <button @click="recaptcha">Execute reCAPTCHA</button>
  </div>
</template>

<script>
// import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3'

export default {
  // setup() {
  //   setTimeout(async () => {

  //     console.log(useReCaptcha());
  //     const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()

  //   const recaptcha = async () => {
  //     // (optional) Wait until recaptcha has been loaded.
  //     await recaptchaLoaded()

  //     // Execute reCAPTCHA with action "login".
  //     const token = await executeRecaptcha('login')
  //     console.log(token);
  //     // Do stuff with the received token.
  //   }

  //   return {
  //     recaptcha
  //   }
  // }, 3000);
  // },
};
</script>
