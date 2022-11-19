import BattleService from "@/services/battle.service";

const state = {
  status: "inactive",
  connected: false,
  listeners: [],
};

export const competition = {
  namespaced: true,
  state: state,
  getters: {
    status(state) {
      return state.status;
    },
    connected(state) {
      return state.connected;
    },
  },
  actions: {
    send(_context, msg) {
      BattleService.send(msg);
    },
    setHandlerOnce(_context, handler) {
      BattleService.receive(handler);
    },
    setHandler({ commit }, handler) {
      BattleService.listen(handler);
      commit("listen", handler.type);
    },
    removeHandler({ commit }, handler) {
      BattleService.drop(handler);
      commit("stop", handler.type);
    },
    connectSocket({ commit }) {
      if (!BattleService.connected()) {
        return new Promise((resolve, reject) => {
          BattleService.connect(
            () => {
              commit("connect");
              resolve("connected");
            },
            () => {
              reject(new Error("Connection timeout"));
            }
          );
        });
      }
      return Promise.resolve("already connected");
    },
    closeSocket({ commit }) {
      if (BattleService.connected()) {
        return new Promise((resolve) => {
          BattleService.disconnect(() => {
            commit("end");
            resolve("closed");
          });
        });
      }
      return Promise.resolve("already closed");
    },
  },
  mutations: {
    connect(state) {
      state.connected = true;
      state.status = "connected";
      console.log("[store] (connect)", state);
    },
    listen(state, type) {
      state.status = "listening";
      state.listeners.push(type);
      console.log("[store] (listen)", state);
    },
    stop(state, type) {
      var index = state.listeners.indexOf(type);
      if (index > -1) {
        state.listeners.splice(index, 1);
      }
      if (state.listeners.length === 0) {
        state.status = "connected";
      }
      console.log("[store] (stop)", state);
    },
    end(state) {
      state.connected = false;
      state.status = "inactive";
      console.log("[store] (end)", state);
    },
  },
};
