import { createStore } from "vuex";
import { auth } from "./modules/auth";
import { competition } from "./modules/competition";

export default createStore({
  modules: {
    auth,
    competition,
  },
});
