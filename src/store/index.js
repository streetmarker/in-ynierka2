import { createStore } from "vuex";

export default createStore({
  state: {
    user: null
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
