import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const API_URL = "ws://localhost:5000/competition";
// const API_URL = "ws://localhost:8765";

class BattleService {
  constructor() {
    this.socket = io(API_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: false,
    });
  }

  checkConnection() {
    if (this.socket.disconnected) {
      throw "Connection failed";
    }
  }

  listeners(type) {
    return this.socket.listeners(type);
  }

  connected() {
    return this.socket.connected;
  }

  connect(success, fail) {
    this.socket.once("connect", (...args) => {
      this.socket.off("connect_error");
      return success(args);
    });
    this.socket.once("connect_error", (...args) => {
      this.socket.off("connect");
      return fail(args);
    });
    this.socket.connect();
  }

  disconnect(func) {
    this.checkConnection();
    this.socket.once("disconnect", func);
    this.socket.disconnect();
  }

  send(msg) {
    this.checkConnection();
    if (msg.param === undefined) {
      this.socket.emit(msg.type);
    } else {
      this.socket.emit(msg.type, ...msg.params);
    }
  }

  receive(handler) {
    this.checkConnection();
    this.socket.once(handler.type, handler.func);
  }

  listen(handler) {
    this.checkConnection();
    this.socket.on(handler.type, handler.func);
  }

  drop(handler) {
    this.checkConnection();
    this.socket.off(handler.type);
  }
}

export default new BattleService();
