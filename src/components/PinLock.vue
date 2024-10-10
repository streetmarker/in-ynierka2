<template>
  <div v-if="isLocked" class="pin-lock-overlay">
    <div class="container">
      <div class="pin-lock-container">
        <h1>Aplikacja do zarządzania korepetycjami</h1><h1> Tutor App</h1>
      </div>
      <div class="pin-lock-container">
        <h2>Enter PIN</h2>
        <input v-model="pin" type="password" maxlength="4" placeholder="****" />
        <button @click="unlockPage">Unlock</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <slot></slot> <!-- Zawartość strony pojawi się tutaj po odblokowaniu -->
  </div>
</template>

<script setup>
import { auth } from '@/firebaseInitializer';
import { ref, onMounted } from 'vue';
import Loader from '../../public/loader';

const correctPin = '2222'; // Ustaw swój PIN
const isLocked = ref(true);
const pin = ref('');
const errorMessage = ref('');

const checkToken = () => {
  function waitForCurrentUser(callback = () => { }, maxWaitTime = 3000, interval = 500) {
    let elapsedTime = 0;

    function checkCurrentUser() {
      if (auth.currentUser) {
        callback();
        Loader.close();
      } else if (elapsedTime >= maxWaitTime) {
        console.error("Przekroczono limit czasu oczekiwania na uzyskanie danych użytkownika.");
        Loader.close();
      } else {
        setTimeout(() => {
          elapsedTime += interval;
          checkCurrentUser();
        }, interval);
      }
    }

    checkCurrentUser();
  }
  waitForCurrentUser();
  isLocked.value = !!auth.currentUser ? false : true;
  console.log('Locked ui: ', isLocked.value);
};
onMounted(() => {
  setTimeout(() => {
    checkToken();

  }, 2000);
});

const unlockPage = () => {
  if (pin.value === correctPin) {
    isLocked.value = false;
    errorMessage.value = '';
  } else {
    errorMessage.value = 'Incorrect PIN';
    pin.value = '';
  }
};
</script>

<style scoped>
.pin-lock-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pin-lock-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 10px 0;
}

input[type="password"] {
  width: 100px;
  padding: 5px;
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>