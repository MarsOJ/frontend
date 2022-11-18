import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("ws://localhost:5000/competition", {
  withCredentials: true,
  autoConnect: false,
});

const state = {
  status: "inactive",
  socket: socket,
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
    send({ state }, msg) {
      if (msg.content === undefined) {
        state.socket.emit(msg.type);
      } else {
        state.socket.emit(msg.type, msg.content);
      }
    },
    setHandlerOnce({ commit, state }, handler) {
      if (!state.connected) {
        throw "Connection failed";
      }

      state.socket.once(handler.type, handler.func);
      // console.log("[store]", handler.type, "handler: ", state.socket.listeners(handler.type));
      commit("listen", handler.type);
    },
    setHandler({ commit, state }, handler) {
      if (!state.connected) {
        throw "Connection failed";
      }

      state.socket.on(handler.type, handler.func);
      state.listeners.push(handler.type);
      // console.log("[store]", handler.type, "handler: ", state.socket.listeners(handler.type));
      commit("listen", handler.type);
    },
    removeHandler({ commit, state }, handler) {
      if (!state.connected) {
        throw "Connection failed";
      }

      state.socket.off(handler.type);
      var index = state.listeners.indexOf(handler.type);
      if (index > -1) {
        state.listeners.splice(index, 1);
      }
      // console.log("[store]", handler.type, "handler: ", state.socket.listeners(handler.type));
      commit("stop");
    },
    connectSocket({ commit, state }) {
      if (!state.socket.connected) {
        state.socket.connect();
        commit("connect");
        state.socket.on("stateChanged", (oldState, newState) => {
          if (oldState !== newState && newState !== "Connected") {
            commit("cancel");
          } else {
            commit("end");
          }
        });
      }
    },
    closeSocket({ commit, state }) {
      state.socket.disconnect();
      commit("end");
    },
  },
  mutations: {
    connect(state) {
      state.connected = true;
      state.status = "connected";
      console.log("[store]", state);
    },
    listen(state) {
      state.status = "listening";
      console.log("[store]", state);
    },
    stop(state) {
      if (state.listeners.length === 0) {
        state.status = "connected";
      }
      console.log("[store]", state);
    },
    end(state) {
      state.connected = false;
      state.status = "inactive";
      console.log("[store]", state);
    },
  },
};
