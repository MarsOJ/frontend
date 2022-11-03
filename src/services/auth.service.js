import axios from "@/axios";

const API_URL = "http://localhost:5000/account/";

class AuthService {
  login(user) {
    return axios
      .post(API_URL + "login/", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        // if (response.data.accessToken) {
        //   localStorage.setItem("user", JSON.stringify(response.data));
        // }
        return response.data;
      });
  }

  logout() {
    // localStorage.removeItem("user");
    return axios.post(API_URL + "logout/");
  }

  register(user) {
    return axios.post(API_URL + "register/", {
      username: user.username,
      password: user.password,
    });
  }

  loginState() {
    return axios.get(API_URL + "state/").then((response) => {
      return response.data;
    });;
  }
}

export default new AuthService();
