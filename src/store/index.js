import { createStore } from "vuex";

export default createStore({
  state: {
    user: {
      id: "",
      fullName: "",
      email: "",
      photo: "",
      provider: ""
    },
    tutor: {
      // first: "",
      // last: "",
      // born: null,
      // subject: "",
      // level: "",
      // userId: "",
      // description: "",
      // hourRate: 0,
      // isActiveTutor: false,
    },
    role: {
      type: '',
      loggedIn: false
    },
    tmpRole: '', // selected role on login 
    tmpVisitDate: null,
    userVisits: []
  },
  getters: {
    getTmpRole: (state) => {
      return state.tmpRole;
    },
    getTmpVisitDate: (state) => {
      return state.tmpVisitDate;
    },
    getUserRole: (state) => {
      return state.role;
    },
    getUID(state){
      return state.user.id;
    }
  },
  mutations: {
    setUser(state, userData) {
      if (!userData.photo) {
        userData.photo = 'https://img.freepik.com/premium-vector/anonymous-user-circle-icon-vector-illustration-flat-style-with-long-shadow_520826-1931.jpg'
      }
      state.user = userData;
    },
    setTutor(state, tutorData) {
      state.tutor = tutorData;
    },
    setUserRole(state, payload) {
      // console.log(payload.type, ' | ', payload.loggedIn);
      if (!!payload.type) {
        state.role.type = payload.type;
      };
      if (payload.loggedIn == true || payload.loggedIn == false) {
        state.role.loggedIn = payload.loggedIn;
      }
    },
    setTmpRole(state, tmpRole) {
      state.tmpRole = tmpRole;
    },
    setTmpVisitDate(state, tmpVisitDate) {
      state.tmpVisitDate = tmpVisitDate;
    },
    setUserVisits(state, userVisitsData) {
      state.userVisits = userVisitsData;
    },
    setIsActiveTutor(state, isActive) {
      state.isActiveTutor = isActive;
    },
    resetUser(state) {
      state.user = {
          id: "",
          fullName: "",
          email: "",
          photo: "",
          provider: ""
        },
      state.role = {
          type: '',
          loggedIn: false
        },
      state.tmpRole = ''
    }
  },
  actions: {},
  modules: {},
});
