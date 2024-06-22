<script setup>
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CButton,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from "@coreui/vue";
</script>

<template>
    <!-- <CButton color="primary" @click="createToast('Example Title', 'Example content', 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png')">Send a toast</CButton> -->
    <CToaster class="p-3" placement="top-end">
      <CToast :autohide="false" v-for="(toast, index) in toasts" visible :key="index">
        <CToastHeader closeButton>
          <span class="me-auto fw-bold">{{ toast.title }}</span>
          <small>teraz</small>
        </CToastHeader>
        <CToastBody>
          <img v-if="toast.photoUrl" :src="toast.photoUrl" alt="photo" style="max-width: 40%;"><br>
          {{ toast.content }}
        </CToastBody>
      </CToast>
    </CToaster>
  </template>
  
  <script>
  export default {
    data() {
      return {
        toasts: []
      };
    },
    methods: {
      createToast(title, content, photoUrl) {
        this.toasts.push({
          title: title,
          content: content,
          photoUrl: photoUrl
        });
      }
    },
    created() {
      window.addEventListener('trigger-toast', this.externalCreateToast);
    },
    beforeDestroy() {
      window.removeEventListener('trigger-toast', this.externalCreateToast);
    },
    methods: {
      externalCreateToast(event) {
        const { title, content, photoUrl } = event.detail;
        this.createToast(title, content, photoUrl);
      },
      createToast(title, content, photoUrl) {
        this.toasts.push({
          title: title,
          content: content,
          photoUrl: photoUrl
        });
      }
    }
  };
  </script>
  