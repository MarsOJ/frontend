import axios from "@/axios";
import authHeader from "./auth-header";

// const API_URL = "http://localhost:5000/";
const API_URL = `http://${import.meta.env.VITE_APP_BASE_URL}/`;

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

export default new UserService();
