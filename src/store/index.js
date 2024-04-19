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
    role: {
      type: '',
      loggedIn: false
    },
    tmpRole: '' // selected role on login 
  },
  getters: {
    getTmpRole: (state) => {
      return state.tmpRole;
    }
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    setUserRole(state, payload) {
      console.log(payload.type, ' | ', payload.loggedIn);
      if (payload.type.length > 0) {
        state.role.type = payload.type;
      };
      if (payload.loggedIn == true || payload.loggedIn == false) {
        state.role.loggedIn = payload.loggedIn;
      }
    },
    setTmpRole(state, tmpRole) {
      state.tmpRole = tmpRole;
    }
  },
  actions: {},
  modules: {},
});
