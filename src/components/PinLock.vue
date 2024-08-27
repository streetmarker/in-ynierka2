<template>
    <div v-if="isLocked" class="pin-lock-overlay">
      <div class="pin-lock-container">
        <h2>Enter PIN</h2>
        <input v-model="pin" type="password" maxlength="4" placeholder="****" />
        <button @click="unlockPage">Unlock</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
    <div v-else>
      <slot></slot> <!-- Zawartość strony pojawi się tutaj po odblokowaniu -->
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const correctPin = '2222'; // Ustaw swój PIN
  const isLocked = ref(true);
  const pin = ref('');
  const errorMessage = ref('');
  
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
  </style>
  