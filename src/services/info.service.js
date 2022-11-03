import axios from "axios";
// import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/info/";

class InfoService {
  getLastestNews(lastId) {
    return axios
      .get(API_URL + "get-latest/", {
        lastId: lastId
      })
      .then((response) => {
        return response.data;
      });
  }

  getNewsDetail(id) {
    return axios
      .get(API_URL + "details/" + id)
      .then((response) => {
        return response.data;
      });
  }
}

export default new InfoService();
