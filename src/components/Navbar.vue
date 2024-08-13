<template>
    <CNavbar expand="lg" style="border-bottom: 2px solid grey;" color-scheme="dark" class="bg-dark">
      <CContainer fluid>
        <CNavbarBrand><router-link style="text-decoration: none" to="/">
            <img src="../../public/firebase-logo.png" alt="" width="22" height="24" class="d-inline-block align-top" />Tutor
            App</router-link></CNavbarBrand>
        <CNavbarBrand>

          <CButton href="#/panel">
            <img style="width: 30px; height: 30px; border: 1px solid transparent;" src="../../public/5964729.png" />
          </CButton>

        </CNavbarBrand>
        <CNavbarToggler class="bg-light" @click="visible = !visible" />
        <CCollapse class="navbar-collapse" :visible="visible">
          <CNavbarNav>
            <div v-if="clientAccess">
              <CNavItem><router-link style="text-decoration: none" v-if="clientAccess" to="/panel">Panel
                  klienta</router-link></CNavItem>
              <CNavItem><router-link style="text-decoration: none" v-if="clientAccess" to="/tutor-list">Lista
                  korepetytorów</router-link>
              </CNavItem>
            </div>
            <div v-if="tutorAccess">
              <CNavItem><router-link style="text-decoration: none" v-if="tutorAccess" to="/tutor-manager">Zarządzanie
                  wizytami</router-link>
              </CNavItem>
              <CNavItem><router-link style="text-decoration: none" v-if="tutorAccess" to="/tutor-admin">Zarządzanie
                  ofertą</router-link>
              </CNavItem>
            </div>
            <div v-if="adminAccess">
              <CNavItem><router-link style="text-decoration: none" v-if="adminAccess" to="/admin">Administracja
                  aplikacją</router-link></CNavItem>
            </div>
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
</template>
<script>
  export default {
    data() {
      return { 
        visible: false,
      }
    },
    computed: {
    clientAccess() {
      return (
        this.$store.state.role.loggedIn == true &&
        this.$store.state.role.type == "C"
      );
    },
    tutorAccess() {
      return (
        this.$store.state.role.loggedIn == true &&
        this.$store.state.role.type == "T"
      );
    },
    adminAccess() {
      return (
        this.$store.state.role.loggedIn == true &&
        this.$store.state.role.type == "A"
      );
    },
  },
  }
</script> 