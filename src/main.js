import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import {
  CModal,
  CButton,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
  CCard,
  CImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CNavbar,
  CContainer,
  CNavbarNav,
  CNavbarBrand,
  CForm,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CListGroup,
  CListGroupItem,
  CTable,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CRow,
  CCol,
  CCollapse,
  CFormLabel,
  CFormCheck,
  CFormSelect,
  CFooter,
  CLink,
  CNavbarToggler,
  CNavItem,
  CNavLink,
  CNavbarText,
  CTableCaption,
  CCardHeader
} from '@coreui/vue';
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Multiselect from 'vue-multiselect';

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

// Rejestracja globalna komponentów
app.component('CModal', CModal);
app.component('CButton', CButton);
app.component('CModalHeader', CModalHeader);
app.component('CModalTitle', CModalTitle);
app.component('CModalBody', CModalBody);
app.component('CModalFooter', CModalFooter);
app.component('CToaster', CToaster);
app.component('CToast', CToast);
app.component('CToastHeader', CToastHeader);
app.component('CToastBody', CToastBody);
app.component('CCard', CCard);
app.component('CImage', CImage);
app.component('CCardBody', CCardBody);
app.component('CCardTitle', CCardTitle);
app.component('CCardText', CCardText);
app.component('CNavbar', CNavbar);
app.component('CContainer', CContainer);
app.component('CNavbarNav', CNavbarNav);
app.component('CNavbarBrand', CNavbarBrand);
app.component('CForm', CForm);
app.component('CFormInput', CFormInput);
app.component('CDropdown', CDropdown);
app.component('CDropdownToggle', CDropdownToggle);
app.component('COffcanvas', COffcanvas);
app.component('COffcanvasHeader', COffcanvasHeader);
app.component('COffcanvasTitle', COffcanvasTitle);
app.component('CCloseButton', CCloseButton);
app.component('COffcanvasBody', COffcanvasBody);
app.component('CListGroup', CListGroup);
app.component('CListGroupItem', CListGroupItem);
app.component('CTable', CTable);
app.component('CTableBody', CTableBody);
app.component('CTableHeaderCell', CTableHeaderCell);
app.component('CTableDataCell', CTableDataCell);
app.component('CTableHead', CTableHead);
app.component('CTableRow', CTableRow);
app.component('CRow', CRow);
app.component('CCol', CCol);
app.component('CCollapse', CCollapse);
app.component('CFormLabel', CFormLabel);
app.component('CFormCheck', CFormCheck);
app.component('CFormSelect', CFormSelect);
app.component('CFooter', CFooter);
app.component('CLink', CLink);
app.component('CNavbarToggler', CNavbarToggler);
app.component('CNavItem', CNavItem);
app.component('CNavLink', CNavLink);
app.component('CNavbarText', CNavbarText);
app.component('CTableCaption', CTableCaption);
app.component('Multiselect', Multiselect);
app.component('CCardHeader', CCardHeader);

// Ustawienie globalnej instancji Axios
app.config.globalProperties.$axios = axios;

app.mount("#app");
