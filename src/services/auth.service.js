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
        return response.data;
      });
  }

  logout() {
    // localStorage.removeItem("user");
    return axios.post(API_URL + "logout/").then((response) => {
      return response.data;
    });
  }

  register(user) {
    return axios
      .post(API_URL + "register/", {
        username: user.username,
        password: user.password,
      })
      .then((response) => {
        return response.data;
      });
  }

  changePwd(user, newPwd) {
    return axios
      .post(API_URL + "change-password/", {
        username: user.username,
        password: user.password,
        newPassword: newPwd,
      })
      .then((response) => {
        return response.data;
      });
  }

  loginState() {
    return axios.get(API_URL + "state/").then((response) => {
      return response.data;
    });
  }

  userInfo(username) {
    return axios
      .get(API_URL + "info/", {
        params: {
          username: username,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  userProfile(username) {
    return axios
      .get(API_URL + "profile/", {
        params: {
          username: username,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  changeProfile(profile) {
    return axios
      .post(API_URL + "profile/", {
        profile: profile,
      })
      .then((response) => {
        return response.data;
      });
  }

  changeSignature(signature) {
    return axios
      .post(API_URL + "signature/", {
        signature: signature,
      })
      .then((response) => {
        return response.data;
      });
  }
}

export default new AuthService();
