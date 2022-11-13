import axios from "axios";

const API_URL = "http://127.0.0.1:8080/info/";

class BattleService {
  getLastestNews(lastId) {
    console.log(lastId);
    return axios
      .post(API_URL + "get-latest/", {
        lastId: lastId,
      })
      .then((response) => {
        return response.data;
      });
  }

  getNewsDetail(id) {
    return axios.get(API_URL + "details/" + id).then((response) => {
      return response.data;
    });
  }
}

export default new BattleService();
