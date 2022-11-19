import AuthService from "@/services/auth.service";

const initialState = { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  getters: {
    loggedIn(state) {
      return state.status.loggedIn;
    },
  },
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          commit("loginSuccess", user);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      return AuthService.logout().then(
        (response) => {
          commit("logout");
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    alter({ commit }, user) {
      if (user !== null) {
        commit("loginSuccess", user);
      } else {
        commit("loginFailure");
      }
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
  },
};
