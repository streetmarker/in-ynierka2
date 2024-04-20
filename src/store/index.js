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
    tmpRole: '' // selected role on login 
  },
  getters: {
    getTmpRole: (state) => {
      return state.tmpRole;
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
      console.log('setTmpRole: ', tmpRole);
      state.tmpRole = tmpRole;
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
