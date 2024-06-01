import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";

const app = createApp(App).use(store).use(router)

// console.log(this.$recaptchaLoaded());
// Ustawienie globalnej instancji Axios
app.config.globalProperties.$axios = axios;

app.mount("#app");
