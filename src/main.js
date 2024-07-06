import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';


import { saveErrorInDb } from "./firebaseInitializer";


const originalError = console.error;  // Zachowaj oryginalne console.error

// Przypisz nową funkcję do console.error
console.error = (...args) => {
  saveErrorInDb(args)  // Wykonaj swoją funkcję
  originalError.apply(console, args);  // Wywołaj oryginalne console.error
};

const app = createApp(App).use(store).use(router)

// Use plugin defaults (optional)
app.use(setupCalendar, {})

// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
// console.log(this.$recaptchaLoaded());
// Ustawienie globalnej instancji Axios
app.config.globalProperties.$axios = axios;

app.mount("#app");
