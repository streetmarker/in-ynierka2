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
      first: "",
      last: "",
      born: null,
      subject: "",
      level: "",
      userId: "",
      description: "",
      hourRate: 0,
      isActiveTutor: false,
    },
    role: {
      type: '',
      loggedIn: false
    },
    tmpRole: '', // selected role on login 
    tmpVisitDate: null
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
    }
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    setTutor(state, tutorData) {
      state.tutor = tutorData;
    },
    setUserRole(state, payload) {
      console.log(payload.type, ' | ', payload.loggedIn);
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
