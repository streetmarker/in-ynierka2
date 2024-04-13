import { createStore } from "vuex";

export default createStore({
  state: {
    user: {
      fullName: "",
      email: "",
      photo: "",
      provider: ""
    }
  },
  getters: {},
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    }
  },
  actions: {},
  modules: {},
});
